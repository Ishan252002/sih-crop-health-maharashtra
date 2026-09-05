import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { CaseStatus, RiskLevel, Severity } from "@/lib/types";

type Tone = "neutral" | "green" | "amber" | "red" | "blue" | "earth" | "purple" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  green: "bg-forest-100 text-forest-800",
  amber: "bg-amber-100 text-amber-600",
  red: "bg-red-50 text-risk-high",
  blue: "bg-sky-100 text-sky-500",
  earth: "bg-earth-100 text-earth-800",
  purple: "bg-purple-50 text-purple-700",
  dark: "bg-forest-900 text-white",
};

export function Badge({ className, tone = "neutral", dot, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide", tones[tone], className)} {...props}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {props.children}
    </span>
  );
}

export const riskTone = (r: RiskLevel): Tone => (r === "HIGH" ? "red" : r === "MEDIUM" ? "amber" : "green");
export const severityTone = (s: Severity): Tone => (s === "Severe" ? "red" : s === "Moderate" ? "amber" : "green");
export const statusTone = (s: CaseStatus): Tone =>
  s === "Confirmed" ? "green" : s === "Corrected" ? "purple" : s === "Referred" ? "blue" : s === "Under Review" ? "amber" : s === "More Info Requested" ? "earth" : "neutral";

export function RiskBadge({ level, className, label }: { level: RiskLevel; className?: string; label?: string }) {
  return (
    <Badge tone={riskTone(level)} dot className={cn("uppercase", className)}>
      {label ?? level}
    </Badge>
  );
}

export function StatusBadge({ status, label }: { status: CaseStatus; label?: string }) {
  return (
    <Badge tone={statusTone(status)} dot>
      {label ?? status}
    </Badge>
  );
}
