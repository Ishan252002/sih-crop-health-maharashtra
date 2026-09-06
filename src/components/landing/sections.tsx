"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, BadgeIndianRupee, Camera, Clock, CloudSun, FlaskConical, Languages, LayoutDashboard, MapPinned, ScanSearch, ShieldCheck, Smartphone, Sprout, UserCheck, Users, Check } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { IntelligenceFlow } from "@/components/shared/intelligence-flow";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { IMPACT } from "@/lib/mock/analytics";
import { cn } from "@/lib/utils";
import { HotspotMap, MapLegend } from "@/components/map/hotspot-map";
import { HOTSPOTS } from "@/lib/mock/hotspots";
import { RiskGauge } from "@/components/shared/risk-gauge";
import { ConfidenceRing } from "@/components/shared/confidence-ring";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { Lang } from "@/lib/types";
import { advisoryFor } from "@/lib/i18n/advisories";
import { LANGS } from "@/lib/i18n/ui";
import { Logo } from "@/components/shared/logo";
import { SAMPLE_IMAGES } from "@/lib/ai-mock";

const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.55 } } as const;

export function ProblemSection() {
  const items = [
    { icon: Clock, title: "Detection comes too late", body: "Farmers notice disease only after visible damage has spread across the field. By then, 20–40% of yield can already be lost." },
    { icon: Users, title: "Extension staff stretched thin", body: "One officer often covers thousands of hectares. Lab diagnosis and expert advice are days away when hours matter." },
    { icon: CloudSun, title: "Risk signals never combined", body: "Weather, crop stage, variety, soil and local pest history all influence risk, but nobody joins them into a farm-level alert." },
    { icon: FlaskConical, title: "Wrong diagnosis, wrong spray", body: "Guesswork leads to excessive or inappropriate pesticide use: higher cost, residue concerns and no cure." },
  ];
  return (
    <section id="problem" className="relative py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="The problem" title="Crop losses start with a delay, not a disease." description="Maharashtra grows cotton, soybean, grapes, onion, tomato and sugarcane across 15+ agro-climatic zones. The gap between first symptom and first action is where the damage happens." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div key={it.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="group card-surface p-6 hover:shadow-lift hover:-translate-y-1 transition-all duration-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-earth-100 text-earth-800 group-hover:bg-forest-100 group-hover:text-forest-800 transition-colors"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{it.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28 bg-forest-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(800px_400px_at_20%_0%,rgba(79,170,135,0.35),transparent_60%),radial-gradient(700px_400px_at_90%_100%,rgba(184,146,108,0.25),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading dark eyebrow="How the intelligence flows" title="From a leaf photo to a state-level decision in one pipeline." description="Each module feeds the next. Field confirmations from experts flow back to retrain the model, so the system learns from every case in Maharashtra." />
        <div className="mt-12"><IntelligenceFlow dark /></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { k: "≤ 4 s", v: "photo to diagnosis on a 2G connection" },
            { k: "75%", v: "confidence threshold below which experts review" },
            { k: "3", v: "languages for every advisory: English, Hindi, Marathi" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="font-display text-3xl font-bold text-forest-300">{s.k}</div>
              <div className="mt-1 text-sm text-white/70">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ id, eyebrow, title, body, bullets, visual, flip, cta }: { id?: string; eyebrow: string; title: string; body: string; bullets: string[]; visual: React.ReactNode; flip?: boolean; cta?: { href: string; label: string } }) {
  return (
    <div id={id} className={cn("grid items-center gap-10 lg:gap-16 lg:grid-cols-2", flip && "lg:[&>*:first-child]:order-2")}>
      <motion.div {...fade}>
        <SectionHeading eyebrow={eyebrow} title={title} description={body} />
        <ul className="mt-6 space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-ink-700"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700"><Check className="h-3 w-3" /></span>{b}</li>
          ))}
        </ul>
        {cta && <Link href={cta.href} className="mt-6 inline-flex"><Button variant="secondary">{cta.label} <ArrowRight className="h-4 w-4" /></Button></Link>}
      </motion.div>
      <motion.div {...fade} transition={{ duration: 0.6, delay: 0.1 }}>{visual}</motion.div>
    </div>
  );
}

