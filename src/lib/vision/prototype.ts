import type { AnalysisResult } from "./types";

/**
 * Local prototype inference for a real farmer photo.
 *
 * This runs entirely in the browser. There is no server route, no API key and no external
 * model call anywhere in this path, so the app costs nothing to run and works offline.
 *
 * What it deliberately does NOT do is guess. The prototype ships a trained classifier for
 * nothing: the deterministic results in ai-mock.ts belong to controlled demo samples and are
 * simulated. An arbitrary photo therefore comes back as `low_confidence`, the farmer confirms
 * which crop it is, and the case goes to an agronomist. Inventing a disease from a photo the
 * prototype cannot read would be a fabricated diagnosis, and a farmer would spray on it.
 */

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Kept so the scan animation still covers a plausible amount of work rather than snapping. */
const PROTOTYPE_LATENCY_MS = 220;

export async function analyzeUploadedImage(
  file: File,
  _context: { cropHint?: string; cropStage?: string; location?: string } = {},
): Promise<AnalysisResult> {
  void _context;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return { status: "error", source: "upload", code: "unsupported_image", reason: `Unsupported file type: ${file.type || "unknown"}` };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { status: "error", source: "upload", code: "image_too_large", reason: `Image is ${(file.size / 1024 / 1024).toFixed(1)} MB, limit is 5 MB` };
  }
  if (file.size === 0) {
    return { status: "error", source: "upload", code: "unsupported_image", reason: "Image file is empty" };
  }

  await new Promise((resolve) => setTimeout(resolve, PROTOTYPE_LATENCY_MS));

  // No trained crop head for arbitrary photos, so no crop is claimed and no shortlist is
  // offered. The farmer picks the crop and an agronomist reviews the case.
  return {
    status: "low_confidence",
    source: "upload",
    topGuess: null,
    confidence: 0,
    alternatives: [],
    reason: "insufficient_evidence",
  };
}
