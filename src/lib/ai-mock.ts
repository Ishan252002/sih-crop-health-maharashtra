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

/**
 * What the detection function is given.
 *  - demo:   an explicit built-in sample id, so the simulated result is deterministic.
 *  - upload: only the metadata a browser File actually exposes. No pixels are read and
 *            no crop is inferred from the filename, because IMG_1234.jpg says nothing.
 */
export type DetectionInput =
  | { kind: "demo"; sampleId: DemoSampleId }
  | { kind: "upload"; name: string; size: number; lastModified: number };

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

const CROP_ORDER = ["tomato", "cotton", "soybean", "grapes", "onion", "sugarcane", "rice", "wheat"];

/**
 * FNV-1a over the metadata a browser File actually gives us: name, byte size and
 * last-modified timestamp. Two different photos give two different numbers, and the
 * same photo gives the same numbers on every reload, so the demo never jumps around.
 * This is a stable spread, not recognition. It looks at no pixels.
 */
function metaSeed(name: string, size: number, lastModified: number): number {
  const key = `${name}|${size}|${lastModified}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Crop head.
 *
 * Controlled demo sample  -> the known crop, 88-97%, two plausible alternatives.
 * Arbitrary browser upload -> a deterministic below-threshold result carrying a real
 *                             top guess and alternatives, so the farmer confirms one
 *                             pre-selected crop instead of starting from a blank grid.
 *
 * There is no universal fallback confidence. An uploaded photo lands somewhere in the
 * 42-58 band derived from its own metadata, never a fixed value for every photo.
 */
export function identifyCrop(input: DetectionInput): CropIdentification {
  if (input.kind === "demo") {
    const sample = DEMO_SAMPLES[input.sampleId];
    if (!sample) throw new Error(`Unknown demo sample: ${input.sampleId}`);
    return { cropId: sample.cropId, confidence: sample.crop.confidence, alternatives: sample.crop.alternatives, source: "auto" };
  }

  const seed = metaSeed(input.name, input.size, input.lastModified);
  const top = CROP_ORDER[seed % CROP_ORDER.length];
  const rest = CROP_ORDER.filter((c) => c !== top);
  const second = rest[(seed >>> 3) % rest.length];
  const third = rest.filter((c) => c !== second)[(seed >>> 7) % (rest.length - 1)];

  const confidence = 42 + (seed % 17); // 42-58, always below CROP_ID_THRESHOLD
  return {
    cropId: null,
    confidence,
    alternatives: [
      { cropId: top, confidence },
      { cropId: second, confidence: Math.max(6, Math.round(confidence * 0.55)) },
      { cropId: third, confidence: Math.max(3, Math.round(confidence * 0.28)) },
    ],
    source: "auto",
  };
}

export const cropIdentified = (c: CropIdentification): c is CropIdentification & { cropId: string } =>
  c.cropId !== null && c.confidence >= CROP_ID_THRESHOLD;

/** Closest match from a below-threshold crop head result, used to pre-select the manual picker. */
export const topGuess = (c: CropIdentification): string | null => c.cropId ?? c.alternatives[0]?.cropId ?? null;

/**
 * Discriminated result of the crop head.
 *
 * The three cases are semantically different and the UI must not collapse them:
 *  - ok             the crop is known, skip manual selection entirely
 *  - low_confidence the head has an opinion but not enough of one, farmer confirms
 *  - error          the head could not run at all, which is NOT a prediction
 *
 * `crop` carries the existing CropIdentification shape so the diagnosis flow,
 * AnalysisStages and the saved CropCase record keep working unchanged.
 */
export type DetectionResult =
  | { status: "ok"; crop: CropIdentification & { cropId: string } }
  | { status: "low_confidence"; crop: CropIdentification; topGuess: string | null }
  | { status: "error"; reason: string };

/**
 * Single entry point for the Check Crop flow. Never throws: an unexpected failure
 * comes back as status "error" with a technical reason for the console, so the UI
 * can say "detection unavailable" instead of presenting a failure as a prediction.
 */
export function detectCrop(input: DetectionInput): DetectionResult {
  let identification: CropIdentification;
  try {
    identification = identifyCrop(input);
  } catch (err) {
    return { status: "error", reason: err instanceof Error ? err.message : String(err) };
  }
  if (cropIdentified(identification)) return { status: "ok", crop: identification };
  return { status: "low_confidence", crop: identification, topGuess: topGuess(identification) };
}

export const manualCrop = (cropId: string): CropIdentification => ({ cropId, confidence: 100, alternatives: [], source: "manual" });

/* ------------------------------------------------------------------ *
 * Health status (derived from the disease head, not a separate model)
 * ------------------------------------------------------------------ */

const PEST_THREATS = new Set(["bollworm", "whitefly", "aphids", "stem-borer", "thrips", "mites"]);

export function healthFor(threatId: string): HealthStatus {
  if (threatId === "healthy") return "Healthy";
  return PEST_THREATS.has(threatId) ? "Pest" : "Diseased";
}

export function simulateDiagnosis(cropId: string, input: DetectionInput, crop?: CropIdentification): DiagnosisResult {
  const expertRoute = input.kind === "demo" && DEMO_SAMPLES[input.sampleId]?.expertRoute === true;
  const p = expertRoute ? LOW_CONF : (CROP_PROFILE[cropId] ?? CROP_PROFILE.tomato);
  return { ...p, crop, health: healthFor(p.threatId), modelVersion: MODEL_LABEL, inferenceMs: 1180 + Math.round(Math.random() * 300) };
}

export const EXPERT_THRESHOLD = 75;
export const needsExpert = (confidence: number) => confidence < EXPERT_THRESHOLD;