function DetectionVisual() {
  return (
    <div className="relative">
      <div className="card-surface overflow-hidden">
        <div className="relative bg-ink-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SAMPLE_IMAGES.clear} alt="" className="aspect-[16/10] w-full object-cover opacity-95" />
          <div className="absolute left-0 right-0 h-12 animate-scan bg-gradient-to-b from-transparent to-forest-300/70" />
          {[{ x: 24, y: 70, w: 13, h: 12 }, { x: 43, y: 60, w: 15, h: 13 }, { x: 64, y: 44, w: 12, h: 11 }, { x: 78, y: 22, w: 11, h: 11 }].map((b, i) => (
            <span key={i} className="absolute rounded-md border-2 border-amber-500" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}><span className="absolute -top-5 left-0 rounded bg-amber-500 px-1 text-[9px] font-bold text-white">lesion</span></span>
          ))}
        </div>
        <div className="flex items-center gap-4 p-4">
          <ConfidenceRing value={94} size={84} stroke={8} />
          <div className="flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Tomato · Nashik</div>
            <div className="font-display text-xl font-bold text-ink-900">Early Blight</div>
            <div className="text-xs text-ink-500 italic">Alternaria solani</div>
            <div className="mt-1.5 flex gap-1.5"><Badge tone="amber">Moderate</Badge><Badge tone="green">21% leaf area</Badge></div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 hidden sm:block rounded-2xl bg-white p-3 shadow-lift border border-ink-100">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Alternatives</div>
        <div className="mt-1 text-xs text-ink-700">Late Blight 4% · Leaf Spot 2%</div>
      </div>
    </div>
  );
}

