"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Minus, Info, Sprout } from "lucide-react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { CROPS, DISTRICTS, THREATS, cropById } from "@/lib/mock/geo";
import { weatherFor } from "@/lib/mock/weather";
import { computeRisk } from "@/lib/risk-engine";
import { HOTSPOTS } from "@/lib/mock/hotspots";
import { CROP_NAMES, STAGE_NAMES, THREAT_NAMES, DISTRICT_NAMES } from "@/lib/i18n/ui";
import { RiskGauge } from "@/components/shared/risk-gauge";
import { WeatherStrip, ForecastRow } from "@/components/shared/weather-panel";
import { TrendLine } from "@/components/charts/charts";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CropStage } from "@/lib/types";

export default function RiskForecast() {
  const { t, tx, lang } = useApp();
  const [cropId, setCropId] = useState(DEMO_FARMER.plots[0].cropId);
  const [districtId, setDistrictId] = useState(DEMO_FARMER.districtId);
  const [stage, setStage] = useState<CropStage>(DEMO_FARMER.plots[0].stage);
  const crop = cropById(cropId);
  const threats = THREATS.filter((x) => x.crops.includes(cropId));
  const [threatId, setThreatId] = useState(threats[0]?.id ?? "early-blight");
  const effectiveThreat = threats.some((x) => x.id === threatId) ? threatId : threats[0]?.id ?? "early-blight";
  const weather = weatherFor(districtId);
  const nearby = HOTSPOTS.filter((h) => h.districtId === districtId && h.threatId === effectiveThreat).reduce((a, h) => a + h.cases, 0);
  const risk = computeRisk({ weather, cropId, stage, threatId: effectiveThreat, soil: DEMO_FARMER.soil, localCases: nearby });
  const riskLabel = { LOW: t.low, MEDIUM: t.medium, HIGH: t.high }[risk.level];

  return (
    <FarmerShell title={t.riskForecast} back="/farmer">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Select value={cropId} onChange={(e) => { setCropId(e.target.value); const c = cropById(e.target.value); setStage(c.stages.includes("Fruiting") ? "Fruiting" : c.stages[1]); }}>{CROPS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {CROP_NAMES[lang][c.id]}</option>)}</Select>
          <Select value={districtId} onChange={(e) => setDistrictId(e.target.value)}>{DISTRICTS.map((d) => <option key={d.id} value={d.id}>{DISTRICT_NAMES[lang][d.id]}</option>)}</Select>
          <Select value={effectiveThreat} onChange={(e) => setThreatId(e.target.value)}>{threats.map((x) => <option key={x.id} value={x.id}>{THREAT_NAMES[lang][x.id]}</option>)}</Select>
          <Select value={stage} onChange={(e) => setStage(e.target.value as CropStage)}>{crop.stages.map((s) => <option key={s} value={s}>{STAGE_NAMES[lang][s]}</option>)}</Select>
        </div>

        <motion.div key={`${risk.level}-${risk.score}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{t.outbreakRisk}</div>
              <div className="font-display text-lg font-bold text-ink-900">{THREAT_NAMES[lang][effectiveThreat]} · {CROP_NAMES[lang][cropId]}</div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-1 text-[11px] font-semibold text-forest-800"><Sprout className="h-3 w-3" /> {STAGE_NAMES[lang][stage]}</span>
          </div>
          <div className="mt-2 flex justify-center"><RiskGauge score={risk.score} level={risk.level} size={240} levelLabel={riskLabel} sublabel={`${DISTRICT_NAMES[lang][districtId]} · ${t.next72h}`} /></div>
          <div className={cn("mt-4 flex items-start gap-2 rounded-xl p-3 text-[13px] leading-relaxed", risk.level === "HIGH" ? "bg-red-50 text-risk-high" : risk.level === "MEDIUM" ? "bg-amber-100/60 text-amber-600" : "bg-forest-50 text-forest-800")}>
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div><span className="font-semibold">{t.riskExplanation}: </span>{risk.explanations[lang]}</div>
          </div>
        </motion.div>

        <WeatherStrip weather={weather} districtName={DISTRICT_NAMES[lang][districtId]} />

        <div className="card-surface p-4">
          <div className="font-display font-bold text-ink-900">{t.riskFactors}</div>
          <div className="mt-3 space-y-2.5">
            {risk.factors.map((f, i) => (
              <motion.div key={f.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", f.direction === "up" ? "bg-red-50 text-risk-high" : f.direction === "down" ? "bg-forest-100 text-forest-700" : "bg-ink-100 text-ink-500")}>
                  {f.direction === "up" ? <ArrowUp className="h-3.5 w-3.5" /> : f.direction === "down" ? <ArrowDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs"><span className="font-semibold text-ink-800">{tx(f.label)}</span><span className="text-ink-500">{f.label === "Crop stage" ? STAGE_NAMES[lang][f.value as CropStage] : tx(f.value)}</span></div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-ink-100 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, f.contribution) * 2.5)}%` }} transition={{ duration: 0.9, delay: 0.1 + i * 0.05 }} className={cn("h-full rounded-full", f.direction === "up" ? "bg-risk-high" : f.direction === "down" ? "bg-forest-500" : "bg-ink-300")} /></div>
                </div>
                <span className="w-9 text-right text-xs font-bold text-ink-700">{f.contribution >= 0 ? "+" : ""}{Math.round(f.contribution)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card-surface p-4">
          <div className="font-display font-bold text-ink-900">{t.sevenDay}</div>
          <div className="mt-2"><TrendLine data={risk.trend} color={risk.level === "HIGH" ? "#d13c3c" : risk.level === "MEDIUM" ? "#e09a1c" : "#2f8f6b"} /></div>
          <ForecastRow weather={weather} trend={risk.trend} className="mt-3" />
        </div>
      </div>
    </FarmerShell>
  );
}
