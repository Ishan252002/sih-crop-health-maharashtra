"use client";

import { motion } from "framer-motion";
import { AlertTriangle, FlaskConical, Info, PauseCircle } from "lucide-react";
import type { CropStage, DiagnosisResult, SoilCard } from "@/lib/types";
import { fertilizerPlan, type FertilizerKind, type FertilizerReading } from "@/lib/fertilizer";
import { DOSE_UNITS, FERTILIZER_BASIS, FERTILIZER_CAUTIONS, FERTILIZER_INPUTS, FERTILIZER_KIND_NAMES, FERTILIZER_LABELS } from "@/lib/i18n/fertilizer";
import { useApp } from "@/lib/store/app-store";
import { CROP_NAMES, SEVERITY_NAMES, STAGE_NAMES, THREAT_NAMES } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

/**
 * Prototype fertilizer advisory, shown directly under the recommended action on a
 * Crop Health result. Every rule comes from lib/fertilizer.ts, which reads the same
 * Soil Health Card bands as the nutrient card, so the two can never disagree.
 *
 * The prototype framing is not decoration: the doses are indicative ranges, and the card
 * says so at the top and again in the safety list.
 */

const KIND_TONE: Record<FertilizerKind, string> = {
  hold: "bg-amber-500/15 text-amber-700",
  foliar: "bg-forest-100 text-forest-800",
  micronutrient: "bg-sky-100 text-sky-500",
  soil: "bg-earth-100 text-earth-700",
  organic: "bg-forest-50 text-forest-800",
  amendment: "bg-ink-100 text-ink-700",
};

function readingText(r: FertilizerReading, labels: (typeof FERTILIZER_LABELS)["en"]) {
  const unit = labels.readingUnits[r.key];
  const level = labels.levels[r.level];
  return `${labels.readingNames[r.key]} ${r.value}${unit ? ` ${unit}` : ""} · ${level}`;
}

export function FertilizerRecommendation({ soil, cropId, stage, ai }: { soil: SoilCard; cropId: string; stage: CropStage; ai: DiagnosisResult }) {
  const { lang } = useApp();
  const labels = FERTILIZER_LABELS[lang];
  const plan = fertilizerPlan({ soil, cropId, stage, threatId: ai.threatId, severity: ai.severity, health: ai.health ?? "Diseased" });

  const context = [CROP_NAMES[lang][cropId], STAGE_NAMES[lang][stage], THREAT_NAMES[lang][ai.threatId], SEVERITY_NAMES[lang][ai.severity]].filter(Boolean);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="card-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-ink-900">
            <FlaskConical className="h-4 w-4 text-forest-700" /> {labels.title}
          </div>
          <p className="mt-0.5 text-[11.5px] text-ink-500">{labels.subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-1 text-[9.5px] font-bold uppercase tracking-wide text-amber-700">{labels.prototypeBadge}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">{labels.basedOn}</span>
        {context.map((c) => (
          <span key={c} className="rounded-full bg-sand-100 px-2 py-0.5 text-[11px] font-semibold text-ink-700">{c}</span>
        ))}
      </div>

      <ul className="mt-3 space-y-2">
        {plan.items.map((item) => {
          const text = FERTILIZER_INPUTS[lang][item.id];
          const unit = DOSE_UNITS[lang][item.dose.unit];
          const dose = item.dose.value ? `${item.dose.value}${unit ? ` ${unit}` : ""}` : labels.noDose;
          return (
            <li key={item.id} className={cn("rounded-2xl border p-3", item.kind === "hold" ? "border-amber-500/40 bg-amber-100/40" : "border-ink-100 bg-white")}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {item.kind === "hold" && <PauseCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />}
                  <div>
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">{labels.input}</div>
                    <div className="text-[13.5px] font-semibold leading-tight text-ink-900">{text.name}</div>
                  </div>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", KIND_TONE[item.kind])}>{FERTILIZER_KIND_NAMES[lang][item.kind]}</span>
              </div>

              <div className="mt-2 grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-3">
                <div className="rounded-xl bg-sand-100 px-2.5 py-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{labels.dose}</div>
                  <div className="font-display text-[15px] font-bold leading-tight text-ink-900">{dose}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{labels.timing}</div>
                  <p className="text-[12.5px] leading-snug text-ink-700">{text.timing}</p>
                </div>
              </div>

              {item.basis.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{labels.why}</span>
                  {item.basis.map((b) => (
                    <span key={b} className="rounded-full bg-ink-100 px-2 py-0.5 text-[10.5px] font-medium text-ink-600">{FERTILIZER_BASIS[lang][b]}</span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-3 rounded-2xl bg-sand-100 p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{labels.soilReadings}</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {plan.readings.map((r) => (
            <span key={r.key} className="rounded-lg bg-white px-2 py-1 text-[11px] font-medium text-ink-700 shadow-soft">{readingText(r, labels)}</span>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
          <AlertTriangle className="h-3 w-3 text-amber-600" /> {labels.safety}
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {plan.cautions.map((c) => (
            <li key={c} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-700">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {FERTILIZER_CAUTIONS[lang][c]}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-100/60 p-3 text-[12px] leading-snug text-amber-700">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{labels.prototypeNote}</span>
      </div>
    </motion.div>
  );
}
