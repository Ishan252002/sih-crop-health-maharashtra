"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, AlertOctagon, ArrowRight, Bug, ClipboardCheck, Cpu, Leaf, MapPinned, ShieldAlert, Users, Hourglass, Maximize2 } from "lucide-react";
import { GovShell } from "@/components/gov/gov-shell";
import { FilterBar, DEFAULT_FILTERS, applyFilters, type GovFilters } from "@/components/gov/filter-bar";
import { StatCard } from "@/components/ui/stat-card";
import { HotspotMap, MapLegend } from "@/components/map/hotspot-map";
import { HotspotPanel } from "@/components/map/hotspot-panel";
import { CasesOverTime, DistrictBars, Donut, RiskRadial, HorizontalBars, PALETTE } from "@/components/charts/charts";
import { useApp } from "@/lib/store/app-store";
import { mergedHotspots, riskCounts, districtRisk, threatDistribution, totalCases } from "@/lib/store/selectors";
import { WEEKLY_TREND, DAILY_TREND, CROP_DISTRIBUTION } from "@/lib/mock/analytics";
import { ALERTS } from "@/lib/mock/cases";
import { cropById, districtById, threatById } from "@/lib/mock/geo";
import type { Hotspot } from "@/lib/types";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IntelligenceFlow } from "@/components/shared/intelligence-flow";
import { cn, relativeTime } from "@/lib/utils";

