"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, CloudSun, Lightbulb, MapPin, FileText, ArrowRight, Bell, CalendarClock, ChevronRight, Sprout } from "lucide-react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { districtById, cropById } from "@/lib/mock/geo";
import { weatherFor } from "@/lib/mock/weather";
import { computeRisk } from "@/lib/risk-engine";
import { CROP_NAMES, STAGE_NAMES, DISTRICT_NAMES, THREAT_NAMES } from "@/lib/i18n/ui";
import { WeatherStrip } from "@/components/shared/weather-panel";
import { CaseCard } from "@/components/shared/case-card";
import { cn, formatDate } from "@/lib/utils";
import { RiskBadge } from "@/components/ui/badge";
import { InsuranceStatusCard } from "@/components/farmer/insurance";

export default function FarmerHome() {
  const { t, tx, lang, farmerName, cases } = useApp();
  const f = DEMO_FARMER;
  const d = districtById(f.districtId);
  const plot = f.plots[0];
  const crop = cropById(plot.cropId);
  const weather = weatherFor(f.districtId);
  const myCases = cases.filter((c) => c.farmerId === f.id);
  const risk = computeRisk({ weather, cropId: plot.cropId, stage: plot.stage, threatId: "early-blight", soil: f.soil, localCases: 36 });
  const due = myCases.find((c) => c.followUpDue);

  const actions = [
    { href: "/farmer/check", label: t.checkMyCrop, icon: Camera, cls: "gradient-forest text-white shadow-glow-green", big: true },
    { href: "/farmer/risk", label: t.riskForecast, icon: CloudSun, cls: "bg-sky-100 text-sky-500" },
    { href: "/farmer/advisory", label: t.advisory, icon: Lightbulb, cls: "bg-amber-100 text-amber-600" },
    { href: "/farmer/expert", label: t.nearbyExpert, icon: MapPin, cls: "bg-purple-50 text-purple-700" },
    { href: "/farmer/reports", label: t.myReports, icon: FileText, cls: "bg-earth-100 text-earth-800" },
  ];

  const riskLabel = { LOW: t.low, MEDIUM: t.medium, HIGH: t.high }[risk.level];
  const riskCls = { LOW: "from-forest-700 to-forest-500", MEDIUM: "from-amber-600 to-amber-500", HIGH: "from-risk-high to-[#e0653c]" }[risk.level];

  return (
    <FarmerShell>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-[26px] font-bold leading-tight text-ink-900">{t.namaskar}, {lang === "en" ? farmerName.split(" ")[0] : f.nameLocal.split(" ")[0]} 👋</h1>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-500"><MapPin className="h-3.5 w-3.5" /> {tx(f.village)}, {DISTRICT_NAMES[lang][d.id]}, {t.maharashtra}</div>
          </div>
          <Link href="/farmer/reports" className="relative h-10 w-10 rounded-xl bg-white border border-ink-100 flex items-center justify-center text-ink-700 shadow-soft" aria-label="Alerts">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-risk-high ring-2 ring-white" />
          </Link>
        </div>

        {/* Current crop + risk hero */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br p-4 text-white shadow-lift", riskCls)}>
          <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{t.currentCrop}</div>
              <div className="mt-0.5 font-display text-2xl font-bold">{crop.emoji} {CROP_NAMES[lang][crop.id]}</div>
              <div className="mt-0.5 text-xs text-white/80 inline-flex items-center gap-1"><Sprout className="h-3.5 w-3.5" /> {STAGE_NAMES[lang][plot.stage]} · {plot.areaHa} ha · {tx(plot.irrigation)}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{t.todayRisk}</div>
              <div className="mt-1 font-display text-3xl font-extrabold leading-none">{riskLabel}</div>
              <div className="text-xs text-white/80">{risk.score}/100</div>
            </div>
          </div>
          <p className="relative mt-3 text-[13px] leading-snug text-white/90">{risk.explanations[lang]}</p>
          <Link href="/farmer/risk" className="relative mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold hover:bg-white/25">{t.viewForecast} <ArrowRight className="h-3.5 w-3.5" /></Link>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }} className={a.big ? "col-span-2" : ""}>
                <Link href={a.href} className={cn("flex items-center gap-3 rounded-2xl p-4 transition-transform active:scale-[0.98]", a.big ? cn("justify-between", a.cls) : "card-surface hover:shadow-lift")}>
                  {a.big ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Icon className="h-6 w-6" /></span>
                        <div><div className="font-display text-lg font-bold">📷 {a.label}</div><div className="text-xs text-white/75">{t.uploadPhoto}</div></div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/70" />
                    </>
                  ) : (
                    <>
                      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", a.cls)}><Icon className="h-5 w-5" /></span>
                      <span className="font-semibold text-[14px] text-ink-900 leading-tight">{a.label}</span>
                    </>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <WeatherStrip weather={weather} stage={plot.stage} districtName={DISTRICT_NAMES[lang][d.id]} />

        <InsuranceStatusCard />

        {due && (
          <Link href={`/farmer/reports/${due.id}`} className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-100/50 p-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-600 shadow-soft"><CalendarClock className="h-5 w-5" /></span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink-900">{t.followUpDue}: {formatDate(due.followUpDue!, undefined, lang)}</div>
              <div className="text-xs text-ink-600 truncate">{CROP_NAMES[lang][due.cropId]} · {due.id}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-400" />
          </Link>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink-900">{t.recentReports}</h2>
            <Link href="/farmer/reports" className="text-xs font-semibold text-forest-700">{t.seeAll}</Link>
          </div>
          <div className="space-y-2.5">
            {myCases.slice(0, 3).map((c) => <CaseCard key={c.id} c={c} href={`/farmer/reports/${c.id}`} />)}
          </div>
        </div>

        <div className="rounded-2xl bg-forest-900 p-4 text-white">
          <div className="flex items-center justify-between"><div className="text-[11px] font-semibold uppercase tracking-wider text-forest-300">{t.nearby}</div><RiskBadge level="HIGH" label={t.high} /></div>
          <div className="mt-1 font-display text-xl font-bold">36 {t.nearbyCases}</div>
          <div className="text-xs text-white/70">{THREAT_NAMES[lang]["early-blight"]} · {CROP_NAMES[lang].tomato} · {tx(f.village)} {t.within14km}</div>
        </div>
      </div>
    </FarmerShell>
  );
}
