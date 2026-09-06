"use client";

import { motion } from "framer-motion";
import { FlaskConical, Leaf, MapPin, Sprout, Droplets, Calendar, Download, QrCode, TrendingUp } from "lucide-react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { cropById, districtById } from "@/lib/mock/geo";
import { CROP_NAMES, STAGE_NAMES, DISTRICT_NAMES } from "@/lib/i18n/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SoilNutrients } from "@/components/farmer/soil-nutrients";
import { formatDate } from "@/lib/utils";

export default function MyFarm() {
  const { t, tx, lang } = useApp();
  const f = DEMO_FARMER;
  const d = districtById(f.districtId);

  return (
    <FarmerShell title={t.myFarm}>
      <div className="space-y-4">
        {/* Soil Health Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-earth-800 via-earth-700 to-forest-900 p-5 text-white shadow-lift">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute right-4 top-4 rounded-xl bg-white/15 p-2"><QrCode className="h-7 w-7" /></div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{t.soilHealthCard}</div>
          <div className="mt-1 font-display text-xl font-bold">{lang === "en" ? f.name : f.nameLocal}</div>
          <div className="text-xs text-white/75 font-mono">{f.id}</div>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div><div className="text-white/60">{t.village}</div><div className="font-semibold">{tx(f.village)} · {tx(f.taluka)} {t.taluka}</div></div>
            <div><div className="text-white/60">{t.district}</div><div className="font-semibold">{DISTRICT_NAMES[lang][d.id]}</div></div>
            <div><div className="text-white/60">{t.landSize}</div><div className="font-semibold">{f.landHa} ha ({(f.landHa * 2.47).toFixed(1)} {t.acres})</div></div>
            <div><div className="text-white/60">{t.soilType}</div><div className="font-semibold">{tx(f.soil.soilType)}</div></div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-white/70">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {t.lastTest}: {formatDate(f.soil.lastTest, { day: "numeric", month: "short", year: "numeric" }, lang)}</span>
            <span className="font-mono">{f.soil.cardId}</span>
          </div>
        </motion.div>

        <SoilNutrients soil={f.soil} />

        <div className="card-surface p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-ink-900 inline-flex items-center gap-2"><FlaskConical className="h-4 w-4 text-forest-700" /> {t.soilRecommendation}</h3>
            <Badge tone="green">{t.auto}</Badge>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /><span dangerouslySetInnerHTML={{ __html: t.recN }} /></li>
            <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" /><span dangerouslySetInnerHTML={{ __html: t.recK }} /></li>
            <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-earth-500" /><span dangerouslySetInnerHTML={{ __html: t.recOC }} /></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-display font-bold text-ink-900 inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-forest-700" /> {t.plots}</h3>
          <div className="space-y-2.5">
            {f.plots.map((p, i) => {
              const c = cropById(p.cropId);
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card-surface flex items-center gap-3 p-3.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-2xl">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900">{CROP_NAMES[lang][c.id]} <span className="text-xs font-normal text-ink-500">· {p.areaHa} ha</span></div>
                    <div className="text-xs text-ink-500 truncate">{tx(p.name)}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-0.5 font-semibold text-forest-800"><Sprout className="h-3 w-3" /> {STAGE_NAMES[lang][p.stage]}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 font-semibold text-sky-500"><Droplets className="h-3 w-3" /> {tx(p.irrigation)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-display font-bold text-ink-900 inline-flex items-center gap-2"><TrendingUp className="h-4 w-4 text-forest-700" /> {t.cropHistory}</h3>
          <div className="card-surface divide-y divide-ink-100">
            {f.cropHistory.map((h) => {
              const c = cropById(h.cropId);
              return (
                <div key={h.season} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xl">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink-900">{CROP_NAMES[lang][c.id]} <span className="text-xs font-normal text-ink-500">· {tx(h.season)}</span></div>
                    {h.issue && <div className="text-xs text-amber-600 inline-flex items-center gap-1"><Leaf className="h-3 w-3" /> {tx(h.issue)}</div>}
                  </div>
                  <div className="text-sm font-semibold text-ink-800">{h.yield === "In progress" ? t.inProgress : h.yield}</div>
                </div>
              );
            })}
          </div>
        </div>

        <Button variant="outline" className="w-full"><Download className="h-4 w-4" /> {t.downloadSoilCard}</Button>
      </div>
    </FarmerShell>
  );
}