export default function GovOverview() {
  const { cases, ackAlerts } = useApp();
  const [filters, setFilters] = useState<GovFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const spots = useMemo(() => applyFilters(mergedHotspots(cases), filters), [cases, filters]);
  const rc = riskCounts(spots);
  const districts = districtRisk(spots).filter((d) => d.cases > 0);
  const threats = threatDistribution(spots);
  const total = totalCases(spots);
  const pests = spots.filter((h) => threatById(h.threatId).type === "pest").reduce((a, h) => a + h.cases, 0);
  const pending = cases.filter((c) => c.status === "Pending" || c.status === "Under Review").length;
  const validated = cases.filter((c) => ["Confirmed", "Corrected", "Referred"].includes(c.status)).length + 236;
  const topAlert = ALERTS.find((a) => !a.acknowledged && !ackAlerts.includes(a.id)) ?? ALERTS[0];
  const trend = filters.range === "7d" ? DAILY_TREND.slice(-7) : DAILY_TREND;

  return (
    <GovShell title="State Overview" subtitle="Crop health surveillance · Maharashtra · updated 09:00 IST" actions={<FilterBar value={filters} onChange={setFilters} />}>
      {/* Headline alert */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex flex-col gap-3 rounded-2xl border border-risk-high/25 bg-gradient-to-r from-red-50 to-white p-4 sm:flex-row sm:items-center">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-risk-high text-white"><ShieldAlert className="h-5 w-5" /><span className="absolute inset-0 rounded-xl bg-risk-high animate-pulse-ring" /></span>
        <div className="flex-1 min-w-0">
          <div className="font-display text-base font-bold text-ink-900">{topAlert.title}</div>
          <div className="text-sm text-ink-600 truncate">{topAlert.body}</div>
        </div>
        <div className="flex items-center gap-2"><span className="text-xs text-ink-500">{relativeTime(topAlert.createdAt)}</span><Link href="/gov/alerts"><Button size="sm" variant="danger">Act now <ArrowRight className="h-3.5 w-3.5" /></Button></Link></div>
      </motion.div>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Total cases" value={total} delta={12} tone="neutral" icon={<Activity className="h-4.5 w-4.5" />} className="xl:col-span-2" />
        <StatCard label="Active outbreaks" value={rc.HIGH} tone="red" icon={<AlertOctagon className="h-4.5 w-4.5" />} />
        <StatCard label="High-risk zones" value={districts.filter((d) => d.risk === "HIGH").length} tone="red" icon={<MapPinned className="h-4.5 w-4.5" />} />
        <StatCard label="Farmers assisted" value={12480} delta={8} tone="green" icon={<Users className="h-4.5 w-4.5" />} className="xl:col-span-2" />
        <StatCard label="AI detections" value={402 + cases.filter((c) => c.source === "farmer").length} tone="blue" icon={<Cpu className="h-4.5 w-4.5" />} />
        <StatCard label="Pending validations" value={pending} tone="amber" icon={<Hourglass className="h-4.5 w-4.5" />} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatCard label="Expert-validated cases" value={validated} tone="green" icon={<ClipboardCheck className="h-4.5 w-4.5" />} delta={5} />
        <StatCard label="Diseases detected" value={total - pests} tone="green" icon={<Leaf className="h-4.5 w-4.5" />} />
        <StatCard label="Pest cases" value={pests} tone="amber" icon={<Bug className="h-4.5 w-4.5" />} />
      </div>

      {/* Map + panel */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <div className="card-surface relative overflow-hidden h-[520px]">
          <HotspotMap hotspots={spots} height={520} selectedId={selected?.id} onSelect={setSelected} />
          <div className="absolute left-3 top-3 z-[500] glass rounded-xl px-3 py-2 shadow-soft">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Live hotspot map</div>
            <div className="text-sm font-semibold text-ink-900">{spots.length} clusters · {total} cases</div>
          </div>
          <MapLegend className="absolute left-3 bottom-3 z-[500]" />
          <Link href="/gov/hotspots" className="absolute right-3 top-3 z-[500] glass rounded-xl px-3 py-2 text-xs font-semibold text-forest-900 shadow-soft inline-flex items-center gap-1.5 hover:bg-white"><Maximize2 className="h-3.5 w-3.5" /> Full screen</Link>
        </div>
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <HotspotPanel key={selected.id} hotspot={selected} onClose={() => setSelected(null)} />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card-surface">
                <div className="flex items-center justify-between px-5 pt-4 pb-2"><div className="font-display font-bold text-ink-900">District-wise risk</div><span className="text-xs text-ink-500">click a marker for details</span></div>
                <ul className="max-h-[440px] overflow-y-auto divide-y divide-ink-100">
                  {districts.map((d) => (
                    <li key={d.district.id}>
                      <button onClick={() => setSelected(spots.filter((h) => h.districtId === d.district.id).sort((a, b) => b.cases - a.cases)[0])} className="flex w-full items-center gap-3 px-5 py-2.5 text-left hover:bg-forest-50/60">
                        <span className={cn("h-2.5 w-2.5 rounded-full", d.risk === "HIGH" ? "bg-risk-high" : d.risk === "MEDIUM" ? "bg-amber-500" : "bg-forest-500")} />
                        <span className="flex-1 text-sm font-medium text-ink-900 truncate">{d.district.name}</span>
                        <span className="text-xs text-ink-500">{d.threats} threat{d.threats > 1 ? "s" : ""}</span>
                        <span className="w-10 text-right font-display text-sm font-bold text-ink-900">{d.cases}</span>
                        <span className={cn("w-12 text-right text-xs font-semibold", d.trend >= 0 ? "text-risk-high" : "text-forest-700")}>{d.trend >= 0 ? "+" : ""}{d.trend}%</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="card-surface p-4">
            <div className="font-display font-bold text-ink-900">Risk distribution</div>
            <RiskRadial counts={rc} height={190} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between"><div className="font-display font-bold text-ink-900">Cases over time</div><span className="text-xs text-ink-500">{filters.range === "7d" ? "last 7 days" : "last 30 days"} · disease vs pest</span></div>
          <div className="mt-3"><CasesOverTime data={trend} keys={[{ key: "disease", label: "Disease", color: "#16624a" }, { key: "pest", label: "Pest", color: "#e09a1c" }]} /></div>
        </div>
        <div className="card-surface p-5">
          <div className="font-display font-bold text-ink-900">Disease / pest distribution</div>
          <Donut data={threats.map((t, i) => ({ name: threatById(t.threatId).name, value: t.cases, color: PALETTE[i % PALETTE.length] }))} centerLabel="cases" centerValue={total} />
          <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11.5px]">
            {threats.slice(0, 6).map((t, i) => (
              <li key={t.threatId} className="flex items-center gap-1.5 text-ink-600"><span className="h-2 w-2 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} /> <span className="truncate">{threatById(t.threatId).name}</span><span className="ml-auto font-semibold text-ink-900">{t.cases}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="font-display font-bold text-ink-900">District-wise cases</div>
          <div className="mt-3"><DistrictBars data={districts.map((d) => ({ name: d.district.name, cases: d.cases, risk: d.risk }))} /></div>
        </div>
        <div className="card-surface p-5">
          <div className="font-display font-bold text-ink-900">Crop-wise cases</div>
          <div className="mt-2"><HorizontalBars data={CROP_DISTRIBUTION.filter((c) => filters.crop === "all" || c.cropId === filters.crop).map((c, i) => ({ name: `${cropById(c.cropId).emoji} ${cropById(c.cropId).name}`, value: c.cases, color: PALETTE[i % PALETTE.length] }))} height={250} /></div>
        </div>
      </div>

      <div className="mt-5 card-surface p-5">
        <div className="flex items-center justify-between"><div className="font-display font-bold text-ink-900">Weekly outbreak trend</div><span className="text-xs text-ink-500">cases · AI detections · expert validated</span></div>
        <div className="mt-3"><CasesOverTime data={WEEKLY_TREND} height={220} keys={[{ key: "detections", label: "AI detections", color: "#3d8bd6" }, { key: "cases", label: "Cases", color: "#16624a" }, { key: "validated", label: "Validated", color: "#7e22ce" }]} /></div>
      </div>

      <div className="mt-5 rounded-3xl bg-forest-950 p-5 sm:p-6 text-white">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><div className="text-[11px] font-bold uppercase tracking-[0.16em] text-forest-300">System architecture</div><div className="font-display text-xl font-bold">How the intelligence flows</div></div>
          <div className="text-xs text-white/60">Every farmer scan travels this path to reach this dashboard.</div>
        </div>
        <div className="mt-5"><IntelligenceFlow dark compact /></div>
      </div>
      <div className="mt-3 text-[11px] text-ink-400">Selected district: {filters.district === "all" ? "all" : districtById(filters.district).name} · <RiskBadge level="HIGH" className="align-middle px-1.5 py-0" /> zones are auto-escalated to the Joint Director.</div>
    </GovShell>
  );
}
