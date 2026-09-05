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
| Farmer app (mobile-first) | `/farmer/login` → `/farmer` | Login/registration, home, Check Crop (upload → AI scan → result), Risk Forecast, Advisory (EN/HI/MR), My Reports + follow-up, Nearby Expert, Soil Health Card, Profile |
| Expert console | `/expert` | Review queue, full case review (image, AI reasoning, weather, soil, history), Confirm / Correct / Request info / Refer, validation history |
| Government platform | `/gov` | Overview KPIs + live hotspot map + charts, Surveillance matrix and trap network, Live Hotspots, Disease Analytics, Farmers registry, Expert Validation, Alerts + advisory push, Reports |

## Demo script (13 steps)

1. `/farmer/login` → Login with the demo Farmer ID (OTP `1234`).
2. Home shows Nashik, Tomato at fruiting stage, today's outbreak risk.
3. **Check My Crop** → crop Tomato, stage Fruiting, district Nashik → Next.
4. Pick the sample "Tomato leaf, clear photo" → **Scan now**. The 5-step AI scanning animation runs.
5. Result: **Early Blight · 94% · Moderate**, symptoms, reasoning, alternatives.
6. Same screen combines weather (29 °C, 82 %, 18 mm), crop stage and the soil card.
7. Risk gauge animates to **HIGH**.
8. **View advisory** → 8-part IPM advisory. Switch English / हिन्दी / मराठी in one tap.
9. Back in Check Crop, use the sample "Leaf photo, low light" → 61 % confidence → "Expert Review Required" → **Save report**.
10. Open `/expert` → the new case is first in the queue → open it → **Correct Diagnosis** (see the retraining note) or **Confirm**.
11. `/gov/hotspots` → the case is counted in the Nashik cluster; click a marker for the detail panel; **Push advisory**.
12. `/gov` → KPIs, district-wise risk, charts and the map aggregate everything.
13. The top banner reads "High-risk cluster detected in Nashik".

State (language, login, saved cases, expert decisions) persists in `localStorage`. Reset it from Farmer → Profile → "Reset demo data".

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Recharts · Leaflet / React-Leaflet · Lucide icons.

## Structure

```
src/
  app/                 routes: /, /farmer/*, /expert/*, /gov/*
  components/
    ui/                button, card, badge, modal, tabs, select, progress, skeleton, stat-card, count-up
    shared/            risk gauge, confidence ring, scan animation, advisory view, weather panel, language switcher, intelligence flow, case card
    farmer/ gov/ expert/ map/ charts/ landing/
  lib/
    mock/              districts, crops, threats, hotspots, weather, farmers, cases, alerts, analytics
    i18n/              UI strings + full IPM advisories in English, Hindi, Marathi
    risk-engine.ts     rule-based LOW / MEDIUM / HIGH scoring with explainable factors
    ai-mock.ts         simulated CNN/YOLO inference and scan steps
    store/             app state (context + localStorage) and selectors
```

Map tiles load from CARTO basemaps and need internet access; markers, zones and panels work offline.
