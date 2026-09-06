"use client";

import { useRouter } from "next/navigation";
import { LogOut, Phone, MapPin, Landmark, Fingerprint, Bell, Languages, RotateCcw } from "lucide-react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { districtById } from "@/lib/mock/geo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { formatDate } from "@/lib/utils";
import { DISTRICT_NAMES } from "@/lib/i18n/ui";
import { InsuranceDocumentCard, SoilCardDocument } from "@/components/farmer/insurance";
import { FileText } from "lucide-react";

export default function Profile() {
  const { t, tx, lang, farmerName, logout, reset, cases } = useApp();
  const router = useRouter();
  const f = DEMO_FARMER;
  const d = districtById(f.districtId);
  const rows = [
    { icon: Fingerprint, label: t.farmerId, value: f.id, mono: true },
    { icon: Phone, label: t.mobile, value: f.mobile },
    { icon: MapPin, label: t.village, value: `${tx(f.village)}, ${tx(f.taluka)}, ${DISTRICT_NAMES[lang][d.id]}` },
    { icon: Landmark, label: t.landSize, value: `${f.landHa} ha · ${f.plots.length} ${t.plots.toLowerCase()}` },
  ];
  return (
    <FarmerShell title={t.profile}>
      <div className="space-y-4">
        <div className="card-surface p-5 flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center font-display text-2xl font-bold text-white shadow-soft" style={{ background: `linear-gradient(135deg, hsl(${f.avatarHue} 45% 35%), hsl(${f.avatarHue} 40% 22%))` }}>{farmerName.split(" ").map((x) => x[0]).join("")}</div>
          <div className="min-w-0">
            <div className="font-display text-xl font-bold text-ink-900">{lang === "en" ? farmerName : f.nameLocal}</div>
            <div className="text-xs text-ink-500">{t.registered} {formatDate(f.registeredOn, { day: "numeric", month: "short", year: "numeric" }, lang)} · {cases.filter((c) => c.farmerId === f.id).length} {t.reports}</div>
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-0.5 text-[11px] font-semibold text-forest-800">✓ {t.verifiedAgristack}</div>
          </div>
        </div>
        <div className="card-surface divide-y divide-ink-100">
          {rows.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.label} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand-100 text-ink-600"><Icon className="h-4 w-4" /></span>
                <div className="flex-1 min-w-0"><div className="text-[11px] text-ink-500">{r.label}</div><div className={`text-sm font-semibold text-ink-900 truncate ${r.mono ? "font-mono" : ""}`}>{r.value}</div></div>
              </div>
            );
          })}
        </div>
        <div className="card-surface p-4 space-y-3">
          <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900"><Languages className="h-4 w-4 text-forest-700" /> {t.language}</span></div>
          <LanguageSwitcher className="w-full justify-between" />
          <div className="flex items-center justify-between pt-1"><span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900"><Bell className="h-4 w-4 text-forest-700" /> {t.riskAlerts}</span><span className="h-6 w-11 rounded-full bg-forest-600 relative"><span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" /></span></div>
        </div>
        <div id="documents" className="space-y-2.5 scroll-mt-20">
          <h2 className="font-display text-base font-bold text-ink-900 inline-flex items-center gap-2"><FileText className="h-4 w-4 text-forest-700" /> {t.myDocuments}</h2>
          <SoilCardDocument />
          <InsuranceDocumentCard />
        </div>
        <Button variant="outline" className="w-full" onClick={() => { reset(); }}><RotateCcw className="h-4 w-4" /> {t.resetDemo}</Button>
        <Button variant="danger" className="w-full" onClick={() => { logout(); router.replace("/farmer/login"); }}><LogOut className="h-4 w-4" /> {t.logout}</Button>
      </div>
    </FarmerShell>
  );
}
