import type { CropIdentification, DiagnosisResult, HealthStatus, Severity } from "./types";

/**
 * Stages shown during the scan. These mirror the vision pipeline only.
 * Risk scoring and the IPM advisory are deliberately NOT listed here: they are the
 * rule engine (risk-engine.ts / i18n/advisories.ts), not neural network output.
 */
export const SCAN_STEPS = [
  { key: "preprocess", label: "Preparing image", detail: "Normalising colour, exposure and leaf segmentation" },
  { key: "features", label: "Extracting features", detail: "Shared backbone over the segmented leaf region" },
  { key: "crop", label: "Identifying crop", detail: "Crop head over the shared feature map" },
  { key: "threat", label: "Identifying disease or pest", detail: "Disease head, healthy classes included" },
  { key: "severity", label: "Estimating severity", detail: "Affected leaf area mapped to a severity band" },
] as const;

/** Label shown wherever the app names the model. Never claims live inference. */
export const MODEL_LABEL = "Mock inference · MobileNetV3-Large (proposed)";

/**
 * Proposed vision architecture, rendered by components/farmer/model-architecture.tsx.
 * One shared backbone with two classification heads, not a cascade of separate models:
 * a cascade compounds error and a wrong crop ID poisons everything below it with no recovery.
 */
export const MODEL_ARCHITECTURE = {
  backbone: {
    name: "MobileNetV3-Large",
    detail: "About 5.4M parameters, built for on-device inference on low-end Android phones",
  },
  heads: [
    { key: "crop", name: "Crop head", detail: "8 Maharashtra crops. Below 70% the farmer is asked to pick the crop." },
    { key: "threat", name: "Disease / pest head", detail: "Disease, pest and healthy classes in one head. Below 75% the case goes to an expert." },
    { key: "severity", name: "Severity estimator", detail: "Affected leaf area, banded into Mild / Moderate / Severe." },
  ],
  ruleEngine: [
    { key: "risk", name: "Risk engine", detail: "Weather, crop stage, soil card and nearby cases. Transparent rules, every factor shown." },
    { key: "advisory", name: "IPM advisory", detail: "Threat and severity mapped to IPM steps in English, Hindi and Marathi." },
  ],
} as const;

export type SampleKey = "tomato-early-blight" | "leaf-blurry" | "upload";

/**
 * Demo sample images used by Check Crop, the landing hero and the AI-detection feature section.
 * To use real field photos, drop the files into public/samples/ and change ONLY these two paths.
 *  - clear:         primary tomato leaf → Early Blight · 94% · Moderate · Confirmed
 *  - lowConfidence: ambiguous tomato leaf → Early Blight (possible) · 61% · Expert Review Required
 */
export const SAMPLE_IMAGES = {
  clear: "/samples/tomato-early-blight-clear.png",
  lowConfidence: "/samples/tomato-early-blight-lowconf.png",
} as const;

interface Profile {
  threatId: string;
  confidence: number;
  severity: Severity;
  affectedArea: number;
  symptoms: string[];
  reasoning: string[];
  alternatives: { threatId: string; confidence: number }[];
}

