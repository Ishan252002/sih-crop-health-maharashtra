"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Brain, CheckCircle2, ListChecks, Save, UserCheck } from "lucide-react";
import type { DiagnosisResult, RiskLevel } from "@/lib/types";
import { threatById } from "@/lib/mock/geo";
import { useApp } from "@/lib/store/app-store";
import { SEVERITY_NAMES, THREAT_NAMES, CROP_NAMES } from "@/lib/i18n/ui";
import { ConfidenceRing } from "@/components/shared/confidence-ring";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { needsExpert } from "@/lib/ai-mock";
import { cn } from "@/lib/utils";
import { RiskGauge } from "@/components/shared/risk-gauge";

export function DiagnosisResultCard({ image, cropId, ai, risk, riskScore, riskExplanation, onSave, onAdvisory, saved, compact }: { image: string; cropId: string; ai: DiagnosisResult; risk: RiskLevel; riskScore: number; riskExplanation: string; onSave?: () => void; onAdvisory?: () => void; saved?: boolean; compact?: boolean }) {
  const { t, tx, lang } = useApp();
  const threat = threatById(ai.threatId);
  const expert = needsExpert(ai.confidence);
  const sevPct = ai.severity === "Severe" ? 88 : ai.severity === "Moderate" ? 55 : 22;
  const riskLabel = { LOW: t.low, MEDIUM: t.medium, HIGH: t.high }[risk];

  return (
    <div className="space-y-3">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="card-surface overflow-hidden">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={t.detected} className="aspect-[16/10] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent" />
          {[{ x: 24, y: 70, w: 13, h: 12 }, { x: 43, y: 60, w: 15, h: 13 }, { x: 64, y: 44, w: 12, h: 11 }].map((b, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.15 }} className="absolute rounded-md border-2 border-amber-500" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }} />
          ))}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{t.detected} · {CROP_NAMES[lang][cropId]}</div>
              <div className="font-display text-2xl font-bold leading-tight">{THREAT_NAMES[lang][ai.threatId]}</div>
              <div className="text-xs italic text-white/75">{threat.scientific}</div>
            </div>
            <Badge tone={severityTone(ai.severity)} className="mb-1">{SEVERITY_NAMES[lang][ai.severity]}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4">
          <ConfidenceRing value={ai.confidence} size={96} stroke={9} label={t.confidence} />
          <div className="flex-1 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs"><span className="font-medium text-ink-600">{t.severity}</span><span className="font-semibold text-ink-900">{SEVERITY_NAMES[lang][ai.severity]}</span></div>
              <ProgressBar value={sevPct} color={ai.severity === "Severe" ? "bg-risk-high" : ai.severity === "Moderate" ? "bg-amber-500" : "bg-forest-500"} className="mt-1" />
            </div>
            <div>
              <div className="flex justify-between text-xs"><span className="font-medium text-ink-600">{t.affectedArea}</span><span className="font-semibold text-ink-900">{ai.affectedArea}%</span></div>
              <ProgressBar value={ai.affectedArea} color="bg-earth-500" className="mt-1" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-semibold text-ink-500">{ai.inferenceKind === "vision" ? t.liveVisionInference : t.demoInference}</span>
                {ai.inferenceKind === "vision" && (
                  <span className="rounded-full bg-amber-500/15 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wide text-amber-700">{t.experimentalBadge}</span>
                )}
              </div>
              <div className="text-[10.5px] text-ink-400">{ai.modelVersion} · {ai.inferenceMs} ms</div>
            </div>
          </div>
        </div>
      </motion.div>

      {expert ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-amber-500/40 bg-amber-100/60 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-soft"><UserCheck className="h-5 w-5" /></span>
            <div>
              <div className="font-display font-bold text-ink-900">{t.expertReview}</div>
              <div className="mt-0.5 text-xs font-semibold text-amber-600">{t.aiConfidenceExpert.replace("{n}", String(ai.confidence))}</div>
              <p className="mt-1.5 text-[13px] text-ink-700">{t.expertReviewBody}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 rounded-2xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800"><CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> {t.highConfidenceNote}</motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-surface p-4">
        <div className="flex items-center gap-2 font-display font-bold text-ink-900"><ListChecks className="h-4 w-4 text-forest-700" /> {t.whySymptoms}</div>
        <ul className="mt-2 grid gap-1.5">
          {ai.symptoms.map((s) => (
            <li key={s} className="flex items-start gap-2 text-[13.5px] text-ink-700"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />{tx(s)}</li>
          ))}
        </ul>
        {!compact && (
          <details className="mt-3 group">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-forest-800"><Brain className="h-4 w-4" /> {t.aiReasoning} <ArrowRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" /></summary>
            <ol className="mt-2 space-y-1.5 text-[13px] text-ink-600">
              {ai.reasoning.map((r, i) => (
                <li key={i} className="flex gap-2"><span className="font-mono text-ink-400">{i + 1}.</span>{tx(r)}</li>
              ))}
            </ol>
            {ai.alternatives.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-ink-500">{t.alternatives}:</span>
                {ai.alternatives.map((a) => (
                  <span key={a.threatId} className="rounded-full bg-ink-100 px-2 py-0.5 font-semibold text-ink-700">{THREAT_NAMES[lang][a.threatId]} {a.confidence}%</span>
                ))}
              </div>
            )}
          </details>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-surface p-4">
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-ink-900">{t.outbreakRisk}</div>
          <span className="text-[11px] text-ink-500">{t.weatherSoilStage}</span>
        </div>
        <div className="mt-1 flex flex-col items-center">
          <RiskGauge score={riskScore} level={risk} size={200} levelLabel={riskLabel} />
        </div>
        <p className={cn("mt-3 rounded-xl p-3 text-[13px] leading-relaxed", risk === "HIGH" ? "bg-red-50 text-risk-high" : risk === "MEDIUM" ? "bg-amber-100/60 text-amber-600" : "bg-forest-50 text-forest-800")}><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />{riskExplanation}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-surface p-4">
        <div className="font-display font-bold text-ink-900">{t.recommendedAction}</div>
        <ol className="mt-2 space-y-2 text-[13.5px] text-ink-700">
          <li className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-800 text-[11px] font-bold text-white">1</span>{t.action1}</li>
          <li className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-800 text-[11px] font-bold text-white">2</span>{t.action2}</li>
          <li className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-800 text-[11px] font-bold text-white">3</span>{expert ? t.action3Expert : t.action3Normal}</li>
        </ol>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button onClick={onAdvisory}>{t.viewAdvisory} <ArrowRight className="h-4 w-4" /></Button>
          <Button variant={saved ? "secondary" : "outline"} onClick={onSave} disabled={saved}><Save className="h-4 w-4" /> {saved ? t.reportSaved : t.saveReport}</Button>
        </div>
      </motion.div>
    </div>
  );
}
