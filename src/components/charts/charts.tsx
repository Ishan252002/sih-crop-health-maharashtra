"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, Legend } from "recharts";
import type { RiskLevel } from "@/lib/types";

export const PALETTE = ["#16624a", "#4faa87", "#b8926c", "#3d8bd6", "#e09a1c", "#7e22ce", "#d13c3c", "#0f766e", "#6b7280"];
const RISK_COLORS: Record<RiskLevel, string> = { LOW: "#2f8f6b", MEDIUM: "#e09a1c", HIGH: "#d13c3c" };

function TooltipBox({ active, payload, label, suffix = "" }: { active?: boolean; payload?: { name: string; value: number; color?: string; payload?: Record<string, unknown> }[]; label?: string; suffix?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-ink-100 bg-white/95 backdrop-blur px-3 py-2 text-xs shadow-lift">
      {label && <div className="mb-1 font-semibold text-ink-900">{label}</div>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-ink-600">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? "#16624a" }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-semibold text-ink-900">{typeof p.value === "number" ? new Intl.NumberFormat("en-IN").format(p.value) : p.value}{suffix}</span>
        </div>
      ))}
    </div>
  );
}

export function CasesOverTime({ data, height = 260, keys = [{ key: "cases", label: "Cases", color: "#16624a" }] }: { data: Record<string, unknown>[]; height?: number; keys?: { key: string; label: string; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -18, right: 8, top: 10, bottom: 0 }}>
        <defs>
          {keys.map((k) => (
            <linearGradient key={k.key} id={`g-${k.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={k.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={k.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke="#eef1ef" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8a968f" }} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8a968f" }} />
        <Tooltip content={<TooltipBox />} cursor={{ stroke: "#d6dcd8" }} />
        {keys.map((k) => (
          <Area key={k.key} type="monotone" dataKey={k.key} name={k.label} stroke={k.color} strokeWidth={2.4} fill={`url(#g-${k.key})`} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} animationDuration={1400} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DistrictBars({ data, height = 260 }: { data: { name: string; cases: number; risk: RiskLevel }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -18, right: 8, top: 10, bottom: 0 }} barCategoryGap={10}>
        <CartesianGrid vertical={false} stroke="#eef1ef" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10.5, fill: "#8a968f" }} interval={0} angle={-28} textAnchor="end" height={54} tickFormatter={(v: string) => (v.length > 12 ? v.slice(0, 11) + "…" : v)} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8a968f" }} />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "#f4f1e9" }} />
        <Bar dataKey="cases" name="Cases" radius={[8, 8, 4, 4]} animationDuration={1200}>
          {data.map((d, i) => (
            <Cell key={i} fill={RISK_COLORS[d.risk]} fillOpacity={0.9} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, height = 240, innerRadius = 62, outerRadius = 92, centerLabel, centerValue }: { data: { name: string; value: number; color?: string }[]; height?: number; innerRadius?: number; outerRadius?: number; centerLabel?: string; centerValue?: string | number }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2.5} cornerRadius={6} stroke="none" animationDuration={1200}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color ?? PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<TooltipBox />} />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-2xl font-bold text-ink-900">{centerValue}</div>
          <div className="text-[11px] uppercase tracking-wider text-ink-500">{centerLabel}</div>
        </div>
      )}
    </div>
  );
}

export function RiskRadial({ counts, height = 220 }: { counts: Record<RiskLevel, number>; height?: number }) {
  const data = [
    { name: "Low", value: counts.LOW, fill: RISK_COLORS.LOW },
    { name: "Medium", value: counts.MEDIUM, fill: RISK_COLORS.MEDIUM },
    { name: "High", value: counts.HIGH, fill: RISK_COLORS.HIGH },
  ];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart innerRadius="35%" outerRadius="100%" data={data} startAngle={90} endAngle={-270} barSize={14}>
        <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#eef1ef" }} animationDuration={1200} />
        <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        <Tooltip content={<TooltipBox />} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({ data, dataKey = "score", height = 140, color = "#16624a" }: { data: Record<string, unknown>[]; dataKey?: string; height?: number; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: -24, right: 8, top: 10, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#eef1ef" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8a968f" }} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#8a968f" }} />
        <Tooltip content={<TooltipBox />} />
        <Line type="monotone" dataKey={dataKey} name="Risk score" stroke={color} strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 0, fill: color }} activeDot={{ r: 5 }} animationDuration={1200} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBars({ data, height = 220, color = "#16624a" }: { data: { name: string; value: number; color?: string }[]; height?: number; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 0 }} barCategoryGap={8}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={96} tickLine={false} axisLine={false} tick={{ fontSize: 11.5, fill: "#4b5a52" }} />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "#f4f1e9" }} />
        <Bar dataKey="value" name="Cases" radius={[0, 8, 8, 0]} animationDuration={1200} label={{ position: "right", fontSize: 11, fill: "#67756d" }}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color ?? color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
