"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SegmentedTabs<T extends string>({ value, onChange, options, className, size = "md" }: { value: T; onChange: (v: T) => void; options: { id: T; label: string; icon?: React.ReactNode }[]; className?: string; size?: "sm" | "md" }) {
  return (
    <div className={cn("inline-flex items-center rounded-2xl bg-ink-100 p-1 relative", className)}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} className={cn("relative z-10 flex items-center gap-1.5 rounded-xl font-semibold transition-colors", size === "sm" ? "px-3 h-8 text-xs" : "px-4 h-9 text-sm", active ? "text-forest-900" : "text-ink-500 hover:text-ink-800")}>
            {active && <motion.span layoutId={`seg-${options.map((x) => x.id).join("-")}`} className="absolute inset-0 -z-10 rounded-xl bg-white shadow-soft" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
