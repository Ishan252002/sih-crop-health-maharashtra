"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight, Clock, Filter, MapPin } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { cropById, districtById, threatById, DISTRICTS, CROPS } from "@/lib/mock/geo";
import { StatusBadge, RiskBadge, Badge, severityTone } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SegmentedTabs } from "@/components/ui/tabs";
import { cn, relativeTime } from "@/lib/utils";
import type { CaseStatus } from "@/lib/types";
import { EXPERT_THRESHOLD } from "@/lib/ai-mock";

const TABS: { id: "queue" | "all" | CaseStatus; label: string }[] = [
  { id: "queue", label: "Needs review" },
  { id: "all", label: "All" },
  { id: "Confirmed", label: "Confirmed" },
  { id: "Corrected", label: "Corrected" },
  { id: "Referred", label: "Referred" },
];

export function ReviewQueue({ basePath = "/expert/case", compact }: { basePath?: string; compact?: boolean }) {
  const { cases } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("queue");
  const [district, setDistrict] = useState("all");
  const [crop, setCrop] = useState("all");

  const list = useMemo(() => {
    let l = cases.slice().sort((a, b) => (a.status === "Pending" ? -1 : 1) - (b.status === "Pending" ? -1 : 1) || a.ai.confidence - b.ai.confidence);
    if (tab === "queue") l = l.filter((c) => c.status === "Pending" || c.status === "Under Review" || c.status === "More Info Requested");
    else if (tab !== "all") l = l.filter((c) => c.status === tab);
    if (district !== "all") l = l.filter((c) => c.districtId === district);
    if (crop !== "all") l = l.filter((c) => c.cropId === crop);
    return l;
  }, [cases, tab, district, crop]);

  const counts = { pending: cases.filter((c) => c.status === "Pending").length, review: cases.filter((c) => c.status === "Under Review").length, info: cases.filter((c) => c.status === "More Info Requested").length };

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[{ l: "Pending", v: counts.pending, c: "bg-amber-100 text-amber-600" }, { l: "Under review", v: counts.review, c: "bg-sky-100 text-sky-500" }, { l: "Awaiting farmer info", v: counts.info, c: "bg-earth-100 text-earth-800" }].map((s) => (
            <div key={s.l} className="card-surface flex items-center justify-between p-4"><span className="text-sm font-medium text-ink-600">{s.l}</span><span className={cn("rounded-xl px-3 py-1 font-display text-xl font-bold", s.c)}>{s.v}</span></div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SegmentedTabs value={tab} onChange={setTab} options={TABS} size="sm" className="overflow-x-auto hide-scrollbar max-w-full" />
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-400" />
          <Select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-40"><option value="all">All districts</option>{DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
          <Select value={crop} onChange={(e) => setCrop(e.target.value)} className="w-36"><option value="all">All crops</option>{CROPS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
        </div>
      </div>
      <div className="card-surface overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.4fr_1fr_1.2fr_0.9fr_0.7fr_0.9fr_40px] gap-3 border-b border-ink-100 bg-sand-100 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-ink-500">
          <span>Case</span><span>Farmer · location</span><span>AI prediction</span><span>Confidence</span><span>Risk</span><span>Status</span><span />
        </div>
        {list.length === 0 && <div className="p-10 text-center text-sm text-ink-500">No cases match these filters.</div>}
        {list.map((c, i) => {
          const low = c.ai.confidence < EXPERT_THRESHOLD;
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
              <Link href={`${basePath}/${c.id}`} className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1.2fr_0.9fr_0.7fr_0.9fr_40px] items-center gap-3 border-b border-ink-100 px-4 py-3 transition-colors hover:bg-forest-50/60">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" className="h-12 w-16 rounded-lg object-cover bg-ink-100" />
                  <div className="min-w-0"><div className="font-mono text-xs font-semibold text-ink-900">{c.id}</div><div className="text-xs text-ink-500 inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {relativeTime(c.createdAt)}</div></div>
                </div>
                <div className="min-w-0 text-sm"><div className="font-semibold text-ink-900 truncate">{c.farmerName}</div><div className="text-xs text-ink-500 truncate inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.village}, {districtById(c.districtId).name}</div></div>
                <div className="text-sm"><div className="font-semibold text-ink-900">{threatById(c.ai.threatId).name}</div><div className="text-xs text-ink-500">{cropById(c.cropId).emoji} {cropById(c.cropId).name} · <Badge tone={severityTone(c.ai.severity)} className="px-1.5 py-0 text-[10px]">{c.ai.severity}</Badge></div></div>
                <div>
                  <div className="flex items-center gap-2"><span className={cn("font-display text-lg font-bold", low ? "text-amber-600" : "text-forest-700")}>{c.ai.confidence}%</span>{low && <AlertTriangle className="h-4 w-4 text-amber-500" />}</div>
                  <div className="h-1.5 w-24 rounded-full bg-ink-100 overflow-hidden"><div className={cn("h-full rounded-full", low ? "bg-amber-500" : "bg-forest-600")} style={{ width: `${c.ai.confidence}%` }} /></div>
                </div>
                <div><RiskBadge level={c.risk} /></div>
                <div><StatusBadge status={c.status} /></div>
                <ChevronRight className="hidden md:block h-4 w-4 text-ink-300" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
