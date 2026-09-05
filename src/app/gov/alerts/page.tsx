"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, Send, MapPinned, Megaphone, Users, CheckCircle2 } from "lucide-react";
import { GovShell } from "@/components/gov/gov-shell";
import { useApp } from "@/lib/store/app-store";
import { ALERTS } from "@/lib/mock/cases";
import { cropById, districtById, threatById } from "@/lib/mock/geo";
import { RiskBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SegmentedTabs } from "@/components/ui/tabs";
import { cn, relativeTime } from "@/lib/utils";
import { LANGS } from "@/lib/i18n/ui";
import { advisoryFor } from "@/lib/i18n/advisories";
import type { Alert, Lang } from "@/lib/types";

export default function Alerts() {
  const { ackAlerts, ackAlert, cases } = useApp();
  const [tab, setTab] = useState<"open" | "all">("open");
  const [compose, setCompose] = useState<Alert | null>(null);
  const [lang, setLang] = useState<Lang>("mr");
  const [sent, setSent] = useState(false);
  const farmerHigh = cases.filter((c) => c.source === "farmer" && c.risk === "HIGH").map<Alert>((c) => ({ id: `al-${c.id}`, level: "HIGH", title: `New high-risk ${threatById(c.ai.threatId).name} report in ${districtById(c.districtId).name}`, body: `${c.farmerName} (${c.village}) reported ${cropById(c.cropId).name} with ${c.ai.confidence}% confidence. Risk score ${c.riskScore}. ${c.status === "Pending" ? "Awaiting expert validation." : "Auto-validated."}`, districtId: c.districtId, cropId: c.cropId, threatId: c.ai.threatId, createdAt: c.createdAt, acknowledged: false }));
  const all = [...farmerHigh, ...ALERTS].map((a) => ({ ...a, acknowledged: a.acknowledged || ackAlerts.includes(a.id) }));
  const list = all.filter((a) => tab === "all" || !a.acknowledged);

  return (
    <GovShell title="Alerts" subtitle="Cluster detections, threshold breaches and advisory dispatch" actions={<SegmentedTabs size="sm" value={tab} onChange={setTab} options={[{ id: "open", label: `Open (${all.filter((a) => !a.acknowledged).length})` }, { id: "all", label: "All" }]} />}>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {list.length === 0 && <div className="card-surface p-10 text-center text-sm text-ink-500"><CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-forest-600" />All alerts acknowledged.</div>}
            {list.map((a) => (
              <motion.div key={a.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className={cn("card-surface p-4 sm:p-5 border-l-4", a.level === "HIGH" ? "border-l-risk-high" : a.level === "MEDIUM" ? "border-l-amber-500" : "border-l-forest-500", a.acknowledged && "opacity-70")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={cn("relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", a.level === "HIGH" ? "bg-red-50 text-risk-high" : a.level === "MEDIUM" ? "bg-amber-100 text-amber-600" : "bg-forest-100 text-forest-700")}><Bell className="h-4.5 w-4.5" />{!a.acknowledged && a.level === "HIGH" && <span className="absolute inset-0 rounded-xl bg-risk-high/40 animate-pulse-ring" />}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><RiskBadge level={a.level} /><span className="text-xs text-ink-500">{relativeTime(a.createdAt)}</span>{a.acknowledged && <Badge tone="neutral"><Check className="h-3 w-3" /> acknowledged</Badge>}</div>
                      <div className="mt-1 font-display text-base font-bold text-ink-900">{a.title}</div>
                      <div className="mt-1 text-sm text-ink-600">{a.body}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]"><Badge tone="earth">{districtById(a.districtId).name}</Badge>{a.cropId && <Badge tone="neutral">{cropById(a.cropId).emoji} {cropById(a.cropId).name}</Badge>}{a.threatId && <Badge tone="neutral">{threatById(a.threatId).name}</Badge>}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!a.acknowledged && <Button size="sm" variant="outline" onClick={() => ackAlert(a.id)}><Check className="h-3.5 w-3.5" /> Acknowledge</Button>}
                    {a.threatId && <Button size="sm" onClick={() => { setSent(false); setCompose(a); }}><Megaphone className="h-3.5 w-3.5" /> Push advisory</Button>}
                    <Link href="/gov/hotspots"><Button size="sm" variant="ghost"><MapPinned className="h-3.5 w-3.5" /> Map</Button></Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="space-y-4">
          <div className="card-surface p-5">
            <div className="font-display font-bold text-ink-900">Escalation rules</div>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-700">
              {[["HIGH cluster", "≥ 30 cases within 15 km, or +20% week-on-week → Joint Director, SMS to growers"], ["Trap threshold", "Pheromone ≥ 8 moths/trap/night, sticky ≥ 20/trap → Taluka officer field visit"], ["Weather trigger", "Humidity > 80% for 48 h with rain → prophylactic advisory to fungal-prone crops"], ["Low confidence", "< 75% AI confidence → expert queue within 4 h"]].map(([k, v]) => (
                <li key={k} className="rounded-xl bg-sand-100 p-3"><div className="text-xs font-bold uppercase tracking-wider text-forest-700">{k}</div><div className="mt-0.5 text-[13px]">{v}</div></li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-5">
            <div className="font-display font-bold text-ink-900">Dispatch log (today)</div>
            <ul className="mt-3 space-y-2 text-sm">
              {[["08:20", "Nashik · Early blight advisory", "2,140 farmers", "SMS + app"], ["07:45", "Jalgaon · PBW mass trapping", "3,860 farmers", "WhatsApp + SMS"], ["06:30", "Sangli · Downy mildew watch", "1,020 farmers", "app"]].map((r) => (
                <li key={r[0]} className="flex items-center gap-3"><span className="font-mono text-xs text-ink-500">{r[0]}</span><span className="flex-1 text-ink-800">{r[1]}</span><span className="inline-flex items-center gap-1 text-xs text-ink-500"><Users className="h-3 w-3" />{r[2]}</span><Badge tone="green" className="text-[10px]">{r[3]}</Badge></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Modal open={!!compose} onClose={() => setCompose(null)} title="Push advisory" size="lg">
        {compose && compose.threatId && (sent ? (
          <div className="py-4 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" /><div className="mt-3 font-display text-lg font-bold text-ink-900">Advisory dispatched</div><div className="mt-1 text-sm text-ink-500">Sent to growers in {districtById(compose.districtId).name} in {LANGS.find((l) => l.id === lang)?.native}. Delivery report in 15 minutes.</div><Button className="mt-4 w-full" onClick={() => { ackAlert(compose.id); setCompose(null); }}>Done</Button></div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><div className="text-sm font-semibold text-ink-900">{threatById(compose.threatId).name} · {compose.cropId ? cropById(compose.cropId).name : ""} · {districtById(compose.districtId).name}</div>
              <div className="inline-flex rounded-full bg-ink-100 p-1">{LANGS.map((l) => <button key={l.id} onClick={() => setLang(l.id)} className={cn("rounded-full px-3 h-7 text-xs font-semibold", lang === l.id ? "bg-white shadow-soft text-forest-900" : "text-ink-500")}>{l.native}</button>)}</div>
            </div>
            <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-ink-100 bg-sand-50 p-4 text-sm text-ink-800 space-y-2 max-h-64 overflow-y-auto">
              <p className="font-semibold">{advisoryFor(compose.threatId, lang).what}</p>
              <ul className="list-disc pl-5 space-y-1">{advisoryFor(compose.threatId, lang).immediate.map((x, i) => <li key={i}>{x}</li>)}</ul>
              <p className="text-xs text-ink-500">{advisoryFor(compose.threatId, lang).expert}</p>
            </motion.div>
            <div className="grid grid-cols-3 gap-2 text-xs">{["SMS (160 char summary)", "WhatsApp (full)", "App push + voice"].map((c) => <label key={c} className="flex items-center gap-2 rounded-xl border border-ink-100 p-2.5"><input type="checkbox" defaultChecked className="accent-forest-700" />{c}</label>)}</div>
            <div className="flex gap-2"><Button variant="ghost" onClick={() => setCompose(null)}>Cancel</Button><Button className="flex-1" onClick={() => setSent(true)}><Send className="h-4 w-4" /> Send to ~{(compose.level === "HIGH" ? 2140 : 1020).toLocaleString("en-IN")} farmers</Button></div>
          </div>
        ))}
      </Modal>
    </GovShell>
  );
}
