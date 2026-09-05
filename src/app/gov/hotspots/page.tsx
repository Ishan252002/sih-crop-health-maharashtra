"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Layers, Bug, Leaf, Send, CheckCircle2 } from "lucide-react";
import { GovShell } from "@/components/gov/gov-shell";
import { FilterBar, DEFAULT_FILTERS, applyFilters, type GovFilters } from "@/components/gov/filter-bar";
import { HotspotMap, MapLegend } from "@/components/map/hotspot-map";
import { HotspotPanel } from "@/components/map/hotspot-panel";
import { useApp } from "@/lib/store/app-store";
import { mergedHotspots, riskCounts } from "@/lib/store/selectors";
import { cropById, districtById, threatById } from "@/lib/mock/geo";
import type { Hotspot } from "@/lib/types";
import { RiskBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SegmentedTabs } from "@/components/ui/tabs";

export default function Hotspots() {
  const { cases } = useApp();
  const [filters, setFilters] = useState<GovFilters>(DEFAULT_FILTERS);
  const [layer, setLayer] = useState<"all" | "disease" | "pest">("all");
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [push, setPush] = useState<Hotspot | null>(null);
  const [sent, setSent] = useState(false);
  const spots = useMemo(() => applyFilters(mergedHotspots(cases), filters).filter((h) => layer === "all" || threatById(h.threatId).type === layer), [cases, filters, layer]);
  const rc = riskCounts(spots);
  const ranked = spots.slice().sort((a, b) => (b.risk === "HIGH" ? 2 : b.risk === "MEDIUM" ? 1 : 0) - (a.risk === "HIGH" ? 2 : a.risk === "MEDIUM" ? 1 : 0) || b.cases - a.cases);

  return (
    <GovShell title="Live Hotspots" subtitle="Geospatial clustering of disease and pest cases across Maharashtra" actions={<><FilterBar value={filters} onChange={setFilters} /><SegmentedTabs size="sm" value={layer} onChange={setLayer} options={[{ id: "all", label: "All", icon: <Layers className="h-3.5 w-3.5" /> }, { id: "disease", label: "Disease", icon: <Leaf className="h-3.5 w-3.5" /> }, { id: "pest", label: "Pest", icon: <Bug className="h-3.5 w-3.5" /> }]} /></>}>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="card-surface relative overflow-hidden h-[calc(100dvh-260px)] min-h-[560px]">
          <HotspotMap hotspots={spots} height="100%" selectedId={selected?.id} onSelect={setSelected} zoom={6.5} center={[19.3, 76.6]} />
          <MapLegend className="absolute left-3 bottom-3 z-[500]" />
          <div className="absolute left-3 top-3 z-[500] flex gap-2">
            {(["HIGH", "MEDIUM", "LOW"] as const).map((l) => (
              <div key={l} className="glass rounded-xl px-3 py-2 shadow-soft"><div className="text-[10px] font-bold uppercase tracking-wider text-ink-500">{l}</div><div className={cn("font-display text-lg font-bold", l === "HIGH" ? "text-risk-high" : l === "MEDIUM" ? "text-amber-600" : "text-forest-700")}>{rc[l]}</div></div>
            ))}
          </div>
        </div>
        <div className="space-y-4 xl:max-h-[calc(100dvh-260px)] xl:overflow-y-auto xl:pr-1">
          <AnimatePresence mode="wait">
            {selected && <HotspotPanel key={selected.id} hotspot={selected} onClose={() => setSelected(null)} onAdvisory={() => { setSent(false); setPush(selected); }} />}
          </AnimatePresence>
          <div className="card-surface">
            <div className="px-5 pt-4 pb-2 font-display font-bold text-ink-900">Ranked clusters</div>
            <ul className="divide-y divide-ink-100">
              {ranked.map((h, i) => {
                const t = threatById(h.threatId);
                return (
                  <li key={h.id}>
                    <button onClick={() => setSelected(h)} className={cn("flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-forest-50/60", selected?.id === h.id && "bg-forest-50")}>
                      <span className="w-5 text-xs font-bold text-ink-400">{i + 1}</span>
                      <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", t.type === "pest" ? "bg-amber-100 text-amber-600" : "bg-forest-100 text-forest-700")}>{t.type === "pest" ? <Bug className="h-4 w-4" /> : <Leaf className="h-4 w-4" />}</span>
                      <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-ink-900 truncate">{t.name}</div><div className="text-[11px] text-ink-500 truncate">{districtById(h.districtId).name} · {cropById(h.cropId).emoji} {cropById(h.cropId).name}</div></div>
                      <div className="text-right"><div className="font-display text-sm font-bold text-ink-900">{h.cases}</div><div className={cn("text-[11px] font-semibold", h.trend7d >= 0 ? "text-risk-high" : "text-forest-700")}>{h.trend7d >= 0 ? "+" : ""}{h.trend7d}%</div></div>
                      <RiskBadge level={h.risk} className="px-1.5 py-0 text-[9px]" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <Modal open={!!push} onClose={() => setPush(null)} title="Push advisory to zone">
        {push && (sent ? (
          <div className="py-4 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" /><div className="mt-3 font-display text-lg font-bold text-ink-900">Advisory queued</div><div className="mt-1 text-sm text-ink-500">~{Math.round(push.cases * 38).toLocaleString("en-IN")} farmers in {districtById(push.districtId).name} will receive the {threatById(push.threatId).name} IPM advisory by SMS, WhatsApp and app in Marathi, Hindi and English.</div><Button className="mt-4 w-full" onClick={() => setPush(null)}>Done</Button></div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-xs text-ink-500">Zone</div><div className="font-semibold text-ink-900">{districtById(push.districtId).name} · {push.radiusKm} km radius · {cropById(push.cropId).name}</div></div>
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-xs text-ink-500">Advisory</div><div className="font-semibold text-ink-900">{threatById(push.threatId).name} · IPM ladder · 3 languages</div></div>
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-xs text-ink-500">Recipients</div><div className="font-semibold text-ink-900">~{Math.round(push.cases * 38).toLocaleString("en-IN")} registered growers · 4 Taluka officers CC</div></div>
            <div className="flex gap-2"><Button variant="ghost" onClick={() => setPush(null)}>Cancel</Button><Button className="flex-1" onClick={() => setSent(true)}><Send className="h-4 w-4" /> Send advisory</Button></div>
          </div>
        ))}
      </Modal>
    </GovShell>
  );
}
