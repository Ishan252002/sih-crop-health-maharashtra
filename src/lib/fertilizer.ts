import { FUNGAL } from "./risk-engine";
import type { CropStage, HealthStatus, Severity, SoilCard } from "./types";

/**
 * Prototype fertilizer advisory.
 *
 * Deterministic rules over the Soil Health Card, the crop stage and whatever the vision
 * stages reported (crop, health, disease/pest, severity). Nothing here is a validated
 * prescription: the doses are indicative ranges from published Maharashtra package-of-
 * practice guidance and must be confirmed against the farmer's own soil test and a local
 * agronomist before use. The UI labels every plan as a prototype advisory for that reason.
 *
 * Nutrient bands live here and nowhere else: components/farmer/soil-nutrients.tsx reads
 * the same table so the card and the advisory can never disagree.
 */

export type NutrientKey = "nitrogen" | "phosphorus" | "potassium" | "organicCarbon";
export type NutrientLevel = "Low" | "Medium" | "High";
export type PhBand = "Acidic" | "Neutral" | "Alkaline";

/** Soil Health Card interpretation bands. Below `lo` is Low, above `hi` is High. */
export const SOIL_NUTRIENT_RANGES: Record<NutrientKey, [lo: number, hi: number]> = {
  nitrogen: [280, 560],
  phosphorus: [10, 25],
  potassium: [120, 280],
  organicCarbon: [0.5, 0.75],
};

/** DTPA-extractable zinc critical limit. Below this the soil is treated as zinc deficient. */
export const ZINC_CRITICAL_PPM = 0.6;
export const PH_ACIDIC_BELOW = 6.5;
export const PH_ALKALINE_ABOVE = 7.8;

export function nutrientLevel(key: NutrientKey, value: number): NutrientLevel {
  const [lo, hi] = SOIL_NUTRIENT_RANGES[key];
  return value < lo ? "Low" : value > hi ? "High" : "Medium";
}

export function phBand(ph: number): PhBand {
  return ph < PH_ACIDIC_BELOW ? "Acidic" : ph > PH_ALKALINE_ABOVE ? "Alkaline" : "Neutral";
}

/* ------------------------------------------------------------------ *
 * Plan shape
 * ------------------------------------------------------------------ */

/** Every recommendable input. The id is the i18n key, so no product name is ever hard-coded in a component. */
export type FertilizerItemId =
  | "hold-nitrogen"
  | "foliar-13-0-45"
  | "zinc-sulphate"
  | "urea-split"
  | "ssp-basal"
  | "mop-basal"
  | "fym-compost"
  | "gypsum"
  | "agricultural-lime"
  | "balanced-maintenance";

/** How the input is delivered. Drives the chip colour and tells the farmer what kind of step this is. */
export type FertilizerKind = "hold" | "foliar" | "micronutrient" | "soil" | "organic" | "amendment";

/** Units are rendered from i18n so "kg/acre" reads correctly in Marathi and Hindi. */
export type DoseUnit = "none" | "g_per_l" | "ml_per_l" | "kg_per_acre" | "kg_per_ha" | "t_per_acre";

/** Why an item is on the list. Each id maps to one short line of farmer-facing text. */
export type FertilizerBasisId =
  | "n-low"
  | "n-high"
  | "p-low"
  | "k-low"
  | "k-high"
  | "oc-low"
  | "zn-low"
  | "ph-acidic"
  | "ph-alkaline"
  | "active-foliar-disease"
  | "active-pest"
  | "healthy-crop"
  | "reproductive-stage"
  | "vegetative-stage"
  | "severity-moderate"
  | "severity-severe";

export type FertilizerCautionId =
  | "prototype"
  | "confirm-soil-test"
  | "hold-and-split"
  | "foliar-evening"
  | "no-tank-mix"
  | "zinc-keep-separate"
  | "k-already-high"
  | "no-nitrogen-during-infection";

export interface FertilizerDose {
  /** Numeric range as written, e.g. "4–5". Empty for a hold, which has no dose. */
  value: string;
  unit: DoseUnit;
}

export interface FertilizerItem {
  id: FertilizerItemId;
  kind: FertilizerKind;
  dose: FertilizerDose;
  basis: FertilizerBasisId[];
}

export interface FertilizerReading {
  key: NutrientKey | "zinc" | "ph";
  /** Raw soil card value, rendered with its unit by the component. */
  value: number;
  level: NutrientLevel | PhBand;
}

export interface FertilizerPlan {
  items: FertilizerItem[];
  cautions: FertilizerCautionId[];
  /** Soil card readings the plan actually used, in the order they are shown. */
  readings: FertilizerReading[];
  /** True when soil nitrogen is deliberately withheld until the infection is under control. */
  holdNitrogen: boolean;
  cropId: string;
  stage: CropStage;
  threatId: string;
  severity: Severity;
}

export interface FertilizerInput {
  soil: SoilCard;
  cropId: string;
  stage: CropStage;
  threatId: string;
  severity: Severity;
  /** Derived from the disease head. "Healthy" switches the plan to maintenance nutrition. */
  health: HealthStatus;
}

const NONE: FertilizerDose = { value: "", unit: "none" };