function RiskVisual() {
  return (
    <div className="card-surface p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <RiskGauge score={78} level="HIGH" size={220} sublabel="Fungal outbreak · next 72 h" />
        <div className="flex-1 space-y-2 w-full">
          {[{ l: "Humidity 82%", v: 35, c: "bg-sky-500" }, { l: "Rainfall 18 mm", v: 20, c: "bg-sky-500" }, { l: "Temp 29°C", v: 14, c: "bg-amber-500" }, { l: "Fruiting stage", v: 12, c: "bg-forest-500" }, { l: "Low soil N", v: 5, c: "bg-earth-500" }].map((f) => (
            <div key={f.l}>
              <div className="flex justify-between text-xs text-ink-600"><span>{f.l}</span><span className="font-semibold">+{f.v}</span></div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-ink-100 overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${f.v * 2.5}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className={cn("h-full rounded-full", f.c)} /></div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-sand-100 p-3 text-sm text-ink-700">&ldquo;High humidity and recent rainfall increase the probability of fungal infection.&rdquo;</p>
    </div>
  );
}

function ExpertVisual() {
  const [state, setState] = useState<"pending" | "confirmed" | "corrected">("pending");
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-ink-500">Case MH-NSK-2026-0412 · Grapes · Nashik</div>
        <Badge tone={state === "pending" ? "amber" : state === "confirmed" ? "green" : "purple"} dot>{state === "pending" ? "Under Review" : state === "confirmed" ? "Confirmed" : "Corrected"}</Badge>
      </div>
      <div className="mt-4 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/samples/grape-powdery.svg" alt="" className="h-24 w-32 rounded-xl object-cover" />
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">AI prediction</div>
          <div className="font-display text-lg font-bold text-ink-900">Powdery Mildew</div>
          <div className="mt-1 inline-flex items-center gap-2 rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-600"><AlertTriangle className="h-3.5 w-3.5" /> AI Confidence: 61% → Expert Review Required</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button size="sm" onClick={() => setState("confirmed")}><UserCheck className="h-4 w-4" /> Confirm</Button>
        <Button size="sm" variant="outline" onClick={() => setState("corrected")}>Correct → Downy Mildew</Button>
      </div>
      {state !== "pending" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl bg-forest-50 border border-forest-200 p-3 text-xs text-forest-800">
          <span className="font-semibold">Learning loop:</span> this field confirmation is added to the Maharashtra training set. Next retrain improves {state === "corrected" ? "downy vs powdery" : "powdery mildew"} accuracy for Nashik grape growers.
        </motion.div>
      )}
    </div>
  );
}

function MapVisual() {
  return (
    <div className="relative card-surface overflow-hidden h-[380px]">
      <HotspotMap hotspots={HOTSPOTS} height={380} interactive={false} zoom={6.3} />
      <MapLegend className="absolute left-3 bottom-3 z-[500]" />
      <div className="absolute right-3 top-3 z-[500] glass rounded-xl px-3 py-2 text-xs shadow-soft"><span className="font-semibold text-ink-900">Nashik · Grapes · Powdery Mildew</span><br /><span className="text-ink-600">48 cases · </span><span className="text-risk-high font-semibold">HIGH · +23%</span></div>
    </div>
  );
}

function AdvisoryVisual() {
  const [lang, setLang] = useState<Lang>("mr");
  const a = advisoryFor("early-blight", lang);
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="font-display font-bold text-ink-900">Early Blight · Tomato</div>
        <div className="inline-flex rounded-full bg-ink-100 p-1">
          {LANGS.map((l) => (
            <button key={l.id} onClick={() => setLang(l.id)} className={cn("rounded-full px-3 h-8 text-sm font-semibold transition-colors", lang === l.id ? "bg-white shadow-soft text-forest-900" : "text-ink-500")}>{l.native}</button>
          ))}
        </div>
      </div>
      <motion.div key={lang} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
        <div className="rounded-xl bg-sand-100 p-3 text-sm text-ink-800">{a.what}</div>
        <ul className="space-y-1.5 text-sm text-ink-700">
          {a.immediate.slice(0, 3).map((x, i) => (
            <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-risk-high" />{x}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {["Cultural", "Biological", "Monitoring", "Chemical (last resort)"].map((k, i) => (
            <span key={k} className={cn("rounded-full px-2 py-1 font-semibold", i === 3 ? "bg-amber-100 text-amber-600" : "bg-forest-100 text-forest-800")}>{k}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function GovVisual() {
  return (
    <div className="card-surface p-5 bg-forest-950 text-white border-forest-900">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-forest-300">State surveillance · today</div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-risk-high/20 px-2 py-1 text-[11px] font-semibold text-red-200"><span className="h-1.5 w-1.5 rounded-full bg-risk-high animate-pulse" /> High-risk cluster detected in Nashik</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[{ l: "Total cases", v: 402 }, { l: "Active outbreaks", v: 5 }, { l: "Farmers assisted", v: 12480 }].map((s) => (
          <div key={s.l} className="rounded-xl bg-white/6 border border-white/10 p-3">
            <div className="font-display text-2xl font-bold"><CountUp value={s.v} /></div>
            <div className="text-[11px] text-white/60">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {[{ d: "Jalgaon", v: 57, c: "bg-risk-high" }, { d: "Nashik", v: 84, c: "bg-risk-high" }, { d: "Yavatmal", v: 41, c: "bg-risk-high" }, { d: "Nagpur", v: 31, c: "bg-amber-500" }, { d: "Sangli", v: 27, c: "bg-amber-500" }].map((r) => (
          <div key={r.d} className="flex items-center gap-3 text-xs">
            <span className="w-16 text-white/70">{r.d}</span>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${r.v}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className={cn("h-full rounded-full", r.c)} /></div>
            <span className="w-8 text-right font-semibold">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeatureSections() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-sand-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-24 sm:space-y-32">
        <FeatureRow eyebrow="AI disease detection" title="A photo becomes a diagnosis in seconds." body="CNN transfer learning identifies diseases; YOLO detects insects and lesions. Every result comes with confidence, severity and the symptoms the model actually saw." bullets={["9 priority diseases and pests across 8 Maharashtra crops", "Confidence, severity and affected-area estimate on every scan", "Low-confidence cases routed automatically to an expert"]} visual={<DetectionVisual />} cta={{ href: "/farmer/check", label: "Try the scan flow" }} />
        <FeatureRow flip eyebrow="Weather-based risk engine" title="Risk before symptoms, not after." body="Temperature, humidity, rainfall, crop stage, soil health and nearby cases are combined by a transparent rule engine into a LOW / MEDIUM / HIGH forecast for the next 7 days." bullets={["Explains every score with the factors behind it", "7-day trend so farmers can plan sprays and irrigation", "Soil Health Card values feed susceptibility"]} visual={<RiskVisual />} cta={{ href: "/farmer/risk", label: "See the risk forecast" }} />
        <FeatureRow eyebrow="Expert validation" title="Humans stay in the loop. The model learns from them." body="Any prediction under 75% confidence goes to a plant pathologist. Confirmations and corrections are recorded as labelled field data that improves the next model version." bullets={["Confirm, correct, request more information or refer to a lab", "Full case context: image, weather, soil, history, AI reasoning", "Validation history is auditable for every district"]} visual={<ExpertVisual />} cta={{ href: "/expert", label: "Open the expert console" }} />
        <FeatureRow flip eyebrow="Geospatial hotspot mapping" title="See the outbreak before it becomes a district problem." body="Every confirmed case lands on a Maharashtra map with severity, crop, disease and 7-day trend. Clusters are ranked so officers know where to go first." bullets={["Interactive GIS map with risk zones per district", "Cluster panel: cases, trend, growers in zone, favourable conditions", "One-click advisory push to every farmer in the zone"]} visual={<MapVisual />} cta={{ href: "/gov/hotspots", label: "Explore live hotspots" }} />
        <FeatureRow eyebrow="Multilingual IPM advisory" title="Advice a farmer can act on today, in their own language." body="Eight-part advisories in English, Hindi and Marathi. Cultural, biological and mechanical control come first. Chemical control appears only with dosage, safety and pre-harvest intervals." bullets={["What happened, why, immediate and preventive actions", "IPM ladder: chemical only when the threshold is crossed", "Dosage, safety warnings and when to call an expert"]} visual={<AdvisoryVisual />} cta={{ href: "/farmer/advisory", label: "Read a full advisory" }} />
        <FeatureRow flip eyebrow="Government intelligence" title="The state sees the situation in five seconds." body="Aggregated case data, district-wise risk, crop-wise distribution, weekly trends and pending validations, with a map at the centre. Built for surveillance and preventive planning." bullets={["Total cases, outbreaks, high-risk zones, farmers assisted", "Filters by district, crop, disease, date and risk level", "Alerts that name the cluster and the recommended action"]} visual={<GovVisual />} cta={{ href: "/gov", label: "Open the dashboard" }} />
      </div>
    </section>
  );
}

export function ImpactSection() {
  return (
    <section id="impact" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading align="center" eyebrow="Expected outcomes" title="Earlier detection. Fewer sprays. Faster response." description="Pilot metrics from the Nashik and Jalgaon talukas modelled for the 2026 kharif season." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT.map((m, i) => (
            <motion.div key={m.label} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="card-surface p-6 text-center">
              <div className="font-display text-4xl font-extrabold text-gradient-forest"><CountUp value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} /></div>
              <div className="mt-2 font-semibold text-ink-900">{m.label}</div>
              <div className="mt-1 text-xs text-ink-500">{m.desc}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Sprout, t: "Reduced crop loss", d: "Alerts up to 7 days before visible damage give farmers a real window to act." },
            { icon: BadgeIndianRupee, t: "Targeted pesticide use", d: "IPM-first advisories cut unnecessary sprays and residue risk." },
            { icon: ShieldCheck, t: "Better surveillance coverage", d: "Every scan is a data point. Every district gets a live picture." },
          ].map((x) => {
            const Icon = x.icon;
            return (
              <div key={x.t} className="flex gap-4 rounded-2xl bg-sand-100 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-forest-700 shadow-soft"><Icon className="h-5 w-5" /></span>
                <div><div className="font-semibold text-ink-900">{x.t}</div><div className="mt-1 text-sm text-ink-500">{x.d}</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 gradient-forest text-white">
      <div className="absolute inset-0 grid-fade opacity-20" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">Start with one photo.<br />End with a healthier state.</h2>
        <p className="mt-4 text-lg text-white/75">Two experiences, one intelligence pipeline. Try the farmer journey, then watch the case appear on the government dashboard.</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/farmer"><Button size="xl" variant="glass" className="w-full sm:w-auto"><Smartphone className="h-5 w-5" /> Open Farmer App</Button></Link>
          <Link href="/gov"><Button size="xl" className="w-full sm:w-auto bg-white text-forest-900 hover:bg-forest-50"><LayoutDashboard className="h-5 w-5" /> Government Dashboard</Button></Link>
        </div>
        <div className="mt-6 text-xs text-white/60 inline-flex items-center gap-4 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> Image AI</span>
          <span className="inline-flex items-center gap-1"><ScanSearch className="h-3.5 w-3.5" /> YOLO pest detection</span>
          <span className="inline-flex items-center gap-1"><MapPinned className="h-3.5 w-3.5" /> GIS</span>
          <span className="inline-flex items-center gap-1"><Languages className="h-3.5 w-3.5" /> EN · HI · MR</span>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest-950 text-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-3 max-w-sm text-sm">Early detection and management of crop diseases and pest infestations. Built for Smart India Hackathon 2026, Problem Statement 26131.</p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Farmer</div>
          <ul className="mt-3 space-y-2 text-sm"><li><Link href="/farmer/check" className="hover:text-white">Check crop</Link></li><li><Link href="/farmer/risk" className="hover:text-white">Risk forecast</Link></li><li><Link href="/farmer/advisory" className="hover:text-white">Advisory</Link></li><li><Link href="/farmer/farm" className="hover:text-white">Soil Health Card</Link></li></ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Government</div>
          <ul className="mt-3 space-y-2 text-sm"><li><Link href="/gov" className="hover:text-white">Overview</Link></li><li><Link href="/gov/hotspots" className="hover:text-white">Live hotspots</Link></li><li><Link href="/gov/analytics" className="hover:text-white">Disease analytics</Link></li><li><Link href="/expert" className="hover:text-white">Expert console</Link></li></ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Organisation</div>
          <ul className="mt-3 space-y-2 text-sm"><li>Maharashtra State Innovation Society</li><li>Dept. of Skills, Employment, Entrepreneurship and Innovation</li><li>Theme: Agriculture, FoodTech & Rural Development</li></ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">Prototype UI with simulated AI inference and mock data · © 2026 KrishiRakshak</div>
    </footer>
  );
}
