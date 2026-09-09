import type { CropIdentification, DiagnosisResult, HealthStatus, Severity } from "./types";
import type { AnalysisResult } from "./vision/types";

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

/**
 * Detail line for controlled demo results. Pairs with the "Demo inference" title on the
 * result card. Never appears on a real-upload result.
 */
export const MODEL_LABEL = "MobileNetV3-Large · proposed";

/**
 * The full hierarchical pipeline, rendered by components/farmer/model-architecture.tsx.
 *
 * Stages 2-5 are vision stages over ONE shared MobileNetV3-Large backbone, not a cascade
 * of separate models: a cascade compounds error and a wrong crop ID poisons everything
 * below it with no recovery. Stages 6-7 are deterministic rule engines, and stage 8 is a
 * human. Marking which is which matters, because only the vision stages are a model at
 * all, and none of them is trained or accuracy-validated yet.
 */
export type StageKind = "input" | "vision" | "rules" | "human";

export interface ArchitectureStage {
  key: string;
  /** Position in the pipeline, shown to the judge as "Stage n". */
  no: number;
  kind: StageKind;
  name: string;
  input: string;
  output: string;
  detail: string;
  /** Confidence cut-off that changes the route out of this stage, when it has one. */
  gate?: string;
}

export const MODEL_ARCHITECTURE = {
  backbone: {
    name: "MobileNetV3-Large",
    detail: "About 5.4M parameters, built for on-device inference on low-end Android phones. Shared by stages 2-5; proposed, not trained.",
  },
  stages: [
    {
      key: "input", no: 1, kind: "input",
      name: "Image / Farmer Input",
      input: "Leaf or plant photo, crop stage, district, Soil Health Card",
      output: "Normalised image and field context",
      detail: "Colour, exposure and leaf segmentation are normalised so the backbone sees a consistent leaf region.",
    },
    {
      key: "crop", no: 2, kind: "vision",
      name: "Crop Identification",
      input: "Segmented leaf region",
      output: "Crop id and confidence",
      detail: "Crop head over the shared feature map. 8 Maharashtra crops.",
      gate: "Below 70% confidence the farmer picks the crop instead of the app claiming one.",
    },
    {
      key: "health", no: 3, kind: "vision",
      name: "Crop Health Assessment",
      input: "Crop id and shared feature map",
      output: "Healthy / Diseased / Pest",
      detail: "Derived from the disease head, which owns the healthy classes. Not a separate model.",
    },
    {
      key: "threat", no: 4, kind: "vision",
      name: "Disease / Pest Classification",
      input: "Crop id, health status, shared feature map",
      output: "Disease or pest id and confidence",
      detail: "Disease, pest and healthy classes in one head, scoped to the crop identified at stage 2.",
      gate: "Below 75% confidence the case is routed to an agronomist for expert review.",
    },
    {
      key: "severity", no: 5, kind: "vision",
      name: "Severity Estimation",
      input: "Lesion mask over the segmented leaf",
      output: "Affected leaf area %, banded Mild / Moderate / Severe",
      detail: "Last vision stage. Everything below this line is deterministic rules or a human.",
    },
    {
      key: "risk", no: 6, kind: "rules",
      name: "Contextual Risk Engine",
      input: "Weather + Soil + Crop stage + Disease/pest history",
      output: "LOW / MEDIUM / HIGH score and a 7-day trend",
      detail: "Transparent scoring in lib/risk-engine.ts. Every factor and its contribution is shown to the farmer.",
    },
    {
      key: "advisory", no: 7, kind: "rules",
      name: "IPM / Advisory Engine",
      input: "Threat, severity, crop stage, soil card, risk level",
      output: "IPM ladder and fertilizer advisory in Marathi, Hindi and English",
      detail: "Lookup and rules in lib/i18n/advisories.ts and lib/fertilizer.ts. Chemical control is always the last rung.",
    },
    {
      key: "expert", no: 8, kind: "human",
      name: "Expert Validation / Human-in-the-loop",
      input: "Case, image, model output and the full rule trace",
      output: "Confirmed / Corrected / Referred / More info requested",
      detail: "An agronomist has the final word. Corrections are the label source for the training set that does not exist yet.",
      gate: "Every case under the 75% expert-review threshold lands here before the farmer acts on it.",
    },
  ] as ArchitectureStage[],
} as const;

