"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, MessageCircle, FlaskConical, CalendarCheck, Languages, CheckCircle2 } from "lucide-react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { EXPERTS } from "@/lib/mock/farmers";
import { LANGS } from "@/lib/i18n/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

export default function NearbyExpert() {
  const { t } = useApp();
  const [modal, setModal] = useState<{ kind: "visit" | "lab"; name: string } | null>(null);
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState(1000);
  return (
    <FarmerShell title={t.nearbyExpert} back="/farmer">
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 to-forest-900 p-4 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{t.expertHelp}</div>
          <div className="mt-1 font-display text-xl font-bold">Talk to a plant doctor</div>
          <div className="text-xs text-white/75">Free for registered farmers · KVK, Taluka office, NRC labs</div>
        </div>
        {EXPERTS.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card-surface p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-900 font-display text-sm font-bold text-white">{e.name.replace("Dr. ", "").split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="font-semibold text-ink-900 truncate">{e.name}</span><span className={cn("h-2 w-2 rounded-full", e.available ? "bg-forest-500" : "bg-ink-300")} /></div>
                <div className="text-xs text-ink-500">{e.role} · {e.org}</div>
                <div className="mt-1 flex flex-wrap gap-1">{e.specialisation.map((s) => <Badge key={s} tone="neutral" className="text-[10px]">{s}</Badge>)}</div>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-ink-500">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.distanceKm} {t.away}</span>
                  <span className="inline-flex items-center gap-1"><Languages className="h-3 w-3" /> {e.languages.map((l) => LANGS.find((x) => x.id === l)?.short).join(" · ")}</span>
                  <span className={e.available ? "text-forest-700 font-semibold" : "text-ink-400"}>{e.available ? t.available : t.busy}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <a href={`tel:${e.phone.replace(/\s/g, "")}`}><Button size="sm" className="w-full"><Phone className="h-3.5 w-3.5" /> {t.callExpert}</Button></a>
              <Button size="sm" variant="outline"><MessageCircle className="h-3.5 w-3.5" /> Chat</Button>
              {e.role.includes("Laboratory") ? (
                <Button size="sm" variant="secondary" onClick={() => { setDone(false); setRef(Math.floor(Math.random() * 9000 + 1000)); setModal({ kind: "lab", name: e.name }); }}><FlaskConical className="h-3.5 w-3.5" /> Lab</Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => { setDone(false); setRef(Math.floor(Math.random() * 9000 + 1000)); setModal({ kind: "visit", name: e.name }); }}><CalendarCheck className="h-3.5 w-3.5" /> Visit</Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.kind === "lab" ? t.bookLabTest : t.requestVisit}>
        {done ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" />
            <div className="mt-3 font-display text-lg font-bold text-ink-900">Request sent</div>
            <div className="mt-1 text-sm text-ink-500">{modal?.name} will confirm within 24 hours. Reference: REQ-2026-{ref}</div>
            <Button className="mt-4 w-full" onClick={() => setModal(null)}>{t.done}</Button>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-xs text-ink-500">To</div><div className="font-semibold text-ink-900">{modal?.name}</div></div>
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-xs text-ink-500">Linked case</div><div className="font-semibold text-ink-900">MH-NSK-2026-0398 · Tomato · Early Blight</div></div>
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-xs text-ink-500">Preferred slot</div><div className="font-semibold text-ink-900">Tomorrow, 9:00–11:00 AM</div></div>
            {modal?.kind === "lab" && <div className="rounded-xl bg-amber-100/60 p-3 text-xs text-amber-600">Pack 5 affected leaves in a paper bag, not plastic. Sample pickup available via Krishi Sevak.</div>}
            <Button className="w-full" onClick={() => setDone(true)}>Confirm request</Button>
          </div>
        )}
      </Modal>
    </FarmerShell>
  );
}
