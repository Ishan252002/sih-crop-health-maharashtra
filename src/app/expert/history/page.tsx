"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { ExpertShell } from "@/components/expert/expert-shell";
import { useApp } from "@/lib/store/app-store";
import { cropById, districtById, threatById } from "@/lib/mock/geo";
import { StatusBadge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Donut } from "@/components/charts/charts";
import { formatDate } from "@/lib/utils";

export default function ValidationHistory() {
  const { cases } = useApp();
  const done = cases.filter((c) => ["Confirmed", "Corrected", "Referred"].includes(c.status)).sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  const confirmed = done.filter((c) => c.status === "Confirmed").length;
  const corrected = done.filter((c) => c.status === "Corrected").length;
  const referred = done.filter((c) => c.status === "Referred").length;
  const agreement = done.length ? Math.round((confirmed / done.length) * 100) : 0;
  return (
    <ExpertShell title="Validation History" subtitle="Every decision is a labelled sample. Corrections retrain the model.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Validated (this session)" value={done.length + 128} tone="green" />
        <StatCard label="AI–expert agreement" value={agreement || 91} suffix="%" tone="blue" delta={2.4} />
        <StatCard label="Corrections fed to retraining" value={corrected + 11} tone="amber" />
        <StatCard label="Lab referrals" value={referred + 4} tone="neutral" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.6fr]">
        <div className="card-surface p-5">
          <div className="font-display font-bold text-ink-900">Decision mix</div>
          <Donut data={[{ name: "Confirmed", value: confirmed + 96, color: "#16624a" }, { name: "Corrected", value: corrected + 11, color: "#7e22ce" }, { name: "Referred", value: referred + 4, color: "#3d8bd6" }, { name: "More info", value: 17, color: "#b8926c" }]} centerLabel="decisions" centerValue={done.length + 128} />
          <div className="mt-2 rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs text-purple-800"><Sparkles className="mr-1 inline h-3.5 w-3.5" /> Model v2.3 → v2.4 retrain scheduled with 11 new corrected samples. Expected +1.8% accuracy on downy vs powdery mildew.</div>
        </div>
        <div className="card-surface overflow-hidden">
          <div className="border-b border-ink-100 px-5 py-3 font-display font-bold text-ink-900">Recent decisions</div>
          <ul className="divide-y divide-ink-100">
            {done.map((c, i) => (
              <motion.li key={c.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/expert/case/${c.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-forest-50/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" className="h-11 w-14 rounded-lg object-cover bg-ink-100" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm"><span className="font-mono text-xs text-ink-500">{c.id}</span><StatusBadge status={c.status} /></div>
                    <div className="mt-0.5 text-sm text-ink-800 truncate">
                      {cropById(c.cropId).name} · {threatById(c.ai.threatId).name}
                      {c.expertThreatId && c.expertThreatId !== c.ai.threatId && <span className="text-purple-700 font-semibold"> → {threatById(c.expertThreatId).name}</span>}
                      <span className="text-ink-500"> · {districtById(c.districtId).name}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-ink-500"><div>{formatDate(c.updatedAt)}</div><div>{c.expertName}</div></div>
                  <ArrowRight className="h-4 w-4 text-ink-300" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </ExpertShell>
  );
}
