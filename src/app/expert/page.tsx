"use client";

import { ExpertShell } from "@/components/expert/expert-shell";
import { ReviewQueue } from "@/components/expert/review-queue";

export default function ExpertQueue() {
  return (
    <ExpertShell title="Review Queue" subtitle="Cases below 75% AI confidence, plus spot checks. Sorted by urgency.">
      <ReviewQueue />
    </ExpertShell>
  );
}
