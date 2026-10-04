import { HOTSPOTS } from "./hotspots";

export const WEEKLY_TREND = [
  { week: "W28", label: "14 Jul", cases: 318, detections: 414, validated: 238 },
  { week: "W29", label: "21 Jul", cases: 372, detections: 481, validated: 275 },
  { week: "W30", label: "28 Jul", cases: 449, detections: 578, validated: 343 },
  { week: "W31", label: "04 Aug", cases: 501, detections: 661, validated: 394 },
  { week: "W32", label: "11 Aug", cases: 482, detections: 624, validated: 401 },
  { week: "W33", label: "18 Aug", cases: 608, detections: 797, validated: 477 },
  { week: "W34", label: "25 Aug", cases: 744, detections: 948, validated: 582 },
  { week: "W35", label: "01 Sep", cases: 903, detections: 1141, validated: 670 },
];

export const DAILY_TREND = Array.from({ length: 30 }, (_, i) => {
  const d = new Date("2026-08-07T00:00:00+05:30");
  d.setDate(d.getDate() + i);
  const base = 62 + i * 4;
  const wave = Math.sin(i / 3.2) * 17;
  const spike = i > 22 ? (i - 22) * 10.2 : 0;
  return {
    date: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    cases: Math.round(base + wave + spike),
    disease: Math.round((base + wave + spike) * 0.62),
    pest: Math.round((base + wave + spike) * 0.38),
  };
});

/**
 * Derived from HOTSPOTS rather than hand-written, so the crop chart and the case
 * totals on the dashboard can never drift apart. Crops with no active cluster are
 * absent by construction.
 */
export const CROP_DISTRIBUTION = (() => {
  const byCrop = new Map<string, number>();
  for (const h of HOTSPOTS) byCrop.set(h.cropId, (byCrop.get(h.cropId) ?? 0) + h.cases);
  return [...byCrop.entries()].map(([cropId, cases]) => ({ cropId, cases })).sort((a, b) => b.cases - a.cases);
})();

export const RESPONSE_TIMES = [
  { stage: "Image → AI result", hours: 0.02 },
  { stage: "AI → Expert review", hours: 3.4 },
  { stage: "Expert → Advisory", hours: 0.6 },
  { stage: "Advisory → Field visit", hours: 26 },
];

export const IMPACT = [
  { label: "Detection lead time (target)", value: 7, suffix: " days earlier", desc: "7-day risk forecast before visible symptoms" },
  { label: "Sprays avoided (target)", value: 31, suffix: "%", desc: "through IPM-first advisories" },
  { label: "Expert response time (target)", value: 3.4, suffix: " hrs", decimals: 1, desc: "median across reporting districts" },
  { label: "Farmers to reach (target)", value: 12480, suffix: "", desc: "registered across 36 districts in 16 states" },
];
