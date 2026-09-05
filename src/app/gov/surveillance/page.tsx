"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Radar, Radio, Thermometer, Droplets, CloudRain, ArrowUpRight, ArrowDownRight, Bug, Leaf, Signal } from "lucide-react";
import { GovShell } from "@/components/gov/gov-shell";
import { FilterBar, DEFAULT_FILTERS, applyFilters, type GovFilters } from "@/components/gov/filter-bar";
import { useApp } from "@/lib/store/app-store";
import { mergedHotspots, districtRisk } from "@/lib/store/selectors";
import { cropById, districtById, threatById, DISTRICTS } from "@/lib/mock/geo";
import { weatherFor } from "@/lib/mock/weather";
import { computeRisk } from "@/lib/risk-engine";
import { RiskBadge, StatusBadge, Badge } from "@/components/ui/badge";
import { CaseCard } from "@/components/shared/case-card";
import { cn, relativeTime } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress";

const TRAPS = [
  { id: "T-NSK-14", district: "nashik", village: "Dindori", type: "Pheromone (PBW)", count: 3, threshold: 8, status: "ok", updated: "2026-09-05T06:30:00+05:30" },
  { id: "T-JAL-07", district: "jalgaon", village: "Bhusawal", type: "Pheromone (PBW)", count: 12, threshold: 8, status: "alert", updated: "2026-09-05T06:10:00+05:30" },
  { id: "T-YAV-03", district: "yavatmal", village: "Pusad", type: "Pheromone (PBW)", count: 9, threshold: 8, status: "alert", updated: "2026-09-05T05:50:00+05:30" },
  { id: "T-NAG-11", district: "nagpur", village: "Kalmeshwar", type: "Yellow sticky (whitefly)", count: 34, threshold: 20, status: "alert", updated: "2026-09-04T18:00:00+05:30" },
  { id: "S-NSK-02", district: "nashik", village: "Niphad", type: "Leaf-wetness sensor", count: 11, threshold: 8, status: "alert", updated: "2026-09-05T07:00:00+05:30", unit: "h" },
  { id: "S-SAN-05", district: "sangli", village: "Tasgaon", type: "Leaf-wetness sensor", count: 6, threshold: 8, status: "ok", updated: "2026-09-05T07:00:00+05:30", unit: "h" },
  { id: "T-AMR-02", district: "amravati", village: "Achalpur", type: "Yellow sticky (whitefly)", count: 14, threshold: 20, status: "ok", updated: "2026-09-04T17:20:00+05:30" },
];

