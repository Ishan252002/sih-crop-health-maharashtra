"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { AdvisoryView } from "@/components/shared/advisory-view";
import { THREATS, CROPS } from "@/lib/mock/geo";
import { CROP_NAMES, THREAT_NAMES } from "@/lib/i18n/ui";
import { Select } from "@/components/ui/select";
import type { Severity } from "@/lib/types";

function AdvisoryInner() {
  const { t, lang } = useApp();
  const sp = useSearchParams();
  const [threatId, setThreatId] = useState(sp.get("threat") ?? "early-blight");
  const [cropId, setCropId] = useState(sp.get("crop") ?? "tomato");
  const severity = (sp.get("severity") as Severity) ?? "Moderate";
  const threats = THREATS.filter((x) => x.crops.includes(cropId));
  const effective = threats.some((x) => x.id === threatId) ? threatId : threats[0].id;
  return (
    <FarmerShell title={t.advisory} back="/farmer">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <Select value={cropId} onChange={(e) => setCropId(e.target.value)}>{CROPS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {CROP_NAMES[lang][c.id]}</option>)}</Select>
        <Select value={effective} onChange={(e) => setThreatId(e.target.value)}>{threats.map((x) => <option key={x.id} value={x.id}>{THREAT_NAMES[lang][x.id]}</option>)}</Select>
      </div>
      <AdvisoryView threatId={effective} cropId={cropId} severity={severity} />
    </FarmerShell>
  );
}

export default function AdvisoryPage() {
  return (
    <Suspense fallback={null}>
      <AdvisoryInner />
    </Suspense>
  );
}
