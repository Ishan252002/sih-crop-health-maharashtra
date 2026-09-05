"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({ value, className, color = "bg-forest-600", track = "bg-ink-100", height = "h-2" }: { value: number; className?: string; color?: string; track?: string; height?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-full", track, height, className)}>
      <motion.div className={cn("h-full rounded-full", color)} initial={{ width: 0 }} whileInView={{ width: `${Math.max(0, Math.min(100, value))}%` }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }} />
    </div>
  );
}
