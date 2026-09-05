"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileBarChart, Download, FileText, Calendar, CheckCircle2, Printer } from "lucide-react";
import { GovShell } from "@/components/gov/gov-shell";
import { useApp } from "@/lib/store/app-store";
import { mergedHotspots, riskCounts, districtRisk, threatDistribution, totalCases } from "@/lib/store/selectors";
import { threatById } from "@/lib/mock/geo";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { CasesOverTime, Donut, PALETTE } from "@/components/charts/charts";
import { WEEKLY_TREND, IMPACT } from "@/lib/mock/analytics";
import { CountUp } from "@/components/ui/count-up";
import { RiskBadge } from "@/components/ui/badge";

const REPORTS = [
  { id: "R-2026-36", name: "Weekly Crop Health Bulletin · Week 36", type: "Bulletin", date: "05 Sep 2026", pages: 6, status: "Ready" },
  { id: "R-2026-35", name: "Weekly Crop Health Bulletin · Week 35", type: "Bulletin", date: "29 Aug 2026", pages: 6, status: "Ready" },
  { id: "R-PBW-01", name: "Pink Bollworm Situation Report · Vidarbha + Khandesh", type: "Situation report", date: "04 Sep 2026", pages: 11, status: "Ready" },
  { id: "R-GR-02", name: "Grape belt fungal outlook · Nashik, Sangli", type: "Forecast", date: "03 Sep 2026", pages: 4, status: "Ready" },
  { id: "R-IPM-Q2", name: "IPM adoption and pesticide reduction · Q2", type: "Impact", date: "31 Aug 2026", pages: 18, status: "Ready" },
  { id: "R-2026-37", name: "Weekly Crop Health Bulletin · Week 37", type: "Bulletin", date: "12 Sep 2026", pages: 0, status: "Scheduled" },
];

export default function Reports() {
  const { cases } = useApp();
  const spots = mergedHotspots(cases);
  const rc = riskCounts(spots);
  const districts = districtRisk(spots).filter((d) => d.cases > 0);
  const threats = threatDistribution(spots);
  const [preview, setPreview] = useState(false);
  const [gen, setGen] = useState<"idle" | "working" | "done">("idle");

  return (
    <GovShell title="Reports" subtitle="Bulletins, situation reports and planning briefs generated from live surveillance data" actions={<><Select className="w-44" defaultValue="week"><option value="week">This week</option><option value="month">This month</option><option value="season">Kharif 2026</option></Select><Button onClick={() => { setGen("working"); setTimeout(() => setGen("done"), 1500); }} loading={gen === "working"}><FileBarChart className="h-4 w-4" /> {gen === "done" ? "Generated" : "Generate weekly bulletin"}</Button></>}>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="card-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3"><div className="font-display font-bold text-ink-900">Report library</div><span className="text-xs text-ink-500">{REPORTS.length} documents</span></div>
          <ul className="divide-y divide-ink-100">
            {REPORTS.map((r, i) => (
              <motion.li key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 px-5 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-earth-800"><FileText className="h-4.5 w-4.5" /></span>
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-ink-900 truncate">{r.name}</div><div className="text-xs text-ink-500 inline-flex items-center gap-2"><span>{r.type}</span>·<span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{r.date}</span>{r.pages > 0 && <>·<span>{r.pages} pages</span></>}</div></div>
                {r.status === "Ready" ? <div className="flex gap-1.5"><Button size="sm" variant="outline" onClick={() => setPreview(true)}>Preview</Button><Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button></div> : <span className="text-xs font-semibold text-ink-400">Scheduled</span>}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="card-surface p-5">
            <div className="font-display font-bold text-ink-900">Bulletin snapshot · Week 36</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-sand-100 p-3"><div className="font-display text-2xl font-bold text-ink-900"><CountUp value={totalCases(spots)} /></div><div className="text-[11px] text-ink-500">cases</div></div>
              <div className="rounded-xl bg-red-50 p-3"><div className="font-display text-2xl font-bold text-risk-high"><CountUp value={rc.HIGH} /></div><div className="text-[11px] text-ink-500">high-risk clusters</div></div>
              <div className="rounded-xl bg-forest-50 p-3"><div className="font-display text-2xl font-bold text-forest-800"><CountUp value={districts.length} /></div><div className="text-[11px] text-ink-500">districts</div></div>
            </div>
            <div className="mt-3"><CasesOverTime data={WEEKLY_TREND} height={160} /></div>
          </div>
          <div className="card-surface p-5">
            <div className="font-display font-bold text-ink-900">Impact metrics</div>
            <ul className="mt-3 grid grid-cols-2 gap-2">{IMPACT.map((m) => <li key={m.label} className="rounded-xl border border-ink-100 p-3"><div className="font-display text-xl font-bold text-forest-800"><CountUp value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} /></div><div className="text-[11px] text-ink-500">{m.label}</div></li>)}</ul>
          </div>
        </div>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title="Weekly Crop Health Bulletin · Week 36" size="xl">
        <div className="space-y-5 text-sm">
          <div className="flex items-center justify-between"><div className="text-xs text-ink-500">Government of Maharashtra · Department of Agriculture · Plant Protection Cell · 05 Sep 2026</div><Button size="sm" variant="outline"><Printer className="h-3.5 w-3.5" /> Print</Button></div>
          <div className="rounded-2xl border border-risk-high/25 bg-red-50 p-4"><div className="text-xs font-bold uppercase tracking-wider text-risk-high">Headline</div><div className="mt-1 font-display text-lg font-bold text-ink-900">High-risk cluster detected in Nashik. Pink bollworm above ETL in Jalgaon and Yavatmal.</div></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><div className="font-semibold text-ink-900 mb-2">District summary</div><table className="w-full text-xs"><tbody className="divide-y divide-ink-100">{districts.slice(0, 8).map((d) => <tr key={d.district.id}><td className="py-1.5 font-medium text-ink-800">{d.district.name}</td><td className="py-1.5 text-right">{d.cases}</td><td className="py-1.5 text-right">{d.trend >= 0 ? "+" : ""}{d.trend}%</td><td className="py-1.5 text-right"><RiskBadge level={d.risk} className="px-1.5 py-0 text-[9px]" /></td></tr>)}</tbody></table></div>
            <div><div className="font-semibold text-ink-900 mb-2">Threat distribution</div><Donut data={threats.slice(0, 6).map((t, i) => ({ name: threatById(t.threatId).name, value: t.cases, color: PALETTE[i] }))} height={200} innerRadius={50} outerRadius={78} /></div>
          </div>
          <div><div className="font-semibold text-ink-900 mb-2">Recommended interventions</div><ul className="space-y-1.5">{["Push early blight IPM advisory to 2,140 tomato growers in Dindori and Niphad; schedule KVK field day on 08 Sep.", "Distribute pheromone lures (8/acre) in 11 Jalgaon and Yavatmal villages; enforce 160-day crop termination messaging.", "Prophylactic bio-spray advisory (Trichoderma, Bordeaux 1%) for Sangli grapes ahead of 21 mm forecast rain.", "Clear 5 pending expert validations in Nashik within 4 hours to unlock advisories."].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />{x}</li>)}</ul></div>
        </div>
      </Modal>
    </GovShell>
  );
}
