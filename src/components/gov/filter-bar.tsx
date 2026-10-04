"use client";

import { Filter, RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/select";
import { DISTRICTS, CROPS, THREATS, STATES, districtById, districtsByState } from "@/lib/mock/geo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface GovFilters { state: string; district: string; crop: string; threat: string; risk: string; range: string }
export const DEFAULT_FILTERS: GovFilters = { state: "all", district: "all", crop: "all", threat: "all", risk: "all", range: "30d" };

export function FilterBar({ value, onChange, className, hideDistrict }: { value: GovFilters; onChange: (v: GovFilters) => void; className?: string; hideDistrict?: boolean }) {
  const set = (k: keyof GovFilters) => (e: React.ChangeEvent<HTMLSelectElement>) => onChange({ ...value, [k]: e.target.value });
  // Narrowing the state drops a district that no longer belongs to it, so the two
  // selects can never disagree.
  const setState = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    const keep = value.district !== "all" && (state === "all" || districtById(value.district).stateId === state);
    onChange({ ...value, state, district: keep ? value.district : "all" });
  };
  const dirty = JSON.stringify(value) !== JSON.stringify(DEFAULT_FILTERS);
  const districts = value.state === "all" ? DISTRICTS : districtsByState(value.state);
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 mr-1"><Filter className="h-3.5 w-3.5" /> Filters</span>
      <Select value={value.state} onChange={setState} className="w-44"><option value="all">All states</option>{STATES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
      {!hideDistrict && (
        <Select value={value.district} onChange={set("district")} className="w-48">
          <option value="all">{value.state === "all" ? "All districts" : "All districts in state"}</option>
          {value.state === "all"
            ? STATES.map((s) => {
                const ds = districtsByState(s.id);
                return ds.length ? <optgroup key={s.id} label={s.name}>{ds.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup> : null;
              })
            : districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </Select>
      )}
      <Select value={value.crop} onChange={set("crop")} className="w-36"><option value="all">All crops</option>{CROPS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
      <Select value={value.threat} onChange={set("threat")} className="w-44"><option value="all">All diseases / pests</option>{THREATS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
      <Select value={value.risk} onChange={set("risk")} className="w-32"><option value="all">All risk</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option></Select>
      <Select value={value.range} onChange={set("range")} className="w-36"><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="season">Kharif 2026</option></Select>
      {dirty && <Button size="sm" variant="ghost" onClick={() => onChange(DEFAULT_FILTERS)}><RotateCcw className="h-3.5 w-3.5" /> Reset</Button>}
    </div>
  );
}

export function applyFilters<T extends { districtId: string; cropId: string; threatId?: string; risk: string }>(items: T[], f: GovFilters, threatKey: (t: T) => string = (t) => t.threatId ?? "") {
  return items.filter((i) => (f.state === "all" || districtById(i.districtId).stateId === f.state) && (f.district === "all" || i.districtId === f.district) && (f.crop === "all" || i.cropId === f.crop) && (f.threat === "all" || threatKey(i) === f.threat) && (f.risk === "all" || i.risk === f.risk));
}
