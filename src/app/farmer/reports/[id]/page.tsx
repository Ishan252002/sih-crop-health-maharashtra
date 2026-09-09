"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, MessageSquare, Phone, ThumbsDown, ThumbsUp, UserCheck, XCircle, Camera, ArrowRight } from "lucide-react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { DiagnosisResultCard } from "@/components/farmer/diagnosis-result";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { STATUS_NAMES, THREAT_NAMES } from "@/lib/i18n/ui";
import { weatherFor } from "@/lib/mock/weather";
import { computeRisk } from "@/lib/risk-engine";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { formatDate, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ReportDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, tx, lang, cases, addFollowUp } = useApp();
  const router = useRouter();
  const c = cases.find((x) => x.id === id);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [improved, setImproved] = useState(true);

  if (!c) {
    return (
      <FarmerShell title={t.myReports} back="/farmer/reports"><div className="card-surface p-8 text-center text-sm text-ink-500">{t.reportNotFound}</div></FarmerShell>
    );
  }
  const risk = computeRisk({ weather: weatherFor(c.districtId), cropId: c.cropId, stage: c.stage, threatId: c.ai.threatId, soil: DEMO_FARMER.soil, localCases: 20 });
  const finalThreat = c.expertThreatId ?? c.ai.threatId;

  return (
    <FarmerShell title={c.id} back="/farmer/reports">
      <div className="space-y-3">
        <div className="card-surface p-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{t.status}</div>
            <StatusBadge status={c.status} label={STATUS_NAMES[lang][c.status]} />
          </div>
          <ol className="mt-3 flex items-center gap-1">
            {["Pending", "Under Review", c.status === "Corrected" ? "Corrected" : c.status === "Referred" ? "Referred" : "Confirmed"].map((s, i) => {
              const order = ["Pending", "Under Review", "Confirmed", "Corrected", "Referred"];
              const reached = c.status === "More Info Requested" ? i === 0 : order.indexOf(c.status) >= (i === 2 ? 2 : i);
              return (
                <li key={s} className="flex flex-1 items-center gap-1">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", reached ? "bg-forest-600 text-white" : "bg-ink-100 text-ink-400")}>{reached ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}</span>
                  <span className={cn("text-[10.5px] font-semibold", reached ? "text-ink-900" : "text-ink-400")}>{STATUS_NAMES[lang][s]}</span>
                  {i < 2 && <span className={cn("h-px flex-1", reached ? "bg-forest-400" : "bg-ink-200")} />}
                </li>
              );
            })}
          </ol>
          {c.expertName && (
            <div className="mt-3 flex items-start gap-3 rounded-xl bg-purple-50 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-purple-700 shadow-soft"><UserCheck className="h-4.5 w-4.5" /></span>
              <div className="text-[13px]">
                <div className="font-semibold text-ink-900">{tx(c.expertName)}</div>
                {c.expertThreatId && c.expertThreatId !== c.ai.threatId && <div className="text-purple-700 font-semibold">{t.correctedLabel}: {THREAT_NAMES[lang][c.ai.threatId]} → {THREAT_NAMES[lang][c.expertThreatId]}</div>}
                {c.expertNote && <div className="text-ink-600 mt-0.5">{tx(c.expertNote)}</div>}
              </div>
            </div>
          )}
          {c.status === "More Info Requested" && (
            <Button className="mt-3 w-full" variant="amber" onClick={() => router.push("/farmer/check")}><Camera className="h-4 w-4" /> {t.uploadRequestedPhoto}</Button>
          )}
        </div>

        <DiagnosisResultCard image={c.image} cropId={c.cropId} ai={c.ai} risk={c.risk} riskScore={c.riskScore} riskExplanation={risk.explanations[lang]} saved onAdvisory={() => router.push(`/farmer/advisory?threat=${finalThreat}&crop=${c.cropId}&severity=${c.ai.severity}`)} compact soil={DEMO_FARMER.soil} stage={c.stage} />

        <div className="card-surface p-4">
          <div className="flex items-center justify-between">
            <div className="font-display font-bold text-ink-900 inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-forest-700" /> {t.trackFollowUp}</div>
            {c.followUpDue && <span className="text-xs text-ink-500">{t.followUpDue}: {formatDate(c.followUpDue, undefined, lang)}</span>}
          </div>
          <ol className="mt-3 space-y-2">
            {c.followUps.length === 0 && <li className="text-sm text-ink-500">{t.noObservations}</li>}
            {c.followUps.map((f, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 rounded-xl bg-sand-100 p-3">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", f.improved ? "bg-forest-100 text-forest-700" : "bg-red-50 text-risk-high")}>{f.improved ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}</span>
                <div><div className="text-xs text-ink-500">{formatDate(f.date, undefined, lang)}</div><div className="text-sm text-ink-800">{tx(f.note)}</div></div>
              </motion.li>
            ))}
          </ol>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setOpen(true)}><MessageSquare className="h-4 w-4" /> {t.addObservation}</Button>
            <Link href="/farmer/expert"><Button variant="secondary" className="w-full"><Phone className="h-4 w-4" /> {t.expertHelp}</Button></Link>
          </div>
        </div>

        <Link href="/farmer/check" className="flex items-center justify-between rounded-2xl bg-forest-900 p-4 text-white">
          <div><div className="font-display font-bold">{t.rescanTitle}</div><div className="text-xs text-white/70">{t.rescanSub}</div></div>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t.addObservation}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setImproved(true)} className={cn("flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold", improved ? "border-forest-600 bg-forest-50 text-forest-800" : "border-ink-200 text-ink-600")}><ThumbsUp className="h-4 w-4" /> {t.improved}</button>
            <button onClick={() => setImproved(false)} className={cn("flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold", !improved ? "border-risk-high bg-red-50 text-risk-high" : "border-ink-200 text-ink-600")}><XCircle className="h-4 w-4" /> {t.notImproved}</button>
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={t.observationPlaceholder} className="w-full rounded-xl border border-ink-200 p-3 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200" />
          <Button className="w-full" onClick={() => { addFollowUp(c.id, note || (improved ? "Condition improved" : "No improvement, spread continues"), improved); setNote(""); setOpen(false); }}>{t.done}</Button>
        </div>
      </Modal>
    </FarmerShell>
  );
}
