"use client";

import { useState } from "react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { CaseCard } from "@/components/shared/case-card";
import { SegmentedTabs } from "@/components/ui/tabs";
import { STATUS_NAMES } from "@/lib/i18n/ui";
import { FileText } from "lucide-react";

export default function Reports() {
  const { t, lang, cases } = useApp();
  const [tab, setTab] = useState<"all" | "open" | "done">("all");
  const mine = cases.filter((c) => c.farmerId === DEMO_FARMER.id);
  const list = mine.filter((c) => (tab === "all" ? true : tab === "open" ? ["Pending", "Under Review", "More Info Requested"].includes(c.status) : ["Confirmed", "Corrected", "Referred"].includes(c.status)));
  return (
    <FarmerShell title={t.myReports}>
      <div className="space-y-3">
        <SegmentedTabs value={tab} onChange={setTab} options={[{ id: "all", label: `${t.all} (${mine.length})` }, { id: "open", label: STATUS_NAMES[lang].Pending }, { id: "done", label: STATUS_NAMES[lang].Confirmed }]} className="w-full [&>button]:flex-1" />
        {list.length === 0 && <div className="card-surface p-8 text-center text-sm text-ink-500"><FileText className="mx-auto mb-2 h-6 w-6 text-ink-300" />{t.noReports}</div>}
        {list.map((c) => <CaseCard key={c.id} c={c} href={`/farmer/reports/${c.id}`} />)}
      </div>
    </FarmerShell>
  );
}
