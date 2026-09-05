"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Users, UserPlus, Smartphone, MapPin, ChevronRight, Landmark } from "lucide-react";
import { GovShell } from "@/components/gov/gov-shell";
import { useApp } from "@/lib/store/app-store";
import { FARMERS } from "@/lib/mock/farmers";
import { cropById, districtById, DISTRICTS } from "@/lib/mock/geo";
import { StatCard } from "@/components/ui/stat-card";
import { Input, Select } from "@/components/ui/select";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { SoilNutrients } from "@/components/farmer/soil-nutrients";
import type { Farmer } from "@/lib/types";
import { CaseCard } from "@/components/shared/case-card";
import { formatDate } from "@/lib/utils";

export default function Farmers() {
  const { cases } = useApp();
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("all");
  const [open, setOpen] = useState<Farmer | null>(null);
  const list = useMemo(() => FARMERS.filter((f) => (district === "all" || f.districtId === district) && (q === "" || `${f.name} ${f.id} ${f.village} ${f.mobile}`.toLowerCase().includes(q.toLowerCase()))), [q, district]);

  return (
    <GovShell title="Farmers" subtitle="Unique Farmer ID registry linked to Soil Health Cards and case history">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered farmers" value={12480} tone="green" icon={<Users className="h-4.5 w-4.5" />} delta={8} />
        <StatCard label="New this week" value={318} tone="blue" icon={<UserPlus className="h-4.5 w-4.5" />} />
        <StatCard label="Active app users (30d)" value={7912} tone="neutral" icon={<Smartphone className="h-4.5 w-4.5" />} />
        <StatCard label="Soil cards linked" value={9104} tone="amber" icon={<Landmark className="h-4.5 w-4.5" />} />
      </div>
      <div className="mt-5 card-surface">
        <div className="flex flex-col gap-2 border-b border-ink-100 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" /><Input className="pl-10 h-10" placeholder="Search by name, Farmer ID, village or mobile" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Select value={district} onChange={(e) => setDistrict(e.target.value)} className="sm:w-48"><option value="all">All districts</option>{DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
        </div>
        <div className="hidden md:grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr_0.7fr_32px] gap-3 bg-sand-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-500"><span>Farmer</span><span>Location</span><span>Current crop</span><span>Land</span><span>Reports</span><span>Status</span><span /></div>
        {list.map((f, i) => {
          const fc = cases.filter((c) => c.farmerId === f.id);
          const openCase = fc.find((c) => c.status === "Pending" || c.status === "Under Review");
          const plot = f.plots[0];
          return (
            <motion.button key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} onClick={() => setOpen(f)} className="grid w-full grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr_0.7fr_32px] items-center gap-3 border-b border-ink-100 px-4 py-3 text-left hover:bg-forest-50/60">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-xs font-bold text-white" style={{ background: `hsl(${f.avatarHue} 40% 35%)` }}>{f.name.split(" ").map((x) => x[0]).join("")}</div><div><div className="text-sm font-semibold text-ink-900">{f.name}</div><div className="font-mono text-[11px] text-ink-500">{f.id}</div></div></div>
              <div className="text-sm text-ink-700 inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-ink-400" /> {f.village}, {districtById(f.districtId).name}</div>
              <div className="text-sm text-ink-700">{cropById(plot.cropId).emoji} {cropById(plot.cropId).name} · <span className="text-xs text-ink-500">{plot.stage}</span></div>
              <div className="text-sm text-ink-700">{f.landHa} ha</div>
              <div className="text-sm text-ink-700">{fc.length}</div>
              <div>{openCase ? <StatusBadge status={openCase.status} /> : <Badge tone="green" dot>Healthy</Badge>}</div>
              <ChevronRight className="hidden md:block h-4 w-4 text-ink-300" />
            </motion.button>
          );
        })}
        {list.length === 0 && <div className="p-10 text-center text-sm text-ink-500">No farmers match.</div>}
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `${open.name} · ${open.id}` : ""} size="xl">
        {open && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-sand-100 p-3"><div className="text-[11px] text-ink-500">Village / Taluka</div><div className="font-semibold text-ink-900">{open.village}, {open.taluka}</div></div>
                <div className="rounded-xl bg-sand-100 p-3"><div className="text-[11px] text-ink-500">District</div><div className="font-semibold text-ink-900">{districtById(open.districtId).name}</div></div>
                <div className="rounded-xl bg-sand-100 p-3"><div className="text-[11px] text-ink-500">Mobile</div><div className="font-semibold text-ink-900">{open.mobile}</div></div>
                <div className="rounded-xl bg-sand-100 p-3"><div className="text-[11px] text-ink-500">Registered</div><div className="font-semibold text-ink-900">{formatDate(open.registeredOn, { day: "numeric", month: "short", year: "numeric" })}</div></div>
              </div>
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">Plots ({open.landHa} ha)</div>
                <ul className="space-y-1.5">{open.plots.map((p) => <li key={p.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-sm"><span>{cropById(p.cropId).emoji} {cropById(p.cropId).name} · {p.stage}</span><span className="text-xs text-ink-500">{p.areaHa} ha · {p.irrigation}</span></li>)}</ul>
              </div>
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">Case history</div>
                <div className="space-y-2">{cases.filter((c) => c.farmerId === open.id).map((c) => <CaseCard key={c.id} c={c} href={`/gov/validation/${c.id}`} />)}{cases.filter((c) => c.farmerId === open.id).length === 0 && <div className="text-sm text-ink-500">No cases reported.</div>}</div>
              </div>
            </div>
            <div><SoilNutrients soil={open.soil} /><Link href="/farmer/farm" className="mt-3 inline-flex text-xs font-semibold text-forest-800 hover:underline">Open the farmer&apos;s Soil Health Card view →</Link></div>
          </div>
        )}
      </Modal>
    </GovShell>
  );
}