const CROP_PROFILE: Record<string, Profile> = {
  tomato: {
    threatId: "early-blight", confidence: 94, severity: "Moderate", affectedArea: 21,
    symptoms: ["Concentric target-board rings on 7 lesions", "Chlorotic yellow halo around spots", "Lesions concentrated on lower, older leaves", "No water-soaking or white sporulation seen"],
    reasoning: ["Lesion ring texture matched Alternaria solani reference set at 0.94", "Lesion size 4–9 mm consistent with early blight (late blight lesions are larger and irregular)", "Crop at fruiting stage; older leaves have lower resistance", "Nashik cluster: 36 confirmed early blight cases in 14 km", "72 h humidity 82% and 41 mm rain increase prior probability"],
    alternatives: [{ threatId: "late-blight", confidence: 4 }, { threatId: "leaf-spot", confidence: 2 }],
  },
  grapes: {
    threatId: "powdery-mildew", confidence: 91, severity: "Moderate", affectedArea: 18,
    symptoms: ["White powdery coating on upper surface", "Slight curling of young leaves", "Greyish patches on shoot"],
    reasoning: ["Powdery texture signature strong (0.91)", "No oil-spots on upper surface, ruling out downy mildew", "Dry days with 88% night humidity favour Erysiphe"],
    alternatives: [{ threatId: "downy-mildew", confidence: 7 }],
  },
  cotton: {
    threatId: "bollworm", confidence: 89, severity: "Severe", affectedArea: 34,
    symptoms: ["Entry holes on bolls", "Pink larva detected in one boll", "Rosette flower visible"],
    reasoning: ["YOLO detected larva with box confidence 0.90", "Boll damage exceeds 10% economic threshold", "Pheromone trap counts high in cluster"],
    alternatives: [{ threatId: "whitefly", confidence: 6 }],
  },
  soybean: {
    threatId: "leaf-spot", confidence: 87, severity: "Mild", affectedArea: 9,
    symptoms: ["Small reddish-brown spots with yellow margins", "Spots merging on lower trifoliate"],
    reasoning: ["Cercospora spot pattern matched at 0.87", "Dense canopy and recent rain"],
    alternatives: [{ threatId: "whitefly", confidence: 8 }],
  },
  onion: {
    threatId: "downy-mildew", confidence: 88, severity: "Moderate", affectedArea: 23,
    symptoms: ["Pale elongated patches", "Violet-grey fuzzy growth", "Tip dieback"],
    reasoning: ["Sporulation texture strong match", "Morning dew and high humidity"],
    alternatives: [{ threatId: "leaf-spot", confidence: 9 }],
  },
  sugarcane: {
    threatId: "stem-borer", confidence: 90, severity: "Moderate", affectedArea: 12,
    symptoms: ["Dead heart in central shoot", "Bore hole with frass"],
    reasoning: ["Dead heart pattern strong", "Frass texture identified near node"],
    alternatives: [],
  },
  rice: {
    threatId: "stem-borer", confidence: 86, severity: "Moderate", affectedArea: 14,
    symptoms: ["White ear heads", "Dead heart tillers"],
    reasoning: ["Whitehead detection", "Standing water and high nitrogen"],
    alternatives: [{ threatId: "leaf-spot", confidence: 9 }],
  },
  wheat: {
    threatId: "aphids", confidence: 90, severity: "Mild", affectedArea: 11,
    symptoms: ["Aphid colonies on ear heads", "Honeydew shine"],
    reasoning: ["Insect cluster detection 0.90", "Warm dry spell"],
    alternatives: [],
  },
};

const LOW_CONF: Profile = {
  threatId: "early-blight", confidence: 61, severity: "Mild", affectedArea: 8,
  symptoms: ["Small dark spots, edges unclear", "Image partially blurred, low light", "Possible dust or spray residue overlap"],
  reasoning: ["Spot texture partially matches Alternaria (0.61) but rings not resolved", "Low-light image reduces feature quality", "Leaf spot and bacterial spot remain plausible", "Confidence below 75% threshold, routing to expert"],
  alternatives: [{ threatId: "leaf-spot", confidence: 29 }, { threatId: "whitefly", confidence: 6 }],
};

/* ------------------------------------------------------------------ *
 * Crop head
 * ------------------------------------------------------------------ */

/** Below this, the crop head has not identified anything and the farmer picks the crop. */
export const CROP_ID_THRESHOLD = 70;

const SAMPLE_CROP: Record<Exclude<SampleKey, "upload">, Omit<CropIdentification, "source">> = {
  "tomato-early-blight": { cropId: "tomato", confidence: 97, alternatives: [{ cropId: "soybean", confidence: 2 }] },
  "leaf-blurry": { cropId: "tomato", confidence: 91, alternatives: [{ cropId: "soybean", confidence: 5 }] },
};

/**
 * Crop identification is tied to the known demo samples only.
 * An arbitrary photo returns a below-threshold result so the UI falls back to manual
 * selection instead of confidently naming a crop it never looked at.
 */
export function identifyCrop(sample: SampleKey): CropIdentification {
  if (sample === "upload") return { cropId: null, confidence: 38, alternatives: [], source: "auto" };
  return { ...SAMPLE_CROP[sample], source: "auto" };
}

export const cropIdentified = (c: CropIdentification): c is CropIdentification & { cropId: string } =>
  c.cropId !== null && c.confidence >= CROP_ID_THRESHOLD;

export const manualCrop = (cropId: string): CropIdentification => ({ cropId, confidence: 100, alternatives: [], source: "manual" });

/* ------------------------------------------------------------------ *
 * Health status (derived from the disease head, not a separate model)
 * ------------------------------------------------------------------ */

const PEST_THREATS = new Set(["bollworm", "whitefly", "aphids", "stem-borer", "thrips", "mites"]);

export function healthFor(threatId: string): HealthStatus {
  if (threatId === "healthy") return "Healthy";
  return PEST_THREATS.has(threatId) ? "Pest" : "Diseased";
}

export function simulateDiagnosis(cropId: string, sample: SampleKey, crop?: CropIdentification): DiagnosisResult {
  const p = sample === "leaf-blurry" ? LOW_CONF : (CROP_PROFILE[cropId] ?? CROP_PROFILE.tomato);
  return { ...p, crop, health: healthFor(p.threatId), modelVersion: MODEL_LABEL, inferenceMs: 1180 + Math.round(Math.random() * 300) };
}

export const EXPERT_THRESHOLD = 75;
export const needsExpert = (confidence: number) => confidence < EXPERT_THRESHOLD;
