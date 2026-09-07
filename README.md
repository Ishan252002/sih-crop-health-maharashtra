# KrishiRakshak · Maharashtra Crop Health Intelligence

Frontend prototype for **Smart India Hackathon 2026 · Problem Statement 26131**
"Early detection and management of crop diseases and pest infestations" (Government of Maharashtra).

This is a UI-only build: AI inference, the weather API, the risk engine and all case data are simulated in the browser with realistic mock data. No backend is required.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Product map

| Experience | Route | What it shows |
| --- | --- | --- |
| Landing | `/` | Hero, problem, "How the intelligence flows", feature showcases, impact, CTA |
| Farmer app (mobile-first, Marathi by default) | `/farmer/login` → `/farmer` | Login/registration with optional documents (Soil Health Card, Crop Insurance, Skip for now), home with compact insurance status card, Check Crop (photo → AI scan → automatic crop + disease detection → result, with manual crop fallback), Risk Forecast, Advisory (EN/HI/MR), My Reports + follow-up, Nearby Expert, Soil Health Card, Profile → My Documents |
| Expert console | `/expert` | Review queue, full case review (image, AI reasoning, weather, soil, history), Confirm / Correct / Request info / Refer, validation history |
| Government platform | `/gov` | Overview KPIs + live hotspot map + charts, Surveillance matrix and trap network, Live Hotspots, Disease Analytics, Farmers registry, Expert Validation, Alerts + advisory push, Reports |

## Demo script (14 steps)

1. `/farmer/login` → Login with the demo Farmer ID (OTP `1234`).
2. Home shows Nashik, Tomato at fruiting stage, today's outbreak risk.
3. **Check My Crop** → the farmer only uploads a photo. No crop selection.
4. Pick the sample "Tomato leaf, clear photo" → **Scan now**. The 5-stage vision pipeline runs (prepare → features → crop head → disease head → severity).
5. Result: **Tomato · 97%** identified automatically, then **Early Blight · 94% · Moderate**, symptoms, reasoning, alternatives.
6. Same screen combines weather (29 °C, 82 %, 18 mm), crop stage and the soil card.
7. Risk gauge animates to **HIGH**.
8. Open **AI model and technical details** to show the proposed MobileNetV3-Large backbone, the two heads and the rule engine, plus the simulated-inference notice.
9. **View advisory** → 8-part IPM advisory. Switch English / हिन्दी / मराठी in one tap.
10. Back in Check Crop, use the sample "Leaf photo, low light" → Tomato 91 %, Early Blight 61 % → "Expert Review Required" → **Save report**.
11. Upload any photo that is not a demo sample → crop confidence 38 % → "Crop not identified" → the farmer picks the crop manually and the flow continues.
12. Open `/expert` → the new case is first in the queue → open it → **Correct Diagnosis** (see the retraining note) or **Confirm**.
13. `/gov/hotspots` → the case is counted in the Nashik cluster; click a marker for the detail panel; **Push advisory**.
14. `/gov` → KPIs, district-wise risk, charts and the map aggregate everything. The top banner reads "High-risk cluster detected in Nashik".

State (language, login, saved cases, expert decisions, documents) persists in `localStorage`. Reset it from Farmer → Profile → "Reset demo data" (keeps you logged in).

## Crop Insurance (optional document)

Reference-only policy storage linked to the Farmer ID. No claims flow. Added in registration (Add / Skip for now), or later from Profile → My Documents. Shown as a compact status card on the farmer home. The form is pre-filled with the demo policy:

`CI-MH-2026-18492 · Soybean · Kharif 2026 · ₹85,000 · Active · PMFBY`

"Not added" is neutral and never implies ineligibility.

## Replacing the sample leaf images

The bundled samples are hand-drawn SVG illustrations. To use the two real tomato-leaf photos:

1. Copy the photos into `public/samples/` with these names:
   - `tomato-early-blight-clear.png` → clear leaf (Early Blight · 94% · Moderate · Confirmed)
   - `tomato-early-blight-lowconf.png` → ambiguous leaf (Early Blight possible · 61% · Expert Review Required)
2. Edit the two paths in `SAMPLE_IMAGES` in `src/lib/ai-mock.ts`:

```ts
export const SAMPLE_IMAGES = {
  clear: "/samples/tomato-early-blight-clear.png",
  lowConfidence: "/samples/tomato-early-blight-lowconf.png",
} as const;
```

That single constant feeds the Check Crop sample picker, the landing hero and the AI-detection feature section. The seed cases in `src/lib/mock/cases.ts` keep using the other illustrations (grape, cotton, onion, soybean, cane). PNG or JPG both work; roughly 4:3 looks best.
