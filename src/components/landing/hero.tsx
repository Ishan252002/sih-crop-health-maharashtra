"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Camera, CloudRain, Droplets, LayoutDashboard, MapPin, ShieldCheck, Sparkles, ThermometerSun, Languages, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/shared/particles";
import { ConfidenceRing } from "@/components/shared/confidence-ring";
import { RiskGauge } from "@/components/shared/risk-gauge";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section ref={ref} className="relative overflow-hidden gradient-hero pt-28 pb-16 sm:pt-36 sm:pb-24">
      <Particles count={18} />
      <div className="absolute inset-0 grid-fade opacity-70" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-forest-800 shadow-soft backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" /> Smart India Hackathon 2026 · PS 26131 · Government of Maharashtra
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="font-display text-[44px] leading-[1.02] sm:text-6xl lg:text-[68px] font-extrabold tracking-[-0.03em] text-ink-900">
            Detect Early.<br />
            <span className="text-gradient-forest">Protect Crops.</span><br />
            Empower Farmers.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            An intelligent crop-health platform combining AI diagnosis, weather intelligence, expert validation and geospatial surveillance.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }} className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/farmer"><Button size="xl" className="w-full sm:w-auto"><Camera className="h-5 w-5" /> Check Crop Health <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/gov"><Button size="xl" variant="outline" className="w-full sm:w-auto"><LayoutDashboard className="h-5 w-5" /> Government Dashboard</Button></Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
            <span className="inline-flex items-center gap-1.5"><Languages className="h-4 w-4 text-forest-600" /> English · हिंदी · मराठी</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-forest-600" /> IPM-first advisories</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-forest-600" /> 15 districts live</span>
          </motion.div>
        </div>

        {/* Hero visual: layered product cards */}
        <div className="relative mx-auto w-full max-w-[520px] h-[480px] sm:h-[560px] select-none lg:max-w-none">
          <motion.div style={{ y: y3 }} initial={{ opacity: 0, scale: 0.94, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} transition={{ duration: 0.7, delay: 0.2 }} className="absolute left-0 top-6 w-[62%] overflow-hidden rounded-3xl bg-ink-900 shadow-lift">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/samples/tomato-early-blight.svg" alt="Tomato leaf with early blight" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent" />
            <div className="absolute left-0 right-0 h-10 animate-scan bg-gradient-to-b from-transparent to-forest-300/70" />
            {[{ x: 24, y: 70, w: 13, h: 12 }, { x: 43, y: 60, w: 15, h: 13 }, { x: 64, y: 44, w: 12, h: 11 }].map((b, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.3, type: "spring" }} className="absolute rounded-md border-2 border-amber-500" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }} />
            ))}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/85">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-forest-300 animate-pulse" /> Scanning · Tomato · Nashik</span>
              <span>CropNet-v2.3</span>
            </div>
          </motion.div>

          <motion.div style={{ y: y1 }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="absolute right-0 top-0 w-[52%] card-surface p-4 shadow-lift">
            <div className="flex items-center gap-3">
              <ConfidenceRing value={94} size={76} stroke={8} label="" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">AI detection</div>
                <div className="font-display text-lg font-bold text-ink-900 leading-tight">Early Blight</div>
                <Badge tone="amber" className="mt-1">Moderate</Badge>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-forest-700"><CheckCircle2 className="h-3.5 w-3.5" /> Expert-confirmed · KVK Nashik</div>
          </motion.div>

          <motion.div style={{ y: y2 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }} className="absolute right-4 top-[46%] w-[46%] card-surface p-3 shadow-lift">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mb-1">Outbreak risk</div>
            <div className="flex justify-center"><RiskGauge score={78} level="HIGH" size={150} /></div>
          </motion.div>

          <motion.div style={{ y: y1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }} className="absolute left-2 top-[58%] w-[54%] card-surface p-3.5 shadow-lift">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-ink-500"><span>Weather · Nashik</span><CloudRain className="h-4 w-4 text-sky-500" /></div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-sand-100 p-2"><ThermometerSun className="mx-auto h-4 w-4 text-amber-600" /><div className="mt-1 text-sm font-bold text-ink-900">29°C</div></div>
              <div className="rounded-xl bg-sand-100 p-2"><Droplets className="mx-auto h-4 w-4 text-sky-500" /><div className="mt-1 text-sm font-bold text-ink-900">82%</div></div>
              <div className="rounded-xl bg-sand-100 p-2"><CloudRain className="mx-auto h-4 w-4 text-sky-500" /><div className="mt-1 text-sm font-bold text-ink-900">18 mm</div></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }} className="absolute left-[30%] bottom-0 w-[58%] card-surface overflow-hidden shadow-lift">
            <div className="relative h-24 bg-[radial-gradient(circle_at_30%_50%,rgba(209,60,60,0.25),transparent_45%),radial-gradient(circle_at_70%_40%,rgba(224,154,28,0.25),transparent_40%),linear-gradient(135deg,#e9eee8,#dfe6dc)]">
              <span className="absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-risk-high ring-4 ring-white shadow" />
              <span className="absolute left-[30%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-risk-high animate-pulse-ring" />
              <span className="absolute left-[70%] top-[40%] -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-amber-500 ring-4 ring-white shadow" />
              <span className="absolute left-[50%] top-[75%] -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-forest-500 ring-4 ring-white shadow" />
              <div className="absolute bottom-2 left-3 rounded-lg bg-white/90 px-2 py-1 text-[10.5px] font-semibold text-ink-800 shadow-soft">Nashik · 48 cases · <span className="text-risk-high">+23%</span></div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[11px]"><span className="font-semibold text-ink-800">Live hotspot map</span><span className="text-ink-500">Maharashtra · 16 clusters</span></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 1.15 }} className="absolute right-0 bottom-[22%] w-[40%] rounded-2xl bg-forest-900 p-3 text-white shadow-lift">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-forest-300">Advisory · मराठी</div>
            <div className="mt-1 text-[12.5px] leading-snug">खालची बाधित पाने काढा. वरून पाणी देणे टाळा. ट्रायकोडर्मा 5 ग्रॅम/लिटर फवारा.</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
