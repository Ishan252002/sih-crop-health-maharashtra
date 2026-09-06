import type { DiagnosisResult, Severity } from "./types";

export const SCAN_STEPS = [
  { key: "scan", label: "Scanning image", detail: "Normalising colour, exposure and leaf segmentation" },
  { key: "symptoms", label: "Detecting symptoms", detail: "Locating lesions, spots, insects and discolouration" },
  { key: "compare", label: "Comparing disease patterns", detail: "Matching against 42,000 field-validated Maharashtra samples" },
  { key: "confidence", label: "Calculating confidence", detail: "Weighting weather, crop stage and local outbreak history" },
  { key: "advisory", label: "Generating advisory", detail: "Composing IPM steps in English, Hindi and Marathi" },
] as const;

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
  threatId: "leaf-spot", confidence: 61, severity: "Mild", affectedArea: 8,
  symptoms: ["Small dark spots, edges unclear", "Image partially blurred, low light", "Possible dust or spray residue overlap"],
  reasoning: ["Spot texture partially matches Alternaria (0.61) but rings not resolved", "Low-light image reduces feature quality", "Early blight and bacterial spot remain plausible", "Confidence below 75% threshold, routing to expert"],
  alternatives: [{ threatId: "early-blight", confidence: 29 }, { threatId: "whitefly", confidence: 6 }],
};

export function simulateDiagnosis(cropId: string, sample: SampleKey): DiagnosisResult {
  const p = sample === "leaf-blurry" ? LOW_CONF : (CROP_PROFILE[cropId] ?? CROP_PROFILE.tomato);
  return { ...p, modelVersion: "CropNet-v2.3 (EfficientNet-B4 + YOLOv8)", inferenceMs: 1180 + Math.round(Math.random() * 300) };
}

export const EXPERT_THRESHOLD = 75;
export const needsExpert = (confidence: number) => confidence < EXPERT_THRESHOLD;
