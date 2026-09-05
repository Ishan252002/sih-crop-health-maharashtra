"use client";

import { Cloud, CloudDrizzle, CloudLightning, CloudRain, Sun, CloudSun } from "lucide-react";
import type { WeatherDay } from "@/lib/types";
import { cn } from "@/lib/utils";

export function WeatherIcon({ condition, className, animated = true }: { condition: WeatherDay["condition"]; className?: string; animated?: boolean }) {
  const base = cn("h-6 w-6", className);
  switch (condition) {
    case "Sunny":
      return <Sun className={cn(base, "text-amber-500", animated && "animate-spin-slow")} />;
    case "Cloudy":
      return <CloudSun className={cn(base, "text-ink-500", animated && "animate-float")} />;
    case "Overcast":
      return <Cloud className={cn(base, "text-ink-500", animated && "animate-float")} />;
    case "Showers":
      return <CloudDrizzle className={cn(base, "text-sky-500")} />;
    case "Rain":
      return <CloudRain className={cn(base, "text-sky-500")} />;
    case "Storm":
      return <CloudLightning className={cn(base, "text-amber-600")} />;
  }
}

export function RainDrops({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block h-5 w-5", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="absolute top-0 h-2 w-0.5 rounded-full bg-sky-500 animate-rain" style={{ left: 4 + i * 5, animationDelay: `${i * 0.25}s` }} />
      ))}
    </span>
  );
}
