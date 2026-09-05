"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bug, Leaf, TrendingUp, Timer, Target, Sparkles } from "lucide-react";
import { GovShell } from "@/components/gov/gov-shell";
import { FilterBar, DEFAULT_FILTERS, applyFilters, type GovFilters } from "@/components/gov/filter-bar";
import { useApp } from "@/lib/store/app-store";
import { mergedHotspots, threatDistribution, districtRisk } from "@/lib/store/selectors";
import { cropById, threatById, THREATS, CROPS, districtById } from "@/lib/mock/geo";
import { CasesOverTime, Donut, HorizontalBars, PALETTE, DistrictBars } from "@/components/charts/charts";
import { StatCard } from "@/components/ui/stat-card";
import { RESPONSE_TIMES, WEEKLY_TREND } from "@/lib/mock/analytics";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const { cases } = useApp();
  const [filters, setFilters] = useState<GovFilters>(DEFAULT_FILTERS);
  const spots = useMemo(() => applyFilters(mergedHotspots(cases), filters), [cases, filters]);
  const threats = threatDistribution(spots);
  const districts = districtRisk(spots).filter((d) => d.cases > 0);
  const byCrop = CROPS.map((c) => ({ name: `${c.emoji} ${c.name}`, value: spots.filter((h) => h.cropId === c.id).reduce((a, h) => a + h.cases, 0) })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  const diseaseCases = spots.filter((h) => threatById(h.threatId).type === "disease").reduce((a, h) => a + h.cases, 0);
  const pestCases = spots.filter((h) => threatById(h.threatId).type === "pest").reduce((a, h) => a + h.cases, 0);

  // crop × threat matrix
  const matrix = CROPS.map((c) => ({ crop: c, cells: THREATS.map((t) => spots.filter((h) => h.cropId === c.id && h.threatId === t.id).reduce((a, h) => a + h.cases, 0)) })).filter((r) => r.cells.some((v) => v > 0));
  const max = Math.max(1, ...matrix.flatMap((r) => r.cells));

  return (
    <GovShell title="Disease Analytics" subtitle="Crop-wise and disease-wise distribution, response times and model performance" actions={<FilterBar value={filters} onChange={setFilters} />}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Disease cases" value={diseaseCases} tone="green" icon={<Leaf className="h-4.5 w-4.5" />} delta={14} />
        <StatCard label="Pest cases" value={pestCases} tone="amber" icon={<Bug className="h-4.5 w-4.5" />} delta={9} />
        <StatCard label="Median expert response" value={3.4} decimals={1} suffix=" h" tone="blue" icon={<Timer className="h-4.5 w-4.5" />} delta={-18} invertDelta />
        <StatCard label="AI field accuracy" value={91.2} decimals={1} suffix="%" tone="green" icon={<Target className="h-4.5 w-4.5" />} delta={1.8} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-surface p-5">
          <div className="font-display font-bold text-ink-900">Disease distribution</div>
          <Donut data={threats.map((t, i) => ({ name: threatById(t.threatId).name, value: t.cases, color: PALETTE[i % PALETTE.length] }))} centerLabel="threats" centerValue={threats.length} />
        </div>
        <div className="card-surface p-5">
          <div className="font-display font-bold text-ink-900">Crop-wise cases</div>
          <div className="mt-2"><HorizontalBars data={byCrop.map((c, i) => ({ ...c, color: PALETTE[i % PALETTE.length] }))} height={240} /></div>
        </div>
        <div className="card-surface p-5">
          <div className="font-display font-bold text-ink-900">Detection to action</div>
          <ul className="mt-3 space-y-3">
            {RESPONSE_TIMES.map((r, i) => (
              <li key={r.stage}>
                <div className="flex justify-between text-xs"><span className="text-ink-600">{r.stage}</span><span className="font-semibold text-ink-900">{r.hours < 1 ? `${Math.round(r.hours * 60)} min` : `${r.hours} h`}</span></div>
                <div className="mt-1 h-2 rounded-full bg-ink-100 overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.max(3, (r.hours / 26) * 100)}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} className={cn("h-full rounded-full", i === 3 ? "bg-amber-500" : "bg-forest-600")} /></div>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-xl bg-sand-100 p-3 text-xs text-ink-600">Field-visit latency is the bottleneck. Advisory push closes the loop for 78% of cases without a visit.</div>
        </div>
      </div>

      <div className="mt-5 card-surface p-5 overflow-x-auto">
        <div className="flex items-center justify-between"><div className="font-display font-bold text-ink-900">Crop × threat heat matrix</div><span className="text-xs text-ink-500">cases in current filter</span></div>
        <table className="mt-3 w-full min-w-[760px] text-xs">
          <thead><tr><th className="px-2 py-1.5 text-left text-ink-500 font-semibold">Crop</th>{THREATS.map((t) => <th key={t.id} className="px-1 py-1.5 text-center font-semibold text-ink-500"><div className="mx-auto max-w-[72px] leading-tight">{t.name}</div></th>)}</tr></thead>
          <tbody>
            {matrix.map((r) => (
              <tr key={r.crop.id}>
                <td className="px-2 py-1.5 font-semibold text-ink-900 whitespace-nowrap">{r.crop.emoji} {r.crop.name}</td>
                {r.cells.map((v, i) => (
                  <td key={i} className="p-1"><div className="flex h-9 items-center justify-center rounded-lg font-bold" style={{ background: v ? `rgba(22,98,74,${0.12 + (v / max) * 0.78})` : "#f4f1e9", color: v / max > 0.5 ? "#fff" : v ? "#0b3d2e" : "#b3bcb7" }}>{v || "·"}</div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="card-surface p-5">
          <div className="flex items-center justify-between"><div className="font-display font-bold text-ink-900">Weekly trend · detections vs validated</div><TrendingUp className="h-4 w-4 text-forest-700" /></div>
          <div className="mt-3"><CasesOverTime data={WEEKLY_TREND} height={240} keys={[{ key: "detections", label: "AI detections", color: "#3d8bd6" }, { key: "validated", label: "Validated", color: "#7e22ce" }]} /></div>
        </div>
        <div className="card-surface p-5">
          <div className="font-display font-bold text-ink-900">District-wise cases</div>
          <div className="mt-3"><DistrictBars data={districts.map((d) => ({ name: d.district.name, cases: d.cases, risk: d.risk }))} height={240} /></div>
        </div>
      </div>

      <div className="mt-5 card-surface p-5">
        <div className="flex items-center gap-2 font-display font-bold text-ink-900"><Sparkles className="h-4 w-4 text-purple-700" /> Model performance by class (CropNet-v2.3, field-validated)</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {[["Early Blight", 94, 412], ["Late Blight", 89, 168], ["Powdery Mildew", 92, 301], ["Downy Mildew", 86, 210], ["Aphids", 91, 96], ["Whitefly", 93, 144], ["Pink Bollworm", 90, 388], ["Leaf Spot", 84, 122], ["Stem Borer", 88, 77], ["Healthy", 97, 1210]].map(([n, acc, s]) => (
            <div key={n as string} className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-center justify-between text-xs"><span className="font-semibold text-ink-900">{n}</span><Badge tone={(acc as number) >= 90 ? "green" : "amber"} className="px-1.5 py-0 text-[10px]">{acc}%</Badge></div>
              <div className="mt-1.5 h-1.5 rounded-full bg-ink-100 overflow-hidden"><div className={cn("h-full rounded-full", (acc as number) >= 90 ? "bg-forest-600" : "bg-amber-500")} style={{ width: `${acc}%` }} /></div>
              <div className="mt-1 text-[10.5px] text-ink-500">{s} validated samples</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 text-[11px] text-ink-400">Filtered to {filters.district === "all" ? "all districts" : districtById(filters.district).name}{filters.crop !== "all" ? ` · ${cropById(filters.crop).name}` : ""}.</div>
    </GovShell>
  );
}
