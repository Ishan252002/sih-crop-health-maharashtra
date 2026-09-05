"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GovShell } from "@/components/gov/gov-shell";
import { CaseReview } from "@/components/expert/case-review";
import { useApp } from "@/lib/store/app-store";
import { cropById, districtById } from "@/lib/mock/geo";

export default function GovCase({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { cases } = useApp();
  const c = cases.find((x) => x.id === id);
  return (
    <GovShell title={c ? `Case ${c.id}` : "Case"} subtitle={c ? `${cropById(c.cropId).name} · ${c.village}, ${districtById(c.districtId).name} · ${c.farmerName}` : undefined}>
      <Link href="/gov/validation" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to validation queue</Link>
      {c ? <CaseReview c={c} /> : <div className="card-surface p-10 text-center text-sm text-ink-500">Case not found.</div>}
    </GovShell>
  );
}
