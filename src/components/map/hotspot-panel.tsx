"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Bug, Leaf, MapPin, X, Users, Clock, Send } from "lucide-react";
import type { Hotspot } from "@/lib/types";
import { cropById, districtById, threatById } from "@/lib/mock/geo";
import { RiskBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { relativeTime } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress";

export function HotspotPanel({ hotspot, onClose, onAdvisory, compact }: { hotspot: Hotspot; onClose?: () => void; onAdvisory?: () => void; compact?: boolean }) {
  const d = districtById(hotspot.districtId);
  const c = cropById(hotspot.cropId);
  const t = threatById(hotspot.threatId);
  const up = hotspot.trend7d >= 0;
  return (
    <motion.div key={hotspot.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="card-surface overflow-hidden">
      <div className="relative bg-gradient-to-br from-forest-900 to-forest-700 px-5 pt-5 pb-4 text-white">
        {onClose && (
          <button onClick={onClose} className="absolute right-3 top-3 h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center gap-2 text-xs text-white/70"><MapPin className="h-3.5 w-3.5" /> {d.name} district · {d.region}</div>
        <div className="mt-1.5 font-display text-xl font-bold">{t.name}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <RiskBadge level={hotspot.risk} />
          <Badge tone="dark" className="bg-white/15 text-white">{t.type === "pest" ? <Bug className="h-3 w-3" /> : <Leaf className="h-3 w-3" />}{t.type}</Badge>
          <Badge tone="dark" className="bg-white/15 text-white">{c.emoji} {c.name}</Badge>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-sand-100 p-3">
            <div className="text-[11px] font-medium text-ink-500">Cases</div>
            <div className="font-display text-2xl font-bold text-ink-900">{hotspot.cases}</div>
          </div>
          <div className="rounded-xl bg-sand-100 p-3">
            <div className="text-[11px] font-medium text-ink-500">Last 7 days</div>
            <div className={`font-display text-2xl font-bold inline-flex items-center ${up ? "text-risk-high" : "text-forest-700"}`}>
              {up ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
              {Math.abs(hotspot.trend7d)}%
            </div>
          </div>
          <div className="rounded-xl bg-sand-100 p-3">
            <div className="text-[11px] font-medium text-ink-500">Radius</div>
            <div className="font-display text-2xl font-bold text-ink-900">{hotspot.radiusKm}<span className="text-sm text-ink-500"> km</span></div>
          </div>
        </div>
        {!compact && (
          <>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-medium text-ink-600">Cluster intensity</span><span className="text-ink-500">{Math.min(100, Math.round(hotspot.cases * 1.6))}/100</span></div>
              <ProgressBar value={Math.min(100, hotspot.cases * 1.6)} color={hotspot.risk === "HIGH" ? "bg-risk-high" : hotspot.risk === "MEDIUM" ? "bg-amber-500" : "bg-forest-600"} />
            </div>
            <div className="rounded-xl border border-ink-100 p-3 text-xs text-ink-600">
              <div className="font-semibold text-ink-800 mb-1">Favourable conditions</div>
              {t.favours}
            </div>
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> ~{Math.round(hotspot.cases * 38)} growers in zone</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {relativeTime(hotspot.lastReported)}</span>
            </div>
          </>
        )}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={onAdvisory}><Send className="h-3.5 w-3.5" /> Push advisory</Button>
          <Button size="sm" variant="outline" className="flex-1">Assign officer</Button>
        </div>
      </div>
    </motion.div>
  );
}
