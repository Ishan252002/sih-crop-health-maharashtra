import { CROPS, THREATS } from "../mock/geo";
import { healthFor } from "../ai-mock";
import type { DiagnosisResult, Severity } from "../types";
import { realModelLabel, VISION_CROP_THRESHOLD, type AnalysisResult, type RawVisionPayload } from "./types";

const CROP_IDS = new Set(CROPS.map((c) => c.id));
const THREAT_IDS = new Set(THREATS.map((t) => t.id));

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/** Model confidences arrive as 0-1 decimals. The app works in whole percentages. */
function pct(v: unknown): number | null {
  if (typeof v !== "number" || Number.isNaN(v)) return null;
  const n = v <= 1 ? v * 100 : v;
  if (n < 0 || n > 100) return null;
  return Math.round(n);
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function strList(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((x) => x.trim()).slice(0, max);
}

function severity(v: unknown): Severity {
  const s = str(v)?.toLowerCase();
  if (s === "severe") return "Severe";
  if (s === "mild") return "Mild";
  return "Moderate";
}

function area(v: unknown): number {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function cropAlternatives(v: unknown): { cropId: string; confidence: number }[] {
  if (!Array.isArray(v)) return [];
  return v
    .flatMap((raw) => {
      if (!isRecord(raw)) return [];
      const id = str(raw.crop) ?? str(raw.cropId);
      const c = pct(raw.confidence);
      if (!id || c === null || !CROP_IDS.has(id)) return [];
      return [{ cropId: id, confidence: c }];
    })
    .slice(0, 3);
}

function threatAlternatives(v: unknown): { threatId: string; confidence: number }[] {
  if (!Array.isArray(v)) return [];
  return v
    .flatMap((raw) => {
      if (!isRecord(raw)) return [];
      const id = str(raw.conditionId) ?? str(raw.threatId);
      const c = pct(raw.confidence);
      if (!id || c === null || !THREAT_IDS.has(id)) return [];
      return [{ threatId: id, confidence: c }];
    })
    .slice(0, 3);
}

/**
 * Turns an untrusted model payload into an AnalysisResult.
 *
 * Anything the app cannot act on becomes low_confidence rather than a guess: an unknown
 * crop, a condition with no advisory pack, a healthy plant, or a crop confidence under
 * the threshold. Nothing here invents a value the model did not return.
 */
export function normalizeVisionPayload(raw: RawVisionPayload, inferenceMs: number, modelDisplayName: string): AnalysisResult {
  const cropId = str(raw.crop);
  const cropConfidence = pct(raw.cropConfidence);
  const alternatives = cropAlternatives(raw.cropAlternatives);

  if (!cropId || cropConfidence === null) {
    return { status: "error", source: "vision", code: "invalid_response", reason: "Model returned no usable crop or confidence" };
  }

  const cropKnown = CROP_IDS.has(cropId);
  const topGuess = cropKnown ? cropId : (alternatives[0]?.cropId ?? null);

  if (!cropKnown || cropConfidence < VISION_CROP_THRESHOLD) {
    return {
      status: "low_confidence",
      source: "vision",
      topGuess,
      confidence: cropConfidence,
      alternatives,
      reason: cropKnown ? "below_threshold" : "insufficient_evidence",
    };
  }

  const conditionId = str(raw.conditionId);
  const conditionConfidence = pct(raw.conditionConfidence);

  if (conditionId === "healthy") {
    return { status: "low_confidence", source: "vision", topGuess: cropId, confidence: cropConfidence, alternatives, reason: "healthy" };
  }

  // A condition with no advisory pack cannot produce IPM steps, so it is not claimed.
  if (!conditionId || !THREAT_IDS.has(conditionId) || conditionConfidence === null) {
    return { status: "low_confidence", source: "vision", topGuess: cropId, confidence: cropConfidence, alternatives, reason: "unsupported_condition" };
  }

  const diagnosis: DiagnosisResult = {
    threatId: conditionId,
    confidence: conditionConfidence,
    severity: severity(raw.severity),
    affectedArea: area(raw.affectedAreaPercent),
    symptoms: strList(raw.symptoms, 6),
    reasoning: strList(raw.reasoning, 6),
    alternatives: threatAlternatives(raw.alternatives),
    modelVersion: realModelLabel(modelDisplayName),
    inferenceKind: "vision",
    inferenceMs,
    crop: { cropId, confidence: cropConfidence, alternatives, source: "auto" },
    health: healthFor(conditionId),
  };

  return {
    status: "ok",
    source: "vision",
    crop: { cropId, confidence: cropConfidence, alternatives, source: "auto" },
    diagnosis,
  };
}
