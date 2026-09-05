"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Plus, SkipForward, ChevronRight, Landmark, BadgeCheck, CalendarRange, IndianRupee, Sprout, MapPin, Trash2 } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { DEMO_FARMER, DEMO_INSURANCE } from "@/lib/mock/farmers";
import { CROPS, cropById } from "@/lib/mock/geo";
import { CROP_NAMES } from "@/lib/i18n/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import type { CropInsurance } from "@/lib/types";

const money = (n: number) => `₹${new Intl.NumberFormat("en-IN").format(n)}`;

function statusTone(s: CropInsurance["status"]) {
  return s === "Active" ? "green" : s === "Pending" ? "amber" : "neutral";
}

export function useStatusLabel() {
  const { t } = useApp();
  return (s: CropInsurance["status"]) => (s === "Active" ? t.statusActive : s === "Pending" ? t.statusPending : t.statusExpired);
}

/** Modal form. Pre-filled with the demo policy so one tap adds it. */
export function InsuranceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang, setInsurance } = useApp();
  const [form, setForm] = useState<CropInsurance>({ ...DEMO_INSURANCE, addedOn: new Date().toISOString().slice(0, 10) });
  const set = <K extends keyof CropInsurance>(k: K, v: CropInsurance[K]) => setForm((f) => ({ ...f, [k]: v }));
  const field = "block text-xs font-semibold text-ink-600";
  return (
    <Modal open={open} onClose={onClose} title={t.addInsurance}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl bg-forest-50 px-3 py-2 text-xs text-forest-800"><ShieldCheck className="h-4 w-4" /> {t.linkedTo} <span className="font-mono font-semibold">{DEMO_FARMER.id}</span></div>
        <label className={field}>{t.policyNumber}<Input className="mt-1 font-mono" value={form.policyNumber} onChange={(e) => set("policyNumber", e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-2">
          <label className={field}>{t.insuredCrop}<Select className="mt-1" value={form.cropId} onChange={(e) => set("cropId", e.target.value)}>{CROPS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {CROP_NAMES[lang][c.id]}</option>)}</Select></label>
          <label className={field}>{t.season}<Select className="mt-1" value={form.season} onChange={(e) => set("season", e.target.value)}><option>Kharif 2026</option><option>Rabi 2026-27</option><option>Kharif 2025</option></Select></label>
        </div>
        <label className={field}>{t.provider}<Input className="mt-1" value={form.provider} onChange={(e) => set("provider", e.target.value)} /><Input className="mt-1.5" value={form.scheme} onChange={(e) => set("scheme", e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-2">
          <label className={field}>{t.coverage} (₹)<Input className="mt-1" inputMode="numeric" value={form.coverage} onChange={(e) => set("coverage", Number(e.target.value.replace(/\D/g, "")) || 0)} /></label>
          <label className={field}>{t.policyStatus}<Select className="mt-1" value={form.status} onChange={(e) => set("status", e.target.value as CropInsurance["status"])}><option value="Active">{t.statusActive}</option><option value="Pending">{t.statusPending}</option><option value="Expired">{t.statusExpired}</option></Select></label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className={field}>{t.validity}<Input className="mt-1" type="date" value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)} /></label>
          <label className={field}>&nbsp;<Input className="mt-1" type="date" value={form.validTo} onChange={(e) => set("validTo", e.target.value)} /></label>
        </div>
        <label className={field}>{t.plot}<Select className="mt-1" value={form.plotId} onChange={(e) => set("plotId", e.target.value)}>{DEMO_FARMER.plots.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.areaHa} ha</option>)}</Select></label>
        <div className="text-[11px] text-ink-500">{t.notAddedNote}</div>
        <div className="flex gap-2"><Button variant="ghost" onClick={onClose}>{t.back}</Button><Button className="flex-1" onClick={() => { setInsurance({ ...form, farmerId: DEMO_FARMER.id }); onClose(); }}><BadgeCheck className="h-4 w-4" /> {t.saveDocument}</Button></div>
      </div>
    </Modal>
  );
}

