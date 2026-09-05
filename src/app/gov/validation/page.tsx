"use client";

import { GovShell } from "@/components/gov/gov-shell";
import { ReviewQueue } from "@/components/expert/review-queue";
import { useApp } from "@/lib/store/app-store";
import { StatCard } from "@/components/ui/stat-card";
import { ClipboardCheck, Hourglass, Sparkles, FlaskConical } from "lucide-react";

export default function GovValidation() {
  const { cases } = useApp();
  const pending = cases.filter((c) => c.status === "Pending" || c.status === "Under Review").length;
  const corrected = cases.filter((c) => c.status === "Corrected").length;
  const referred = cases.filter((c) => c.status === "Referred").length;
  return (
    <GovShell title="Expert Validation" subtitle="Human-in-the-loop review of AI predictions. Corrections retrain the model.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        <StatCard label="Pending validations" value={pending} tone="amber" icon={<Hourglass className="h-4.5 w-4.5" />} />
        <StatCard label="Validated this season" value={236 + cases.filter((c) => c.status === "Confirmed").length} tone="green" icon={<ClipboardCheck className="h-4.5 w-4.5" />} delta={5} />
        <StatCard label="Corrections → retraining" value={11 + corrected} tone="blue" icon={<Sparkles className="h-4.5 w-4.5" />} />
        <StatCard label="Lab referrals" value={4 + referred} tone="neutral" icon={<FlaskConical className="h-4.5 w-4.5" />} />
      </div>
      <ReviewQueue basePath="/gov/validation" compact />
    </GovShell>
  );
}
