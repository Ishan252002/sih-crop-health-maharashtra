"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("relative", className)}>
      <select {...props} className="h-10 w-full appearance-none rounded-xl border border-ink-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-800 shadow-soft focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-400 shadow-soft focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200", className)} />;
}
