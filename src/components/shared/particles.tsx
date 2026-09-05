"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function Particles({ count = 14, className, color = "rgba(47,143,107,0.35)" }: { count?: number; className?: string; color?: string }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37 + 11) % 100,
        size: 4 + ((i * 7) % 9),
        delay: (i * 1.7) % 14,
        duration: 16 + ((i * 3) % 12),
      })),
    [count],
  );
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-20px] rounded-full animate-drift"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, background: color, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, borderRadius: i % 3 === 0 ? "60% 40% 55% 45%" : "50%" }}
        />
      ))}
    </div>
  );
}
