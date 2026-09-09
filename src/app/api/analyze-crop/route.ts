import { NextResponse } from "next/server";
import { getVisionProvider } from "@/lib/vision/provider";
import { normalizeVisionPayload } from "@/lib/vision/normalize";
import { checkRateLimit, clientKey, RATE_LIMIT } from "@/lib/vision/rate-limit";
import type { AnalysisErrorCode, AnalysisResult } from "@/lib/vision/types";

export const runtime = "nodejs";
/** Never cached: every upload is a distinct image. */
export const dynamic = "force-dynamic";

const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

const fail = (code: AnalysisErrorCode, reason: string, http: number) =>
  NextResponse.json({ status: "error", source: "vision", code, reason } satisfies AnalysisResult, { status: http });

export async function POST(req: Request) {
  const startedAt = Date.now();

  // Abuse protection first: reject before spending any parsing or provider budget.
  const limit = checkRateLimit(clientKey(req));
  if (!limit.allowed) {
    console.warn(`[analyze-crop] rate limit hit, ${RATE_LIMIT.maxPerWindow} per ${RATE_LIMIT.windowMs / 60000} min exceeded`);
    return NextResponse.json(
      { status: "error", source: "vision", code: "rate_limited", reason: "Too many analysis requests. Try again shortly." } satisfies AnalysisResult,
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("invalid_response", "Request body was not multipart/form-data", 400);
  }

  const image = form.get("image");
  if (!(image instanceof File)) return fail("unsupported_image", "No image field in request", 400);
  if (!ACCEPTED.has(image.type)) return fail("unsupported_image", `Unsupported file type: ${image.type || "unknown"}`, 415);
  if (image.size > MAX_BYTES) return fail("image_too_large", "Image exceeds the 5 MB limit", 413);
  if (image.size === 0) return fail("unsupported_image", "Image file is empty", 400);

  let provider;
  try {
    provider = getVisionProvider();
  } catch (err) {
    console.error("[analyze-crop] provider resolution failed:", err instanceof Error ? err.message : err);
    return fail("not_configured", "Vision provider is not configured", 500);
  }

  if (!provider.isConfigured()) {
    console.error("[analyze-crop] VISION_API_KEY is not set, refusing to fabricate a result");
    return fail("not_configured", "VISION_API_KEY is not set on the server", 503);
  }

  // Size and type only. Raw image bytes are never logged.
  console.info(`[analyze-crop] request received: ${image.type}, ${(image.size / 1024).toFixed(0)} KB, provider=${provider.id}`);

  const imageBase64 = Buffer.from(await image.arrayBuffer()).toString("base64");
  const cropHint = form.get("crop");
  const cropStage = form.get("cropStage");
  const location = form.get("location");

  let raw;
  try {
    raw = await provider.analyze({
      imageBase64,
      mediaType: image.type as "image/jpeg" | "image/png" | "image/webp",
      cropHint: typeof cropHint === "string" ? cropHint : undefined,
      cropStage: typeof cropStage === "string" ? cropStage : undefined,
      location: typeof location === "string" ? location : undefined,
    });
  } catch (err) {
    console.error("[analyze-crop] provider failed:", err instanceof Error ? err.message : err);
    return fail("provider_failed", "The vision provider did not return a result", 502);
  }

  let result: AnalysisResult;
  try {
    result = normalizeVisionPayload(raw, Date.now() - startedAt, provider.displayName());
  } catch (err) {
    console.error("[analyze-crop] normalisation failed:", err instanceof Error ? err.message : err);
    return fail("invalid_response", "Model response did not match the expected contract", 502);
  }

  console.info(
    `[analyze-crop] normalized result: status=${result.status}` +
      (result.status === "ok" ? ` crop=${result.crop.cropId}@${result.crop.confidence}% condition=${result.diagnosis.threatId}@${result.diagnosis.confidence}%` : "") +
      (result.status === "low_confidence" ? ` reason=${result.reason} top=${result.topGuess ?? "none"}@${result.confidence}%` : ""),
  );

  return NextResponse.json(result);
}
