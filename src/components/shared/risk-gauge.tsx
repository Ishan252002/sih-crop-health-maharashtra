"use client";

import { motion, useSpring, useTransform, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLORS: Record<RiskLevel, string> = { LOW: "#2f8f6b", MEDIUM: "#e09a1c", HIGH: "#d13c3c" };

export function RiskGauge({ score, level, size = 220, label, sublabel, className, levelLabel }: { score: number; level: RiskLevel; size?: number; label?: string; sublabel?: string; className?: string; levelLabel?: string }) {
  const r = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const startAngle = -210;
  const endAngle = 30;
  const sweep = endAngle - startAngle;

  // Trig results can differ in the last ULP between the SSR and browser engines,
  // which makes React hydration reject the generated `d`/coordinate attributes.
  // Rounding every computed coordinate to a fixed precision keeps the markup
  // byte-identical on both sides without any visible change.
  const round = (n: number) => Math.round(n * 1000) / 1000;
  const polar = (deg: number, radius = r) => {
    const rad = (deg * Math.PI) / 180;
    return { x: round(cx + radius * Math.cos(rad)), y: round(cy + radius * Math.sin(rad)) };
  };
  const arc = (a0: number, a1: number, radius = r) => {
    const p0 = polar(a0, radius);
    const p1 = polar(a1, radius);
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 1 ${p1.x} ${p1.y}`;
  };

  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 60, damping: 18 });
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const controls = animate(progress, score, { duration: 1.6, ease: [0.2, 0.7, 0.2, 1] });
    return controls.stop;
  }, [score, progress]);
  useEffect(() => spring.on("change", (v) => setShown(Math.round(v))), [spring]);

  const needleAngle = useTransform(spring, (v) => startAngle + (sweep * v) / 100);
  const tip = useTransform(needleAngle, (a) => polar(a, r - 22));
  const tipX = useTransform(tip, (p) => p.x);
  const tipY = useTransform(tip, (p) => p.y);

  const height = round(size * 0.78);
  const color = COLORS[level];
  const segs: { from: number; to: number; c: string }[] = [
    { from: 0, to: 36, c: COLORS.LOW },
    { from: 36, to: 66, c: COLORS.MEDIUM },
    { from: 66, to: 100, c: COLORS.HIGH },
  ];

  return (
    <div className={cn("relative flex flex-col items-center", className)} style={{ width: size }}>
      <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`} className="overflow-visible">
        <defs>
          <filter id="gauge-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={arc(startAngle, endAngle)} stroke="#eef1ef" strokeWidth={14} fill="none" strokeLinecap="round" />
        {segs.map((s, i) => (
          <motion.path
            key={i}
            d={arc(startAngle + (sweep * s.from) / 100 + (i ? 1.5 : 0), startAngle + (sweep * s.to) / 100 - (i < 2 ? 1.5 : 0))}
            stroke={s.c}
            strokeOpacity={0.28}
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: i * 0.12 }}
          />
        ))}
        <motion.path
          d={arc(startAngle, endAngle)}
          stroke={color}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          filter="url(#gauge-glow)"
          style={{ pathLength: useTransform(spring, (v) => v / 100) }}
        />
        {[0, 25, 50, 75, 100].map((t) => {
          const a = startAngle + (sweep * t) / 100;
          const p0 = polar(a, r - 14);
          const p1 = polar(a, r - 9);
          return <line key={t} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#b3bcb7" strokeWidth={1.5} />;
        })}
        <motion.line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke="#14201a" strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={7} fill="#14201a" />
        <circle cx={cx} cy={cy} r={3} fill="#fff" />
      </svg>
      <div className="h-7" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <div className="font-display text-4xl font-bold leading-none" style={{ color }}>
          {shown}
        </div>
        <div className="mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white" style={{ background: color }}>
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          {levelLabel ?? level} {label}
        </div>
        {sublabel && <div className="mt-1.5 text-xs text-ink-500">{sublabel}</div>}
      </div>
    </div>
  );
}
