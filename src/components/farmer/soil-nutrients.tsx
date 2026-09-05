"use client";

import { motion } from "framer-motion";
import type { SoilCard } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";

type Level = "Low" | "Medium" | "High" | "Optimal" | "Neutral" | "Alkaline" | "Acidic";

function nutrient(key: string, value: number, unit: string, ranges: [number, number], label: string): { key: string; label: string; value: number; unit: string; pct: number; level: Level; color: string } {
  const [lo, hi] = ranges;
  const pct = Math.min(100, Math.max(4, (value / (hi * 1.4)) * 100));
  const level: Level = value < lo ? "Low" : value > hi ? "High" : "Medium";
  const color = level === "Low" ? "#e09a1c" : level === "High" ? "#3d8bd6" : "#2f8f6b";
  return { key, label, value, unit, pct, level, color };
}

export function SoilNutrients({ soil, compact }: { soil: SoilCard; compact?: boolean }) {
  const { t } = useApp();
  const items = [
    nutrient("N", soil.nitrogen, "kg/ha", [280, 560], "Nitrogen"),
    nutrient("P", soil.phosphorus, "kg/ha", [10, 25], "Phosphorus"),
    nutrient("K", soil.potassium, "kg/ha", [120, 280], "Potassium"),
    nutrient("OC", soil.organicCarbon, "%", [0.5, 0.75], "Organic Carbon"),
  ];
  const phLevel: Level = soil.ph < 6.5 ? "Acidic" : soil.ph > 7.8 ? "Alkaline" : "Neutral";
  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-ink-900">{t.nutrients}</h3>
        <span className="text-[11px] text-ink-500">{soil.testedBy}</span>
      </div>
      <div className={cn("mt-4 grid gap-3", compact ? "grid-cols-4" : "grid-cols-2")}>
        {items.map((n, i) => (
          <motion.div key={n.key} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-ink-100 bg-sand-50 p-3">
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl font-display text-sm font-bold text-white" style={{ background: n.color }}>{n.key}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: `${n.color}22`, color: n.color }}>{n.level}</span>
            </div>
            <div className="mt-2 font-display text-xl font-bold text-ink-900">{n.value}<span className="ml-1 text-xs font-medium text-ink-500">{n.unit}</span></div>
            <div className="text-[11px] text-ink-500">{n.label}</div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-ink-100 overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${n.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 + i * 0.06 }} className="h-full rounded-full" style={{ background: n.color }} /></div>
          </motion.div>
        ))}
      </div>
      {/* pH scale */}
      <div className="mt-4 rounded-2xl border border-ink-100 bg-sand-50 p-3">
        <div className="flex items-center justify-between text-sm"><span className="font-semibold text-ink-900">Soil pH</span><span className="font-display text-lg font-bold text-ink-900">{soil.ph} <span className="text-xs font-medium text-forest-700">{phLevel}</span></span></div>
        <div className="relative mt-2 h-2.5 rounded-full bg-[linear-gradient(90deg,#d13c3c_0%,#e09a1c_30%,#2f8f6b_50%,#3d8bd6_75%,#7e22ce_100%)]">
          <motion.span initial={{ left: "0%" }} whileInView={{ left: `${((soil.ph - 4) / 6) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.1 }} className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-ink-900 shadow" />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-ink-500"><span>4.0</span><span>7.0</span><span>10.0</span></div>
      </div>
      {!compact && (
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-sand-100 p-3"><div className="text-ink-500">EC (salinity)</div><div className="font-semibold text-ink-900">{soil.ec} dS/m · Normal</div></div>
          <div className="rounded-xl bg-sand-100 p-3"><div className="text-ink-500">Zinc</div><div className="font-semibold text-ink-900">{soil.zinc} ppm · Deficient</div></div>
        </div>
      )}
    </div>
  );
}
