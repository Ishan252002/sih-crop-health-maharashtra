import type { AnalysisErrorCode, AnalysisResult } from "./types";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Sends a real uploaded image to our own API route, which is the only place that
 * talks to the vision provider. No provider name, endpoint or key exists on the client.
 *
 * Never returns a fabricated result: a failure comes back as status "error" and the
 * UI says so rather than falling back to simulated inference.
 */
export async function analyzeUploadedImage(
  file: File,
  context: { cropHint?: string; cropStage?: string; location?: string } = {},
): Promise<AnalysisResult> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return { status: "error", source: "vision", code: "unsupported_image", reason: `Unsupported file type: ${file.type || "unknown"}` };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { status: "error", source: "vision", code: "image_too_large", reason: `Image is ${(file.size / 1024 / 1024).toFixed(1)} MB, limit is 5 MB` };
  }

  const body = new FormData();
  body.append("image", file);
  if (context.cropHint) body.append("crop", context.cropHint);
  if (context.cropStage) body.append("cropStage", context.cropStage);
  if (context.location) body.append("location", context.location);

  try {
    const res = await fetch("/api/analyze-crop", { method: "POST", body });
    const json = (await res.json()) as AnalysisResult | { status: "error"; code: AnalysisErrorCode; reason: string };
    if (!json || typeof json !== "object" || !("status" in json)) {
      return { status: "error", source: "vision", code: "invalid_response", reason: "Malformed response from analysis endpoint" };
    }
    return { source: "vision", ...json } as AnalysisResult;
  } catch (err) {
    return { status: "error", source: "vision", code: "network", reason: err instanceof Error ? err.message : String(err) };
  }
}
