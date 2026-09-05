"use client";

import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import type { CropCase } from "@/lib/types";
import { cropById, districtById } from "@/lib/mock/geo";
import { StatusBadge, RiskBadge } from "@/components/ui/badge";
import { relativeTime, cn } from "@/lib/utils";
import { useApp } from "@/lib/store/app-store";
import { STATUS_NAMES, THREAT_NAMES } from "@/lib/i18n/ui";

export function CaseCard({ c, href, className, showFarmer }: { c: CropCase; href?: string; className?: string; showFarmer?: boolean }) {
  const { lang } = useApp();
  const crop = cropById(c.cropId);
  const d = districtById(c.districtId);
  const threat = c.expertThreatId ?? c.ai.threatId;
  const body = (
    <div className={cn("card-surface flex items-center gap-3 p-3 transition-all hover:shadow-lift hover:-translate-y-0.5", className)}>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image} alt="" className="h-full w-full object-cover" />
        <span className="absolute bottom-1 left-1 rounded-md bg-ink-900/70 px-1 py-0.5 text-[9px] font-bold text-white">{c.ai.confidence}%</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-ink-900">{THREAT_NAMES[lang][threat]}</span>
          {c.expertThreatId && c.expertThreatId !== c.ai.threatId && <span className="text-[10px] text-purple-700 font-semibold">corrected</span>}
        </div>
        <div className="mt-0.5 truncate text-xs text-ink-500">{crop.emoji} {crop.name} · {showFarmer ? c.farmerName + " · " : ""}<MapPin className="inline h-3 w-3" /> {c.village}, {d.name}</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={c.status} label={STATUS_NAMES[lang][c.status]} />
          <RiskBadge level={c.risk} />
          <span className="text-[11px] text-ink-400">{relativeTime(c.createdAt)}</span>
        </div>
      </div>
      {href && <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