/** Compact status card for the farmer dashboard. */
export function InsuranceStatusCard({ className }: { className?: string }) {
  const { t, lang, insurance } = useApp();
  const [open, setOpen] = useState(false);
  const label = useStatusLabel();
  if (insurance) {
    const crop = cropById(insurance.cropId);
    return (
      <Link href="/farmer/profile#documents" className={cn("card-surface flex items-center gap-3 p-3.5 transition-all hover:shadow-lift", className)}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-800"><ShieldCheck className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><span className="text-sm font-semibold text-ink-900">{t.cropInsurance}</span><Badge tone={statusTone(insurance.status)} dot className="px-1.5 py-0 text-[10px]">{label(insurance.status)}</Badge></div>
          <div className="mt-0.5 truncate text-xs text-ink-500">{crop.emoji} {CROP_NAMES[lang][crop.id]} · {insurance.season} · {money(insurance.coverage)} · <span className="font-mono">{insurance.policyNumber}</span></div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
      </Link>
    );
  }
  return (
    <>
      <div className={cn("card-surface flex items-center gap-3 p-3.5", className)}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-ink-500"><ShieldCheck className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><span className="text-sm font-semibold text-ink-900">{t.cropInsurance}</span><Badge tone="neutral" className="px-1.5 py-0 text-[10px]">{t.notAdded} · {t.optional}</Badge></div>
          <div className="mt-0.5 text-xs text-ink-500">{t.addLater}</div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}><Plus className="h-3.5 w-3.5" /> Add</Button>
      </div>
      <InsuranceModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Full document card (Profile → My Documents). */
export function InsuranceDocumentCard() {
  const { t, lang, insurance, setInsurance } = useApp();
  const [open, setOpen] = useState(false);
  const label = useStatusLabel();
  if (!insurance) {
    return (
      <>
        <div className="card-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sand-100 text-ink-500"><ShieldCheck className="h-5 w-5" /></span>
              <div><div className="font-semibold text-ink-900">{t.cropInsurance}</div><div className="text-xs text-ink-500">{t.notAdded} · {t.optional}</div></div>
            </div>
            <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-3.5 w-3.5" /> {t.addInsurance}</Button>
          </div>
          <div className="mt-3 rounded-xl bg-sand-100 p-3 text-xs text-ink-600">{t.notAddedNote}</div>
        </div>
        <InsuranceModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }
  const crop = cropById(insurance.cropId);
  const plot = DEMO_FARMER.plots.find((p) => p.id === insurance.plotId);
  const rows = [
    { icon: FileText, k: t.policyNumber, v: insurance.policyNumber, mono: true },
    { icon: Sprout, k: t.insuredCrop, v: `${crop.emoji} ${CROP_NAMES[lang][crop.id]}` },
    { icon: Landmark, k: t.provider, v: `${insurance.provider} · ${insurance.scheme}` },
    { icon: CalendarRange, k: t.season, v: insurance.season },
    { icon: IndianRupee, k: t.coverage, v: money(insurance.coverage) },
    { icon: CalendarRange, k: t.validity, v: `${formatDate(insurance.validFrom, { day: "numeric", month: "short", year: "numeric" })} – ${formatDate(insurance.validTo, { day: "numeric", month: "short", year: "numeric" })}` },
    { icon: MapPin, k: t.plot, v: plot ? `${plot.name} · ${plot.areaHa} ha` : insurance.plotId },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-surface overflow-hidden">
      <div className="relative bg-gradient-to-br from-forest-900 to-forest-700 p-4 text-white">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-200">{t.cropInsurance}</div>
            <div className="mt-0.5 font-mono text-lg font-bold">{insurance.policyNumber}</div>
            <div className="text-xs text-white/75">{t.linkedTo} · {insurance.farmerId}</div>
          </div>
          <Badge tone={statusTone(insurance.status)} dot>{label(insurance.status)}</Badge>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div><div className="text-[11px] text-white/70">{t.coverage}</div><div className="font-display text-2xl font-bold">{money(insurance.coverage)}</div></div>
          <div className="text-right"><div className="text-[11px] text-white/70">{t.insuredCrop}</div><div className="font-semibold">{crop.emoji} {CROP_NAMES[lang][crop.id]} · {insurance.season}</div></div>
        </div>
      </div>
      <div className="divide-y divide-ink-100">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.k} className="flex items-center gap-3 px-4 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand-100 text-ink-500"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1"><div className="text-[11px] text-ink-500">{r.k}</div><div className={cn("text-sm font-semibold text-ink-900", r.mono && "font-mono")}>{r.v}</div></div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-[11px] text-ink-500">
        <span>Added {formatDate(insurance.addedOn, { day: "numeric", month: "short", year: "numeric" })} · reference only, no claims</span>
        <button onClick={() => setInsurance(null)} className="inline-flex items-center gap-1 font-semibold text-ink-500 hover:text-risk-high"><Trash2 className="h-3 w-3" /> {t.remove}</button>
      </div>
    </motion.div>
  );
}

function DocRow({ icon: Icon, title, done, skipped, onAdd, onSkip, onUndo, children }: { icon: React.ComponentType<{ className?: string }>; title: string; done?: React.ReactNode; skipped?: boolean; onAdd: () => void; onSkip: () => void; onUndo: () => void; children?: React.ReactNode }) {
  const { t } = useApp();
  return (
    <div className="rounded-2xl border border-dashed border-earth-400 bg-earth-100/50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-earth-900"><Icon className="h-4 w-4" /> {title} <span className="font-normal text-ink-500">({t.optional})</span></div>
        {done ? null : skipped ? (
          <button type="button" onClick={onUndo} className="text-[11px] font-semibold text-forest-700 hover:underline">Add</button>
        ) : (
          <div className="flex items-center gap-2">
            <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-lg bg-forest-800 px-2 py-1 text-[11px] font-semibold text-white"><Plus className="h-3 w-3" /> Add</button>
            <button type="button" onClick={onSkip} className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-500 hover:text-ink-800"><SkipForward className="h-3 w-3" /> {t.skipForNow}</button>
          </div>
        )}
      </div>
      {done ? <div className="mt-2">{done}</div> : skipped ? <div className="mt-1.5 text-[11px] text-ink-500">{t.skippedNote} {t.addLater}</div> : children}
    </div>
  );
}

/** Onboarding block: two optional documents, each with Add / Skip for now. */
export function OnboardingDocuments() {
  const { t, insurance, insuranceSkipped, skipInsurance, setInsurance } = useApp();
  const [soil, setSoil] = useState<"ask" | "skip" | "add">("ask");
  const [open, setOpen] = useState(false);
  const label = useStatusLabel();
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{t.documents} · {t.optional}</div>
      <DocRow icon={Landmark} title={t.soilHealthCard} skipped={soil === "skip"} onAdd={() => setSoil("add")} onSkip={() => setSoil("skip")} onUndo={() => setSoil("ask")}>
        {soil === "add" && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input className="h-10 font-mono text-xs" placeholder="SHC-MH-NSK-0234981" />
            <Select className="[&>select]:h-10" defaultValue=""><option value="">Soil type</option><option>Medium black</option><option>Deep black</option><option>Red loam</option><option>Laterite</option><option>Alluvial</option></Select>
          </div>
        )}
      </DocRow>
      <DocRow
        icon={ShieldCheck}
        title={t.cropInsurance}
        skipped={insuranceSkipped}
        onAdd={() => setOpen(true)}
        onSkip={skipInsurance}
        onUndo={() => setOpen(true)}
        done={insurance ? (
          <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs">
            <span className="font-mono font-semibold text-ink-900">{insurance.policyNumber}</span>
            <span className="flex items-center gap-2"><Badge tone={statusTone(insurance.status)} dot className="px-1.5 py-0 text-[10px]">{label(insurance.status)}</Badge><button type="button" onClick={() => setInsurance(null)} className="text-ink-400 hover:text-risk-high"><Trash2 className="h-3.5 w-3.5" /></button></span>
          </div>
        ) : undefined}
      />
      <InsuranceModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export function SoilCardDocument() {
  const { t } = useApp();
  const f = DEMO_FARMER;
  return (
    <Link href="/farmer/farm" className="card-surface flex items-center gap-3 p-4 transition-all hover:shadow-lift">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-earth-100 text-earth-800"><Landmark className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><span className="font-semibold text-ink-900">{t.soilHealthCard}</span><Badge tone="green" dot className="px-1.5 py-0 text-[10px]">{t.linkedTo}</Badge></div>
        <div className="mt-0.5 truncate text-xs text-ink-500 font-mono">{f.soil.cardId} · {f.soil.testedBy}</div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
    </Link>
  );
}
