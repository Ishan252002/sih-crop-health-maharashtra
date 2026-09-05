"use client";

import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "./count-up";

export function StatCard({ label, value, suffix, prefix, decimals, delta, deltaLabel, icon, tone = "neutral", className, invertDelta }: { label: string; value: number; suffix?: string; prefix?: string; decimals?: number; delta?: number; deltaLabel?: string; icon?: ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "blue"; className?: string; invertDelta?: boolean }) {
  const toneCls = { neutral: "bg-ink-100 text-ink-700", green: "bg-forest-100 text-forest-700", amber: "bg-amber-100 text-amber-600", red: "bg-red-50 text-risk-high", blue: "bg-sky-100 text-sky-500" }[tone];
  const good = delta !== undefined && (invertDelta ? delta < 0 : delta > 0);
  return (
    <div className={cn("card-surface p-4 sm:p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-500">{label}</span>
        {icon && <span className={cn("h-9 w-9 rounded-xl flex items-center justify-center", toneCls)}>{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="font-display text-[28px] sm:text-[30px] font-bold leading-none tracking-tight text-ink-900">
          <CountUp value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
        </div>
        {delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5", good ? "bg-forest-100 text-forest-700" : "bg-red-50 text-risk-high")}>
            {delta > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta)}%{deltaLabel ? ` ${deltaLabel}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
