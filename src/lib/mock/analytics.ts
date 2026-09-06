export const WEEKLY_TREND = [
  { week: "W28", label: "14 Jul", cases: 112, detections: 148, validated: 84 },
  { week: "W29", label: "21 Jul", cases: 131, detections: 171, validated: 97 },
  { week: "W30", label: "28 Jul", cases: 158, detections: 204, validated: 121 },
  { week: "W31", label: "04 Aug", cases: 176, detections: 233, validated: 139 },
  { week: "W32", label: "11 Aug", cases: 169, detections: 219, validated: 141 },
  { week: "W33", label: "18 Aug", cases: 214, detections: 281, validated: 168 },
  { week: "W34", label: "25 Aug", cases: 262, detections: 334, validated: 205 },
  { week: "W35", label: "01 Sep", cases: 318, detections: 402, validated: 236 },
];

export const DAILY_TREND = Array.from({ length: 30 }, (_, i) => {
  const d = new Date("2026-08-07T00:00:00+05:30");
  d.setDate(d.getDate() + i);
  const base = 22 + i * 1.4;
  const wave = Math.sin(i / 3.2) * 6;
  const spike = i > 22 ? (i - 22) * 3.6 : 0;
  return {
    date: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    cases: Math.round(base + wave + spike),
    disease: Math.round((base + wave + spike) * 0.62),
    pest: Math.round((base + wave + spike) * 0.38),
  };
});

export const CROP_DISTRIBUTION = [
  { cropId: "cotton", cases: 169 },
  { cropId: "tomato", cases: 118 },
  { cropId: "grapes", cases: 97 },
  { cropId: "soybean", cases: 61 },
  { cropId: "onion", cases: 43 },
  { cropId: "sugarcane", cases: 22 },
  { cropId: "rice", cases: 14 },
  { cropId: "wheat", cases: 6 },
];

export const RESPONSE_TIMES = [
  { stage: "Image → AI result", hours: 0.02 },
  { stage: "AI → Expert review", hours: 3.4 },
  { stage: "Expert → Advisory", hours: 0.6 },
  { stage: "Advisory → Field visit", hours: 26 },
];

export const IMPACT = [
  { label: "Detection lead time (pilot target)", value: 7, suffix: " days earlier", desc: "7-day risk forecast before visible symptoms" },
  { label: "Sprays avoided (pilot target)", value: 31, suffix: "%", desc: "through IPM-first advisories" },
  { label: "Expert response time (pilot target)", value: 3.4, suffix: " hrs", decimals: 1, desc: "median across pilot talukas" },
  { label: "Farmers to reach (pilot target)", value: 12480, suffix: "", desc: "registered across 15 districts" },
];