/**
 * Identity of a built-in demo image shipped with the prototype.
 * The UI passes this id straight into the detection function, so the app never has to
 * infer which sample was chosen from a browser filename. These are controlled inputs.
 */
export type DemoSampleId =
  | "tomato-early-blight-clear"
  | "tomato-early-blight-lowconf"
  | "cotton-bollworm"
  | "soybean-leaf-spot"
  | "grapes-powdery-mildew"
  | "onion-downy-mildew"
  | "sugarcane-stem-borer"
  | "rice-stem-borer"
  | "wheat-aphids";


export interface DemoSample {
  id: DemoSampleId;
  cropId: string;
  src: string;
  /** Crop head output for this controlled sample. Always above CROP_ID_THRESHOLD. */
  crop: { confidence: number; alternatives: { cropId: string; confidence: number }[] };
  /**
   * True when this sample exists to demonstrate the disease head falling below
   * EXPERT_THRESHOLD and routing to an agronomist. The crop head still succeeds.
   */
  expertRoute?: boolean;
}

/**
 * Demo sample images used by Check Crop, the landing hero and the AI-detection feature section.
 * To use real field photos, drop the files into public/samples/ and change ONLY these paths.
 *  - clear:         primary tomato leaf -> Early Blight / 94% / Moderate / Confirmed
 *  - lowConfidence: ambiguous tomato leaf -> Early Blight (possible) / 61% / Expert Review Required
 */
export const SAMPLE_IMAGES = {
  clear: "/samples/tomato-early-blight-clear.png",
  lowConfidence: "/samples/tomato-early-blight-lowconf.png",
} as const;

/**
 * The controlled demo set, one entry per crop the prototype demonstrates.
 * Confidence values are simulated, not measured. The disease each sample resolves to
 * comes from the existing CROP_PROFILE table below, so nothing new is invented here.
 */
export const DEMO_SAMPLES: Record<DemoSampleId, DemoSample> = {
  "tomato-early-blight-clear": {
    id: "tomato-early-blight-clear", cropId: "tomato", src: SAMPLE_IMAGES.clear,
    crop: { confidence: 97, alternatives: [{ cropId: "soybean", confidence: 2 }, { cropId: "cotton", confidence: 1 }] },
  },
  "tomato-early-blight-lowconf": {
    id: "tomato-early-blight-lowconf", cropId: "tomato", src: SAMPLE_IMAGES.lowConfidence,
    crop: { confidence: 89, alternatives: [{ cropId: "soybean", confidence: 7 }, { cropId: "cotton", confidence: 3 }] },
    expertRoute: true,
  },
  "cotton-bollworm": {
    id: "cotton-bollworm", cropId: "cotton", src: "/samples/cotton-boll.svg",
    crop: { confidence: 94, alternatives: [{ cropId: "soybean", confidence: 4 }, { cropId: "tomato", confidence: 1 }] },
  },
  "soybean-leaf-spot": {
    id: "soybean-leaf-spot", cropId: "soybean", src: "/samples/soy-leaf.svg",
    crop: { confidence: 93, alternatives: [{ cropId: "cotton", confidence: 5 }, { cropId: "tomato", confidence: 2 }] },
  },
  "grapes-powdery-mildew": {
    id: "grapes-powdery-mildew", cropId: "grapes", src: "/samples/grape-powdery.svg",
    crop: { confidence: 95, alternatives: [{ cropId: "tomato", confidence: 3 }, { cropId: "soybean", confidence: 1 }] },
  },
  "onion-downy-mildew": {
    id: "onion-downy-mildew", cropId: "onion", src: "/samples/onion-leaf.svg",
    crop: { confidence: 91, alternatives: [{ cropId: "wheat", confidence: 5 }, { cropId: "rice", confidence: 3 }] },
  },
  "sugarcane-stem-borer": {
    id: "sugarcane-stem-borer", cropId: "sugarcane", src: "/samples/cane-stem.svg",
    crop: { confidence: 92, alternatives: [{ cropId: "rice", confidence: 5 }, { cropId: "wheat", confidence: 2 }] },
  },
  "rice-stem-borer": {
    id: "rice-stem-borer", cropId: "rice", src: "/samples/rice-stem-borer.svg",
    crop: { confidence: 90, alternatives: [{ cropId: "wheat", confidence: 7 }, { cropId: "sugarcane", confidence: 2 }] },
  },
  "wheat-aphids": {
    id: "wheat-aphids", cropId: "wheat", src: "/samples/wheat-aphids.svg",
    crop: { confidence: 88, alternatives: [{ cropId: "rice", confidence: 9 }, { cropId: "sugarcane", confidence: 2 }] },
  },
};

