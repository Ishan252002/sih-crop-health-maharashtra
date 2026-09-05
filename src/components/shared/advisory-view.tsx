"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Bug, CheckCircle2, ClipboardList, FlaskConical, HelpCircle, Leaf, Phone, Shield, Sprout, Volume2, Share2, Wrench, Eye } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { ADVISORY_LABELS, advisoryFor, type AdvisorySection } from "@/lib/i18n/advisories";
import { CROP_NAMES, SEVERITY_NAMES, THREAT_NAMES } from "@/lib/i18n/ui";
import type { Lang, Severity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const KIND_ICON: Record<AdvisorySection["inputs"][number]["kind"], React.ComponentType<{ className?: string }>> = { cultural: Sprout, biological: Leaf, mechanical: Wrench, monitoring: Eye, chemical: FlaskConical };
const KIND_TONE: Record<AdvisorySection["inputs"][number]["kind"], string> = { cultural: "bg-earth-100 text-earth-800", biological: "bg-forest-100 text-forest-800", mechanical: "bg-sky-100 text-sky-500", monitoring: "bg-purple-50 text-purple-700", chemical: "bg-amber-100 text-amber-600" };

function Section({ icon: Icon, title, children, tone = "bg-forest-100 text-forest-800", i = 0 }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode; tone?: string; i?: number }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.45 }} className="card-surface p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", tone)}><Icon className="h-4 w-4" /></span>
        <h3 className="font-display text-[15px] font-bold text-ink-900">{i + 1}. {title}</h3>
      </div>
      <div className="text-[14px] leading-relaxed text-ink-700">{children}</div>
    </motion.section>
  );
}

export function AdvisoryView({ threatId, cropId, severity, lang: forced, showHeader = true, className, compact }: { threatId: string; cropId: string; severity: Severity; lang?: Lang; showHeader?: boolean; className?: string; compact?: boolean }) {
  const app = useApp();
  const lang = forced ?? app.lang;
  const a = advisoryFor(threatId, lang);
  const L = ADVISORY_LABELS[lang];
  const t = app.t;

  return (
    <div className={cn("space-y-3", className)}>
      {showHeader && (
        <div className="card-surface overflow-hidden">
          <div className="gradient-forest p-4 sm:p-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-200">IPM {t.advisory}</div>
                <div className="mt-1 font-display text-xl font-bold leading-tight">{THREAT_NAMES[lang][threatId]}</div>
                <div className="mt-1 text-sm text-white/75">{CROP_NAMES[lang][cropId]} · <Badge tone={severityTone(severity)} className="align-middle">{SEVERITY_NAMES[lang][severity]}</Badge></div>
              </div>
              <div className="flex gap-1.5">
                <Button size="icon" variant="glass" aria-label={t.listen}><Volume2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="glass" aria-label={t.share}><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="mt-4"><LanguageSwitcher dark className="w-full justify-between sm:w-auto" /></div>
          </div>
          <div className="flex items-start gap-2 bg-amber-100/60 px-4 py-2.5 text-xs text-amber-600">
            <Shield className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{L.ipmNote}</span>
          </div>
        </div>
      )}

      <Section icon={HelpCircle} title={L.what} i={0}>{a.what}</Section>
      <Section icon={Bug} title={L.why} tone="bg-earth-100 text-earth-800" i={1}>{a.why}</Section>
      <Section icon={CheckCircle2} title={L.immediate} tone="bg-risk-high/10 text-risk-high" i={2}>
        <ul className="space-y-2">
          {a.immediate.map((x, i) => (
            <li key={i} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-risk-high" />{x}</li>
          ))}
        </ul>
      </Section>
      <Section icon={Shield} title={L.preventive} i={3}>
        <ul className="space-y-2">
          {a.preventive.map((x, i) => (
            <li key={i} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" />{x}</li>
          ))}
        </ul>
      </Section>
      <Section icon={FlaskConical} title={L.inputs} tone="bg-amber-100 text-amber-600" i={4}>
        <ol className="relative space-y-3 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-px before:bg-ink-200">
          {a.inputs.map((s, i) => {
            const Icon = KIND_ICON[s.kind];
            return (
              <li key={i} className="relative flex gap-3">
                <span className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white", KIND_TONE[s.kind])}><Icon className="h-4 w-4" /></span>
                <div className={cn("flex-1 rounded-xl border p-3", s.kind === "chemical" ? "border-amber-500/40 bg-amber-100/40" : "border-ink-100 bg-sand-50")}>
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-ink-900">{s.step}</span>
                    <span className={cn("rounded-full px-2 py-0.5 font-semibold", KIND_TONE[s.kind])}>{L.kinds[s.kind]}</span>
                  </div>
                  <div className="text-[13.5px] leading-relaxed">{s.text}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>
      <Section icon={AlertTriangle} title={L.safety} tone="bg-risk-high/10 text-risk-high" i={5}>
        <ul className="space-y-2 rounded-xl border border-risk-high/20 bg-red-50/60 p-3">
          {a.safety.map((x, i) => (
            <li key={i} className="flex gap-2.5"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-risk-high" />{x}</li>
          ))}
        </ul>
      </Section>
      <Section icon={Phone} title={L.expert} tone="bg-purple-50 text-purple-700" i={6}>{a.expert}</Section>
      <Section icon={ClipboardList} title={L.followUp} tone="bg-sky-100 text-sky-500" i={7}>{a.followUp}</Section>
      {!compact && <div className="text-center text-[11px] text-ink-400 pt-1">Advisory generated from ICAR / MPKV IPM packages · Reviewed by KVK Nashik · v2026.09</div>}
    </div>
  );
}
