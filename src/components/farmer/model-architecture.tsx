"use client";

import { ArrowRight, Cpu, GitBranch, Info, SlidersHorizontal } from "lucide-react";
import { MODEL_ARCHITECTURE } from "@/lib/ai-mock";
import { useApp } from "@/lib/store/app-store";

/**
 * Judge-facing technical panel. Collapsed by default so the farmer flow stays simple.
 * States plainly that inference is simulated and that MobileNetV3 is the proposed backbone.
 */
export function ModelArchitecture() {
  const { t, tx } = useApp();
  const { backbone, heads, ruleEngine } = MODEL_ARCHITECTURE;

  return (
    <details className="card-surface group p-4">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-forest-800">
        <Cpu className="h-4 w-4" /> {t.modelDetails}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
      </summary>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-100/60 p-3 text-[12.5px] text-amber-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{t.simulationNotice}</span>
      </div>

      <div className="mt-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">{t.proposedBackbone}</div>
        <div className="mt-1.5 rounded-2xl border border-forest-200 bg-forest-50 p-3">
          <div className="font-display font-bold text-ink-900">{backbone.name}</div>
          <div className="mt-0.5 text-[12.5px] text-ink-600">{tx(backbone.detail)}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
          <GitBranch className="h-3 w-3" /> {t.classificationHeads}
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {heads.map((h, i) => (
            <li key={h.key} className="flex gap-2.5 rounded-xl bg-sand-100 p-3">
              <span className="font-mono text-[11px] font-bold text-forest-700">{i + 1}</span>
              <div>
                <div className="text-[13px] font-semibold text-ink-900">{h.name}</div>
                <div className="text-[12px] text-ink-600">{tx(h.detail)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
          <SlidersHorizontal className="h-3 w-3" /> {t.ruleEngineTitle}
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {ruleEngine.map((r) => (
            <li key={r.key} className="rounded-xl border border-ink-100 bg-white p-3">
              <div className="text-[13px] font-semibold text-ink-900">{r.name}</div>
              <div className="text-[12px] text-ink-600">{tx(r.detail)}</div>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