export default function Surveillance() {
  const { cases } = useApp();
  const [filters, setFilters] = useState<GovFilters>(DEFAULT_FILTERS);
  const spots = useMemo(() => applyFilters(mergedHotspots(cases), filters), [cases, filters]);
  const districts = districtRisk(spots).filter((d) => d.cases > 0);
  const recent = cases.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).filter((c) => filters.district === "all" || c.districtId === filters.district).slice(0, 8);
  const traps = TRAPS.filter((t) => filters.district === "all" || t.district === filters.district);

  return (
    <GovShell title="Surveillance" subtitle="District risk matrix, trap and sensor network, live case feed" actions={<FilterBar value={filters} onChange={setFilters} />}>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-5">
          <div className="card-surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100"><div className="font-display font-bold text-ink-900 inline-flex items-center gap-2"><Radar className="h-4 w-4 text-forest-700" /> District risk matrix</div><span className="text-xs text-ink-500">weather-driven forecast for the dominant threat</span></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-sand-100 text-[11px] uppercase tracking-wider text-ink-500"><tr><th className="px-4 py-2 text-left font-bold">District</th><th className="px-3 py-2 text-left font-bold">Dominant threat</th><th className="px-3 py-2 text-right font-bold">Cases</th><th className="px-3 py-2 text-right font-bold">7d</th><th className="px-3 py-2 text-left font-bold">Weather</th><th className="px-3 py-2 text-left font-bold">Forecast risk</th><th className="px-3 py-2 text-left font-bold">Level</th></tr></thead>
                <tbody className="divide-y divide-ink-100">
                  {districts.map((d, i) => {
                    const top = spots.filter((h) => h.districtId === d.district.id).sort((a, b) => b.cases - a.cases)[0];
                    const w = weatherFor(d.district.id);
                    const r = computeRisk({ weather: w, cropId: top.cropId, stage: "Fruiting", threatId: top.threatId, localCases: d.cases });
                    const th = threatById(top.threatId);
                    return (
                      <motion.tr key={d.district.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-forest-50/50">
                        <td className="px-4 py-2.5 font-semibold text-ink-900">{d.district.name}<div className="text-[11px] font-normal text-ink-500">{d.district.region}</div></td>
                        <td className="px-3 py-2.5"><div className="inline-flex items-center gap-1.5 text-ink-800">{th.type === "pest" ? <Bug className="h-3.5 w-3.5 text-amber-600" /> : <Leaf className="h-3.5 w-3.5 text-forest-600" />}{th.name}</div><div className="text-[11px] text-ink-500">{cropById(top.cropId).emoji} {cropById(top.cropId).name}</div></td>
                        <td className="px-3 py-2.5 text-right font-display font-bold text-ink-900">{d.cases}</td>
                        <td className={cn("px-3 py-2.5 text-right font-semibold", d.trend >= 0 ? "text-risk-high" : "text-forest-700")}><span className="inline-flex items-center">{d.trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{Math.abs(d.trend)}%</span></td>
                        <td className="px-3 py-2.5 text-xs text-ink-600"><span className="inline-flex items-center gap-1"><Thermometer className="h-3 w-3" />{w.temp}°</span> <span className="inline-flex items-center gap-1 ml-1"><Droplets className="h-3 w-3" />{w.humidity}%</span> <span className="inline-flex items-center gap-1 ml-1"><CloudRain className="h-3 w-3" />{w.rain24h}mm</span></td>
                        <td className="px-3 py-2.5 w-36"><div className="flex items-center gap-2"><ProgressBar value={r.score} color={r.level === "HIGH" ? "bg-risk-high" : r.level === "MEDIUM" ? "bg-amber-500" : "bg-forest-500"} className="flex-1" /><span className="w-7 text-right text-xs font-bold text-ink-700">{r.score}</span></div></td>
                        <td className="px-3 py-2.5"><RiskBadge level={r.level} /></td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100"><div className="font-display font-bold text-ink-900 inline-flex items-center gap-2"><Signal className="h-4 w-4 text-forest-700" /> Pest-trap and sensor network</div><span className="text-xs text-ink-500">{traps.filter((t) => t.status === "alert").length} above threshold</span></div>
            <ul className="divide-y divide-ink-100">
              {traps.map((t) => (
                <li key={t.id} className="flex items-center gap-4 px-5 py-3">
                  <span className={cn("relative flex h-9 w-9 items-center justify-center rounded-xl", t.status === "alert" ? "bg-red-50 text-risk-high" : "bg-forest-100 text-forest-700")}><Radio className="h-4 w-4" />{t.status === "alert" && <span className="absolute inset-0 rounded-xl bg-risk-high/40 animate-pulse-ring" />}</span>
                  <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-ink-900">{t.type} <span className="font-mono text-xs text-ink-500">{t.id}</span></div><div className="text-xs text-ink-500">{t.village}, {districtById(t.district).name} · {relativeTime(t.updated)}</div></div>
                  <div className="text-right"><div className={cn("font-display text-lg font-bold", t.status === "alert" ? "text-risk-high" : "text-ink-900")}>{t.count}<span className="text-xs font-medium text-ink-500"> {t.unit ?? "/trap/night"}</span></div><div className="text-[11px] text-ink-500">threshold {t.threshold}</div></div>
                  <Badge tone={t.status === "alert" ? "red" : "green"} dot>{t.status === "alert" ? "ETL crossed" : "Normal"}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <div className="card-surface p-5">
            <div className="flex items-center justify-between"><div className="font-display font-bold text-ink-900">Live case feed</div><span className="inline-flex items-center gap-1.5 text-xs text-forest-700 font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-forest-500 animate-pulse" /> streaming</span></div>
            <div className="mt-3 space-y-2.5">
              {recent.map((c) => <CaseCard key={c.id} c={c} href={`/gov/validation/${c.id}`} showFarmer />)}
            </div>
          </div>
          <div className="card-surface p-5">
            <div className="font-display font-bold text-ink-900">Coverage</div>
            <div className="mt-3 space-y-3">
              {[{ l: "Districts reporting", v: 15, of: 36 }, { l: "Talukas with active scans", v: 118, of: 358 }, { l: "Villages with registered farmers", v: 2412, of: 43665 }].map((x) => (
                <div key={x.l}><div className="flex justify-between text-xs"><span className="text-ink-600">{x.l}</span><span className="font-semibold text-ink-900">{x.v.toLocaleString("en-IN")} / {x.of.toLocaleString("en-IN")}</span></div><ProgressBar value={(x.v / x.of) * 100} className="mt-1" /></div>
              ))}
            </div>
            <Link href="/gov/farmers" className="mt-4 inline-flex text-xs font-semibold text-forest-800 hover:underline">Farmer registry →</Link>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1 text-[11px] text-ink-400">Showing {districts.length} of {DISTRICTS.length} districts. Statuses: {["Pending", "Under Review", "Confirmed", "Corrected", "Referred"].map((s) => <StatusBadge key={s} status={s as never} />).map((b, i) => <span key={i} className="ml-1 align-middle inline-block">{b}</span>)}</div>
    </GovShell>
  );
}
