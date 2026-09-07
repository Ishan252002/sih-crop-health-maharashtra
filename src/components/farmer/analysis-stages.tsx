"use client";

import { motion } from "framer-motion";
import { Bug, Leaf, ShieldAlert, Sprout } from "lucide-react";
import type { CropIdentification, CropStage, DiagnosisResult } from "@/lib/types";
import { useApp } from "@/lib/store/app-store";
import { CROP_NAMES, SEVERITY_NAMES, STAGE_NAMES, THREAT_NAMES } from "@/lib/i18n/ui";
import { Badge, severityTone } from "@/components/ui/badge";
import { cropById } from "@/lib/mock/geo";
import { cn } from "@/lib/utils";

/**
 * Shows what each stage of the vision pipeline produced, in farmer language.
 * Risk and advisory are not listed here: they come from the rule engine and have
 * their own cards further down the result screen.
 */
export function AnalysisStages({ ai, crop, stage, onStageChange }: { ai: DiagnosisResult; crop: CropIdentification; stage: CropStage; onStageChange: (s: CropStage) => void }) {
  const { t, lang } = useApp();
  const cropId = crop.cropId ?? "tomato";
  const cropMeta = cropById(cropId);
  const health = ai.health ?? "Diseased";
  const healthLabel = health === "Healthy" ? t.healthHealthy : health === "Pest" ? t.healthPest : t.healthDiseased;

  const rows = [
    { key: "crop", icon: Sprout, label: t.cropIdentified, value: CROP_NAMES[lang][cropId], confidence: crop.confidence, tone: "forest" as const },
    { key: "health", icon: health === "Pest" ? Bug : Leaf, label: t.healthStatus, value: healthLabel, tone: health === "Healthy" ? ("forest" as const) : ("amber" as const) },
    { key: "threat", icon: ShieldAlert, label: t.diseaseIdentified, value: THREAT_NAMES[lang][ai.threatId], confidence: ai.confidence, tone: "amber" as const },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-4">
      <div className="flex items-center justify-between">
        <div className="font-display font-bold text-ink-900">{t.analysisStages}</div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", crop.source === "auto" ? "bg-forest-100 text-forest-800" : "bg-ink-100 text-ink-600")}>
          {crop.source === "auto" ? t.autoDetected : t.selectedByYou}
        </span>
      </div>

      <ol className="mt-3 space-y-2">
        {rows.map((r, i) => {
          const Icon = r.icon;
          return (
            <li key={r.key} className="flex items-center gap-3 rounded-2xl bg-sand-100 px-3 py-2.5">
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-soft", r.tone === "forest" ? "text-forest-700" : "text-amber-600")}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">{i + 1} · {r.label}</div>
                <div className="truncate text-[14px] font-semibold text-ink-900">{r.value}</div>
              </div>
              {typeof r.confidence === "number" && (
                <span className="shrink-0 font-mono text-[13px] font-bold text-ink-700">{r.confidence}%</span>
              )}
            </li>
          );
        })}
        <li className="flex items-center gap-3 rounded-2xl bg-sand-100 px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-soft"><ShieldAlert className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">4 · {t.severity}</div>
            <div className="truncate text-[14px] font-semibold text-ink-900">{SEVERITY_NAMES[lang][ai.severity]} · {ai.affectedArea}%</div>
          </div>
          <Badge tone={severityTone(ai.severity)}>{SEVERITY_NAMES[lang][ai.severity]}</Badge>
        </li>
      </ol>

      <div className="mt-3">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">{t.cropStage}</div>
        <div className="mt-1.5 flex gap-1.5 overflow-x-auto hide-scrollbar">
          {cropMeta.stages.map((s) => (
            <button key={s} onClick={() => onStageChange(s)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors", stage === s ? "border-forest-800 bg-forest-800 text-white" : "border-ink-200 bg-white text-ink-700")}>
              {STAGE_NAMES[lang][s]}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
