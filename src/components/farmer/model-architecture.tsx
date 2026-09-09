"use client";

import { ArrowRight, Cpu, Eye, Info, ShieldQuestion, SlidersHorizontal, Upload, UserCheck } from "lucide-react";
import { MODEL_ARCHITECTURE, type StageKind } from "@/lib/ai-mock";
import { useApp } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

/**
 * Judge-facing technical panel. Collapsed by default so the farmer flow stays simple.
 *
 * Shows the pipeline as an explicit hierarchy, stage by stage, and marks which stages are
 * a vision model, which are deterministic rules and which are a human. Nothing here claims
 * the model is trained or accuracy-validated: the backbone is proposed and the results the
 * prototype shows today are simulated.
 */

const KIND_ICON: Record<StageKind, typeof Eye> = {
  input: Upload,
  vision: Eye,
  rules: SlidersHorizontal,
  human: UserCheck,
};

const KIND_TONE: Record<StageKind, { chip: string; badge: string; rail: string }> = {
  input: { chip: "bg-earth-100 text-earth-700", badge: "text-earth-700", rail: "bg-earth-300" },
  vision: { chip: "bg-forest-100 text-forest-800", badge: "text-forest-700", rail: "bg-forest-300" },
  rules: { chip: "bg-sky-100 text-sky-500", badge: "text-sky-500", rail: "bg-sky-500/40" },
  human: { chip: "bg-amber-500/15 text-amber-700", badge: "text-amber-600", rail: "bg-amber-500/40" },
};

export function ModelArchitecture() {
  const { t, tx } = useApp();
  const { backbone, stages } = MODEL_ARCHITECTURE;

  const kindLabel: Record<StageKind, string> = {
    input: t.kindInput,
    vision: t.kindVision,
    rules: t.kindRules,
    human: t.kindHuman,
  };

  return (
    <details className="card-surface group p-4">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-forest-800">
        <Cpu className="h-4 w-4" /> {t.modelDetails}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
      </summary>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-100/60 p-3 text-[12.5px] text-amber-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{t.architectureNotice}</span>
      </div>

      <div className="mt-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">{t.proposedProductionArchitecture}</div>
        <div className="mt-1.5 rounded-2xl border border-forest-200 bg-forest-50 p-3">
          <div className="font-display font-bold text-ink-900">{backbone.name}</div>
          <div className="mt-0.5 text-[12.5px] text-ink-600">{tx(backbone.detail)}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">{t.pipelineTitle}</div>

        {/* Legend: which stages are a model, which are rules, which are a person. */}
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {(["input", "vision", "rules", "human"] as StageKind[]).map((k) => {
            const Icon = KIND_ICON[k];
            return (
              <span key={k} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", KIND_TONE[k].chip)}>
                <Icon className="h-3 w-3" /> {kindLabel[k]}
              </span>
            );
          })}
        </div>

        <ol className="mt-2.5">
          {stages.map((s, i) => {
            const Icon = KIND_ICON[s.kind];
            const tone = KIND_TONE[s.kind];
            const last = i === stages.length - 1;
            return (
              <li key={s.key} className="relative flex gap-3 pb-2.5 last:pb-0">
                {/* Vertical rail carries the arrow down to the next stage. */}
                {!last && <span aria-hidden className={cn("absolute left-[15px] top-9 bottom-0 w-px", tone.rail)} />}
                <span className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-soft", tone.badge)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border border-ink-100 bg-white p-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-mono text-[10.5px] font-bold text-ink-400">{t.stageWord} {s.no}</span>
                    <span className="text-[13px] font-semibold text-ink-900">{tx(s.name)}</span>
                    <span className={cn("rounded-full px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wide", tone.chip)}>{kindLabel[s.kind]}</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-snug text-ink-600">{tx(s.detail)}</p>
                  <dl className="mt-1.5 grid gap-0.5 text-[11.5px]">
                    <div className="flex gap-1.5">
                      <dt className="shrink-0 font-semibold text-ink-400">{t.stageInput}</dt>
                      <dd className="text-ink-600">{tx(s.input)}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="shrink-0 font-semibold text-ink-400">{t.stageOutput}</dt>
                      <dd className="text-ink-600">{tx(s.output)}</dd>
                    </div>
                  </dl>
                  {s.gate && (
                    <div className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-amber-100/60 px-2 py-1 text-[11.5px] leading-snug text-amber-700">
                      <ShieldQuestion className="mt-0.5 h-3 w-3 shrink-0" />
                      <span><span className="font-bold uppercase tracking-wide">{t.stageGate}</span> {tx(s.gate)}</span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">{t.inferencePathsTitle}</div>
        <ul className="mt-1.5 space-y-1.5">
          {[
            { key: "demo", title: t.pathDemoTitle, body: t.pathDemoBody },
            { key: "live", title: t.pathLiveTitle, body: t.pathLiveBody },
            { key: "roadmap", title: t.pathRoadmapTitle, body: t.pathRoadmapBody },
          ].map((p) => (
            <li key={p.key} className="rounded-xl border border-ink-100 bg-white p-3">
              <div className="text-[13px] font-semibold text-ink-900">{p.title}</div>
              <div className="text-[12px] text-ink-600">{p.body}</div>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
