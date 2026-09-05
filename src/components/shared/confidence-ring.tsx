"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

export function ConfidenceRing({ value, size = 120, stroke = 10, className, label = "confidence" }: { value: number; size?: number; stroke?: number; className?: string; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = value >= 85 ? "#2f8f6b" : value >= 75 ? "#5aa64a" : value >= 60 ? "#e09a1c" : "#d13c3c";
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#eef1ef" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1.5, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold leading-none text-ink-900" style={{ fontSize: size * 0.24 }}>
          <CountUp value={value} suffix="%" duration={1.5} />
        </span>
        <span className="text-[10px] uppercase tracking-wider text-ink-500 mt-1">{label}</span>
      </div>
    </div>
  );
}
