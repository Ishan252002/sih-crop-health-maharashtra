import type { CropIdentification, DiagnosisResult } from "../types";

/**
 * Where a result came from. This is the only thing the UI needs in order to label
 * inference honestly, and it is never inferred or defaulted.
 *  - "demo"   a controlled sample tile, deterministic, simulated
 *  - "vision" a real image sent to a real vision model and analysed by it
 */
export type AnalysisSource = "demo" | "vision";

export type AnalysisErrorCode =
  | "not_configured"
  | "rate_limited"
  | "unsupported_image"
  | "image_too_large"
  | "provider_failed"
  | "invalid_response"
  | "unknown_sample"
  | "network";

/**
 * One result shape for both paths.
 *
 *  - ok              crop is known and a condition was identified. Full flow runs.
 *  - low_confidence  not enough evidence. Farmer confirms the crop, no disease is claimed.
 *  - error           analysis could not run. Never presented as a prediction.
 *
 * `crop` and `diagnosis` keep the existing project types, so the risk engine, IPM
 * advisory, AnalysisStages, expert queue and CropCase record are untouched.
 */
export type AnalysisResult =
  | { status: "ok"; source: AnalysisSource; crop: CropIdentification & { cropId: string }; diagnosis: DiagnosisResult }
  | {
      status: "low_confidence";
      source: AnalysisSource;
      topGuess: string | null;
      confidence: number;
      alternatives: { cropId: string; confidence: number }[];
      /** "healthy" means no condition was visible, which is not the same as a failed diagnosis. */
      reason: "insufficient_evidence" | "unsupported_condition" | "healthy" | "below_threshold";
    }
  | { status: "error"; source: AnalysisSource; code: AnalysisErrorCode; reason: string };

/** Raw JSON we ask the model for. Everything here is untrusted until normalize.ts has checked it. */
export interface RawVisionPayload {
  crop?: unknown;
  cropConfidence?: unknown;
  cropAlternatives?: unknown;
  conditionType?: unknown;
  conditionId?: unknown;
  conditionName?: unknown;
  conditionConfidence?: unknown;
  severity?: unknown;
  affectedAreaPercent?: unknown;
  symptoms?: unknown;
  reasoning?: unknown;
  alternatives?: unknown;
  notes?: unknown;
}

export interface VisionInput {
  imageBase64: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  /** Farmer-supplied context. Used as a hint only, never allowed to override visual evidence. */
  cropHint?: string;
  cropStage?: string;
  location?: string;
}

/**
 * Provider adapter. Swap the implementation and nothing above this line changes.
 */
export interface VisionProvider {
  id: string;
  /** Human-readable label shown in the UI only after a real inference succeeds. */
  label: string;
  isConfigured(): boolean;
  /** Readable name of the model actually configured, shown on real-upload results. */
  displayName(): string;
  analyze(input: VisionInput): Promise<RawVisionPayload>;
}

/** Crop head cut-off. Below this the farmer confirms the crop instead of the app claiming one. */
export const VISION_CROP_THRESHOLD = 60;

/**
 * Detail line shown on a real-upload result. The model name is the one actually
 * configured, and "experimental" is not decoration: this path runs a general-purpose
 * vision model with no agricultural training and no validated accuracy.
 */
export function realModelLabel(modelDisplayName: string): string {
  return `${modelDisplayName} · experimental`;
}
