"use client";

import { Filter, RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/select";
import { DISTRICTS, CROPS, THREATS } from "@/lib/mock/geo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface GovFilters { district: string; crop: string; threat: string; risk: string; range: string }
export const DEFAULT_FILTERS: GovFilters = { district: "all", crop: "all", threat: "all", risk: "all", range: "30d" };

export function FilterBar({ value, onChange, className }: { value: GovFilters; onChange: (v: GovFilters) => void; className?: string }) {
  const set = (k: keyof GovFilters) => (e: React.ChangeEvent<HTMLSelectElement>) => onChange({ ...value, [k]: e.target.value });
  const dirty = JSON.stringify(value) !== JSON.stringify(DEFAULT_FILTERS);
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 mr-1"><Filter className="h-3.5 w-3.5" /> Filters</span>
      <Select value={value.district} onChange={set("district")} className="w-44"><option value="all">All districts</option>{DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
      <Select value={value.crop} onChange={set("crop")} className="w-36"><option value="all">All crops</option>{CROPS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
      <Select value={value.threat} onChange={set("threat")} className="w-44"><option value="all">All diseases / pests</option>{THREATS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
      <Select value={value.risk} onChange={set("risk")} className="w-32"><option value="all">All risk</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option></Select>
      <Select value={value.range} onChange={set("range")} className="w-36"><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="season">Kharif 2026</option></Select>
      {dirty && <Button size="sm" variant="ghost" onClick={() => onChange(DEFAULT_FILTERS)}><RotateCcw className="h-3.5 w-3.5" /> Reset</Button>}
    </div>
  );
}

export function applyFilters<T extends { districtId: string; cropId: string; threatId?: string; risk: string }>(items: T[], f: GovFilters, threatKey: (t: T) => string = (t) => t.threatId ?? "") {
  return items.filter((i) => (f.district === "all" || i.districtId === f.district) && (f.crop === "all" || i.cropId === f.crop) && (f.threat === "all" || threatKey(i) === f.threat) && (f.risk === "all" || i.risk === f.risk));
}
