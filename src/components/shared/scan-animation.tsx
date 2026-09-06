"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { SCAN_STEPS } from "@/lib/ai-mock";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";

export function ScanAnimation({ image, onDone, title, stepMs = 900 }: { image: string; onDone: () => void; title?: string; stepMs?: number }) {
  const { t, tx } = useApp();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= SCAN_STEPS.length) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), stepMs);
    return () => clearTimeout(t);
  }, [step, onDone, stepMs]);

  const boxes = [
    { x: 22, y: 68, w: 14, h: 12, d: 0.4 },
    { x: 40, y: 58, w: 16, h: 14, d: 0.9 },
    { x: 62, y: 42, w: 13, h: 12, d: 1.4 },
    { x: 76, y: 22, w: 12, h: 11, d: 1.9 },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-ink-900 shadow-lift">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={t.uploadedPhoto} className="h-full w-full object-cover" />
        <div className="absolute inset-0 grid-fade opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
        {/* scan line */}
        <div className="absolute left-0 right-0 h-16 animate-scan bg-gradient-to-b from-transparent via-forest-300/40 to-forest-300/80" style={{ boxShadow: "0 0 30px rgba(134,200,173,0.6)" }} />
        {/* corner brackets */}
        {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((c) => (
          <span key={c} className={cn("absolute h-6 w-6 rounded-sm border-forest-200", c)} />
        ))}
        {/* detection boxes */}
        {step >= 1 &&
          boxes.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: b.d * 0.5, type: "spring", stiffness: 260, damping: 18 }}
              className="absolute rounded-md border-2 border-amber-500"
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, boxShadow: "0 0 0 2px rgba(224,154,28,0.25)" }}
            >
              <span className="absolute -top-5 left-0 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">{t.lesion} {(0.82 + i * 0.04).toFixed(2)}</span>
            </motion.div>
          ))}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-white/85">
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-forest-300 animate-pulse" />CropNet-v2.3 · {t.onDevice}</span>
          <span>{Math.min(100, Math.round((step / SCAN_STEPS.length) * 100))}%</span>
        </div>
      </div>

      <div className="card-surface p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
          </span>
          <div>
            <div className="font-display text-base font-bold text-ink-900">{title ?? t.analyzing}</div>
            <div className="text-xs text-ink-500">{t.analysisNote}</div>
          </div>
        </div>
        <ol className="space-y-2.5">
          {SCAN_STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "active" : "todo";
            return (
              <li key={s.key} className="flex items-start gap-3">
                <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors", state === "done" && "border-forest-600 bg-forest-600 text-white", state === "active" && "border-forest-500 text-forest-700", state === "todo" && "border-ink-200 text-ink-300")}>
                  <AnimatePresence mode="wait">
                    {state === "done" ? (
                      <motion.span key="d" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="h-3 w-3" /></motion.span>
                    ) : state === "active" ? (
                      <motion.span key="a" className="h-2 w-2 rounded-full bg-forest-500" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.9 }} />
                    ) : (
                      <span key="t">{i + 1}</span>
                    )}
                  </AnimatePresence>
                </span>
                <div className="min-w-0">
                  <div className={cn("text-sm font-semibold", state === "todo" ? "text-ink-400" : "text-ink-900")}>{tx(s.label)}</div>
                  {state === "active" && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-ink-500">{tx(s.detail)}</motion.div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
