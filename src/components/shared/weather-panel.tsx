"use client";

import { Droplets, Thermometer, Wind, CloudRain, Sprout } from "lucide-react";
import type { WeatherSnapshot, CropStage } from "@/lib/types";
import { WeatherIcon, RainDrops } from "./weather-icon";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { STAGE_NAMES } from "@/lib/i18n/ui";

export function WeatherStrip({ weather, stage, className, districtName }: { weather: WeatherSnapshot; stage?: CropStage; className?: string; districtName?: string }) {
  const { t, tx, lang } = useApp();
  const items = [
    { icon: Thermometer, label: t.temperature, value: `${weather.temp}°C`, tone: "text-amber-600 bg-amber-100" },
    { icon: Droplets, label: t.humidity, value: `${weather.humidity}%`, tone: "text-sky-500 bg-sky-100" },
    { icon: CloudRain, label: t.rainfall, value: `${weather.rain24h} mm`, tone: "text-sky-500 bg-sky-100" },
    { icon: Wind, label: t.wind, value: `${weather.wind} km/h`, tone: "text-ink-600 bg-ink-100" },
  ];
  return (
    <div className={cn("card-surface overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-sky-100/80 to-forest-100/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-soft">
            <WeatherIcon condition={weather.condition} className="h-6 w-6" />
            {(weather.condition === "Rain" || weather.condition === "Showers") && <RainDrops className="absolute -bottom-1 left-1/2 -translate-x-1/2 scale-75" />}
          </span>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{t.weatherNow}{districtName ? ` · ${districtName}` : ""}</div>
            <div className="font-display text-base font-bold text-ink-900">{tx(weather.condition)} · {weather.temp}°C</div>
          </div>
        </div>
        {stage && (
          <div className="text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{t.cropStage}</div>
            <div className="inline-flex items-center gap-1 font-semibold text-forest-800 text-sm"><Sprout className="h-4 w-4" /> {STAGE_NAMES[lang][stage]}</div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 divide-x divide-ink-100">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="flex flex-col items-center gap-1 px-2 py-3">
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", it.tone)}><Icon className="h-4 w-4" /></span>
              <span className="font-display text-[15px] font-bold text-ink-900">{it.value}</span>
              <span className="text-[10.5px] text-ink-500">{it.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ForecastRow({ weather, trend, className }: { weather: WeatherSnapshot; trend: { day: string; score: number; level: "LOW" | "MEDIUM" | "HIGH" }[]; className?: string }) {
  const { t, tx } = useApp();
  const colors = { LOW: "bg-risk-low", MEDIUM: "bg-risk-medium", HIGH: "bg-risk-high" };
  return (
    <div className={cn("flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1", className)}>
      {weather.forecast.map((d, i) => (
        <div key={d.day} className={cn("flex min-w-[68px] flex-1 flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center", i === 0 ? "border-forest-300 bg-forest-50" : "border-ink-100 bg-white")}>
          <span className="text-[11px] font-semibold text-ink-500">{tx(d.day)}</span>
          <WeatherIcon condition={d.condition} className="h-5 w-5" animated={false} />
          <span className="text-sm font-bold text-ink-900">{d.temp}°</span>
          <span className="text-[10px] text-sky-500">{d.humidity}%</span>
          <span className={cn("h-1.5 w-full rounded-full", colors[trend[i]?.level ?? "LOW"])} title={`${t.risk} ${trend[i]?.score}`} />
        </div>
      ))}
    </div>
  );
}
