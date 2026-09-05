"use client";

import { motion } from "framer-motion";
import { Camera, ScanSearch, CloudSun, Gauge, Languages, UserCheck, MapPinned, LayoutDashboard, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const FLOW_STEPS = [
  { key: "input", label: "Input", desc: "Leaf photo, crop, location, trap counts", icon: Camera, tone: "from-earth-500 to-earth-700" },
  { key: "ai", label: "AI Detection", desc: "CNN + YOLO symptom identification", icon: ScanSearch, tone: "from-forest-500 to-forest-800" },
  { key: "weather", label: "Weather + Soil", desc: "Humidity, rain, stage, soil card", icon: CloudSun, tone: "from-sky-500 to-forest-600" },
  { key: "risk", label: "Risk Prediction", desc: "Rule engine → LOW / MEDIUM / HIGH", icon: Gauge, tone: "from-amber-500 to-risk-high" },
  { key: "advisory", label: "Advisory", desc: "IPM steps in EN · हिंदी · मराठी", icon: Languages, tone: "from-leaf-500 to-forest-700" },
  { key: "expert", label: "Expert Validation", desc: "Confirm, correct, refer, learn", icon: UserCheck, tone: "from-purple-500 to-forest-800" },
  { key: "gis", label: "GIS Hotspot", desc: "Cluster mapping across districts", icon: MapPinned, tone: "from-forest-600 to-sky-500" },
  { key: "gov", label: "Surveillance", desc: "Government planning dashboard", icon: LayoutDashboard, tone: "from-forest-900 to-forest-600" },
];

export function IntelligenceFlow({ active, compact, dark, className, onSelect }: { active?: string; compact?: boolean; dark?: boolean; className?: string; onSelect?: (key: string) => void }) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn("grid gap-3", compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-8")}>
        {FLOW_STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = active === s.key;
          return (
            <motion.button
              type="button"
              key={s.key}
              onClick={() => onSelect?.(s.key)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className={cn(
                "group relative flex flex-col items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-all duration-300",
                dark ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-ink-100 bg-white hover:shadow-lift hover:-translate-y-0.5",
                isActive && (dark ? "ring-2 ring-forest-300 bg-white/10" : "ring-2 ring-forest-500 shadow-glow-green"),
              )}
            >
              <span className={cn("relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft", s.tone)}>
                <Icon className="h-5 w-5" />
                {isActive && <span className="absolute inset-0 rounded-xl bg-white/30 animate-pulse-ring" />}
              </span>
              <span>
                <span className={cn("block text-[10px] font-bold uppercase tracking-[0.14em]", dark ? "text-white/50" : "text-ink-400")}>Step {i + 1}</span>
                <span className={cn("block font-display text-[13px] font-bold leading-tight", dark ? "text-white" : "text-ink-900")}>{s.label}</span>
                {!compact && <span className={cn("mt-1 block text-[11.5px] leading-snug", dark ? "text-white/60" : "text-ink-500")}>{s.desc}</span>}
              </span>
              {i < FLOW_STEPS.length - 1 && (
                <span className={cn("absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:flex h-6 w-6 items-center justify-center rounded-full", dark ? "bg-forest-800 text-forest-200" : "bg-forest-100 text-forest-700")}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      <motion.div
        aria-hidden
        className={cn("pointer-events-none absolute left-0 right-0 top-1/2 -z-10 hidden h-px lg:block", dark ? "bg-gradient-to-r from-transparent via-forest-300/40 to-transparent" : "bg-gradient-to-r from-transparent via-forest-300 to-transparent")}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />
    </div>
  );
}