/** Render order for the demo tiles on the upload screen. */
export const DEMO_SAMPLE_ORDER: DemoSampleId[] = [
  "tomato-early-blight-clear",
  "cotton-bollworm",
  "soybean-leaf-spot",
  "grapes-powdery-mildew",
  "onion-downy-mildew",
  "sugarcane-stem-borer",
  "rice-stem-borer",
  "wheat-aphids",
  "tomato-early-blight-lowconf",
];

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

/**
 * Crop head for controlled demo samples only.
 *
 * There is no simulated path for arbitrary uploads. A real farmer photo is handled locally
 * by vision/prototype.ts, which claims no crop at all and routes the case to an agronomist.
 * Guessing a crop from file metadata was removed because it was not recognition and should
 * never have looked like it.
 */
export function identifyCrop(sampleId: DemoSampleId): CropIdentification {
  const sample = DEMO_SAMPLES[sampleId];
  if (!sample) throw new Error(`Unknown demo sample: ${sampleId}`);
  return { cropId: sample.cropId, confidence: sample.crop.confidence, alternatives: sample.crop.alternatives, source: "auto" };
}

export const cropIdentified = (c: CropIdentification): c is CropIdentification & { cropId: string } =>
  c.cropId !== null && c.confidence >= CROP_ID_THRESHOLD;

/** Closest match from a below-threshold crop head result, used to pre-select the manual picker. */
export const topGuess = (c: CropIdentification): string | null => c.cropId ?? c.alternatives[0]?.cropId ?? null;

export const manualCrop = (cropId: string): CropIdentification => ({ cropId, confidence: 100, alternatives: [], source: "manual" });

/* ------------------------------------------------------------------ *
 * Health status (derived from the disease head, not a separate model)
 * ------------------------------------------------------------------ */

const PEST_THREATS = new Set(["bollworm", "whitefly", "aphids", "stem-borer", "thrips", "mites"]);

export function healthFor(threatId: string): HealthStatus {
  if (threatId === "healthy") return "Healthy";
  return PEST_THREATS.has(threatId) ? "Pest" : "Diseased";
}

export function simulateDiagnosis(cropId: string, sampleId: DemoSampleId, crop?: CropIdentification): DiagnosisResult {
  const p = DEMO_SAMPLES[sampleId]?.expertRoute ? LOW_CONF : (CROP_PROFILE[cropId] ?? CROP_PROFILE.tomato);
  return { ...p, crop, health: healthFor(p.threatId), modelVersion: MODEL_LABEL, inferenceKind: "demo", inferenceMs: 1180 + Math.round(Math.random() * 300) };
}

export const EXPERT_THRESHOLD = 75;
export const needsExpert = (confidence: number) => confidence < EXPERT_THRESHOLD;

/* ------------------------------------------------------------------ *
 * Controlled demo analysis
 * ------------------------------------------------------------------ */

/**
 * Full analysis for a controlled demo sample.
 *
 * Deterministic on purpose: these are judge-demo inputs and must behave identically every
 * time. Returns the same AnalysisResult shape the real vision path returns, so Check Crop
 * has one set of branches regardless of where the result came from.
 */
export function analyzeDemoSample(sampleId: DemoSampleId): AnalysisResult {
  let crop: CropIdentification;
  try {
    crop = identifyCrop(sampleId);
  } catch (err) {
    return { status: "error", source: "demo", code: "unknown_sample", reason: err instanceof Error ? err.message : String(err) };
  }
  if (!cropIdentified(crop)) {
    return { status: "low_confidence", source: "demo", topGuess: topGuess(crop), confidence: crop.confidence, alternatives: crop.alternatives, reason: "below_threshold" };
  }
  return { status: "ok", source: "demo", crop, diagnosis: simulateDiagnosis(crop.cropId, sampleId, crop) };
}