/* ------------------------------------------------------------------ *
 * Rules
 * ------------------------------------------------------------------ */

/**
 * Builds the plan. Pure and deterministic: the same soil card, crop, stage and diagnosis
 * always produce the same list, which is what keeps the tomato early-blight demo stable.
 */
export function fertilizerPlan(input: FertilizerInput): FertilizerPlan {
  const { soil, cropId, stage, threatId, severity, health } = input;

  const n = nutrientLevel("nitrogen", soil.nitrogen);
  const p = nutrientLevel("phosphorus", soil.phosphorus);
  const k = nutrientLevel("potassium", soil.potassium);
  const oc = nutrientLevel("organicCarbon", soil.organicCarbon);
  const ph = phBand(soil.ph);
  const zincLow = soil.zinc < ZINC_CRITICAL_PPM;

  const infected = health !== "Healthy";
  const foliarDisease = infected && FUNGAL.has(threatId);
  const pressured = severity === "Moderate" || severity === "Severe";
  const reproductive = stage === "Flowering" || stage === "Fruiting";

  // Fresh nitrogen pushes soft, dense new growth, which is exactly what a spreading foliar
  // fungus feeds on. While the infection is active and at least moderate, the soil dose waits.
  const holdNitrogen = foliarDisease && pressured;

  const severityBasis: FertilizerBasisId | null =
    severity === "Severe" ? "severity-severe" : severity === "Moderate" ? "severity-moderate" : null;

  const items: FertilizerItem[] = [];
  const cautions: FertilizerCautionId[] = ["prototype", "confirm-soil-test"];

  if (holdNitrogen) {
    items.push({
      id: "hold-nitrogen",
      kind: "hold",
      dose: NONE,
      basis: [
        "active-foliar-disease",
        ...(severityBasis ? [severityBasis] : []),
        ...(n === "Low" ? (["n-low"] as FertilizerBasisId[]) : []),
      ],
    });
    cautions.push("hold-and-split", "no-nitrogen-during-infection");

    // Potassium nitrate (13:0:45) keeps the reproductive sink fed and firms up leaf tissue
    // without adding the soil nitrogen that was just withheld.
    items.push({
      id: "foliar-13-0-45",
      kind: "foliar",
      dose: { value: "4–5", unit: "g_per_l" },
      basis: [
        "active-foliar-disease",
        ...(reproductive ? (["reproductive-stage"] as FertilizerBasisId[]) : (["vegetative-stage"] as FertilizerBasisId[])),
        ...(k === "High" ? [] : (["k-low"] as FertilizerBasisId[])),
      ],
    });
    cautions.push("foliar-evening", "no-tank-mix");
  } else if (n === "Low") {
    items.push({
      id: "urea-split",
      kind: "soil",
      dose: { value: "40–50", unit: "kg_per_acre" },
      basis: ["n-low", ...(infected ? (["active-pest"] as FertilizerBasisId[]) : (["healthy-crop"] as FertilizerBasisId[]))],
    });
    cautions.push("hold-and-split");
  } else if (n === "High") {
    cautions.push("no-nitrogen-during-infection");
  }

  if (zincLow) {
    items.push({ id: "zinc-sulphate", kind: "micronutrient", dose: { value: "8–10", unit: "kg_per_acre" }, basis: ["zn-low"] });
    cautions.push("zinc-keep-separate");
  }

  if (p === "Low") {
    items.push({ id: "ssp-basal", kind: "soil", dose: { value: "100–125", unit: "kg_per_acre" }, basis: ["p-low"] });
  }

  if (k === "Low") {
    items.push({ id: "mop-basal", kind: "soil", dose: { value: "30–40", unit: "kg_per_acre" }, basis: ["k-low"] });
  } else if (k === "High") {
    cautions.push("k-already-high");
  }

  if (oc === "Low") {
    items.push({ id: "fym-compost", kind: "organic", dose: { value: "2–2.5", unit: "t_per_acre" }, basis: ["oc-low"] });
  }

  if (ph === "Alkaline") {
    items.push({ id: "gypsum", kind: "amendment", dose: { value: "200", unit: "kg_per_acre" }, basis: ["ph-alkaline"] });
  } else if (ph === "Acidic") {
    items.push({ id: "agricultural-lime", kind: "amendment", dose: { value: "200–400", unit: "kg_per_acre" }, basis: ["ph-acidic"] });
  }

  if (items.length === 0) {
    items.push({
      id: "balanced-maintenance",
      kind: "soil",
      dose: { value: "", unit: "none" },
      basis: [infected ? "active-pest" : "healthy-crop", reproductive ? "reproductive-stage" : "vegetative-stage"],
    });
  }

  const readings: FertilizerReading[] = [
    { key: "nitrogen", value: soil.nitrogen, level: n },
    { key: "phosphorus", value: soil.phosphorus, level: p },
    { key: "potassium", value: soil.potassium, level: k },
    { key: "organicCarbon", value: soil.organicCarbon, level: oc },
    { key: "zinc", value: soil.zinc, level: zincLow ? "Low" : "Medium" },
    { key: "ph", value: soil.ph, level: ph },
  ];

  return { items, cautions: [...new Set(cautions)], readings, holdNitrogen, cropId, stage, threatId, severity };
}
