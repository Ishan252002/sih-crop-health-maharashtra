import type { CropIdentification, DiagnosisResult } from "../types";

/**
 * Where a result came from. This is the only thing the UI needs in order to label
 * inference honestly, and it is never inferred or defaulted.
 *  - "demo"   a controlled sample tile, deterministic, simulated
 *  - "upload" a real farmer photo run through the local prototype path in prototype.ts
 *
 * Both paths are local. Nothing in this app calls an external inference API.
 */
export type AnalysisSource = "demo" | "upload";

export type AnalysisErrorCode = "unsupported_image" | "image_too_large" | "unknown_sample" | "no_analysis";

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
