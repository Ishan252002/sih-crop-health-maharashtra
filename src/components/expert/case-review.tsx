"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Brain, Check, CheckCircle2, Clock, Droplets, FlaskConical, History, MapPin, MessageSquareMore, Pencil, Phone, Sprout, ThermometerSun, CloudRain, UserRound, Wind, Sparkles } from "lucide-react";
import type { CropCase, CaseStatus } from "@/lib/types";
import { useApp } from "@/lib/store/app-store";
import { cropById, districtById, threatById, THREATS } from "@/lib/mock/geo";
import { weatherFor } from "@/lib/mock/weather";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { ConfidenceRing } from "@/components/shared/confidence-ring";
import { Badge, RiskBadge, StatusBadge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { SoilNutrients } from "@/components/farmer/soil-nutrients";
import { cn, formatDate, relativeTime } from "@/lib/utils";
import { EXPERT_THRESHOLD } from "@/lib/ai-mock";

type Action = "confirm" | "correct" | "info" | "refer" | null;

export function CaseReview({ c, onDone }: { c: CropCase; onDone?: () => void }) {
  const { setStatus, cases } = useApp();
  const crop = cropById(c.cropId);
  const d = districtById(c.districtId);
  const threat = threatById(c.ai.threatId);
  const weather = weatherFor(c.districtId);
  const [action, setAction] = useState<Action>(null);
  const [corrected, setCorrected] = useState(c.ai.alternatives[0]?.threatId ?? THREATS.find((t) => t.id !== c.ai.threatId)!.id);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const history = useMemo(() => cases.filter((x) => x.farmerId === c.farmerId && x.id !== c.id), [cases, c]);
  const low = c.ai.confidence < EXPERT_THRESHOLD;
  const decided = ["Confirmed", "Corrected", "Referred", "More Info Requested"].includes(c.status);

  const apply = () => {
    const map: Record<Exclude<Action, null>, CaseStatus> = { confirm: "Confirmed", correct: "Corrected", info: "More Info Requested", refer: "Referred" };
    const status = map[action!];
    setStatus(c.id, status, {
      expertName: "Dr. Meera Kulkarni",
      expertNote: note || (action === "confirm" ? "Diagnosis confirmed from lesion morphology and weather context." : action === "correct" ? `Corrected to ${threatById(corrected).name}. Sample added to retraining set.` : action === "info" ? "Please upload leaf underside in daylight and a photo of 3 neighbouring plants." : "Referred to MPKV Rahuri Plant Health Clinic for pathogen isolation."),
      expertThreatId: action === "correct" ? corrected : undefined,
      followUpDue: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
    });
    setToast(action === "correct" ? `Corrected → ${threatById(corrected).name}. This confirmation is queued for model retraining (Nashik ${crop.name} set +1).` : action === "confirm" ? "Confirmed. Advisory unlocked for the farmer and case pushed to district hotspot map." : action === "info" ? "Farmer notified via SMS and app to upload more photos." : "Lab referral created. Sample pickup scheduled through Krishi Sevak.");
    setAction(null);
    setTimeout(() => { setToast(null); onDone?.(); }, 2600);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      {/* Left: image + AI */}
      <div className="space-y-4">
        <div className="card-surface overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-ink-900">{c.id}</span>
              <StatusBadge status={c.status} />
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-500"><Clock className="h-3.5 w-3.5" /> submitted {relativeTime(c.createdAt)}</div>
          </div>
          <div className="relative bg-ink-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt={c.imageLabel} className="aspect-[16/10] w-full object-contain" />
            <div className="absolute bottom-3 left-3 rounded-lg bg-ink-900/70 px-2 py-1 text-[11px] text-white">{c.imageLabel} · {crop.name}</div>
            <div className="absolute right-3 top-3 flex gap-1.5">
              <Badge tone="dark" className="bg-ink-900/70">Original</Badge>
              <Badge tone="dark" className="bg-ink-900/70">Heatmap</Badge>
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr]">
            <ConfidenceRing value={c.ai.confidence} size={112} stroke={10} />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">AI prediction</div>
              <div className="font-display text-2xl font-bold text-ink-900">{threat.name}</div>
              <div className="text-xs italic text-ink-500">{threat.scientific}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone={severityTone(c.ai.severity)}>{c.ai.severity}</Badge>
                <Badge tone="earth">{c.ai.affectedArea}% area</Badge>
                <Badge tone={threat.type === "pest" ? "amber" : "green"}>{threat.type}</Badge>
              </div>
              <div className={cn("mt-3 inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold", low ? "bg-amber-100 text-amber-600" : "bg-forest-100 text-forest-800")}>
                {low ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                AI Confidence: {c.ai.confidence}% → {low ? "Expert Review Required" : "Above threshold, spot check"}
              </div>
            </div>
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2 font-display font-bold text-ink-900"><Brain className="h-4 w-4 text-forest-700" /> AI reasoning and detected symptoms</div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Detected symptoms</div>
              <ul className="mt-1.5 space-y-1.5">{c.ai.symptoms.map((s) => <li key={s} className="flex gap-2 text-sm text-ink-700"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />{s}</li>)}</ul>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Reasoning chain</div>
              <ol className="mt-1.5 space-y-1.5">{c.ai.reasoning.map((r, i) => <li key={i} className="flex gap-2 text-sm text-ink-700"><span className="font-mono text-xs text-ink-400 mt-0.5">{i + 1}</span>{r}</li>)}</ol>
            </div>
          </div>
          {c.ai.alternatives.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Differential (alternatives)</div>
              <div className="mt-1.5 space-y-1.5">
                {[{ threatId: c.ai.threatId, confidence: c.ai.confidence }, ...c.ai.alternatives].map((a) => (
                  <div key={a.threatId} className="flex items-center gap-3 text-sm">
                    <span className="w-36 truncate text-ink-800">{threatById(a.threatId).name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100"><motion.div initial={{ width: 0 }} animate={{ width: `${a.confidence}%` }} transition={{ duration: 0.9 }} className={cn("h-full rounded-full", a.threatId === c.ai.threatId ? "bg-forest-600" : "bg-ink-300")} /></div>
                    <span className="w-10 text-right font-semibold text-ink-700">{a.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3 text-[11px] text-ink-400">
            Demo inference · {c.ai.modelVersion} · inference {c.ai.inferenceMs} ms
          </div>
        </div>
      </div>

      {/* Right: context + actions */}
      <div className="space-y-4">
        <div className="card-surface p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-900 font-display text-sm font-bold text-white">{c.farmerName.split(" ").map((x) => x[0]).join("")}</div>
              <div>
                <div className="font-semibold text-ink-900">{c.farmerName}</div>
                <div className="text-xs text-ink-500 font-mono">{c.farmerId}</div>
              </div>
            </div>
            <a href="tel:+919800000000"><Button size="sm" variant="outline"><Phone className="h-3.5 w-3.5" /> Call</Button></a>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-[11px] text-ink-500 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</div><div className="font-semibold text-ink-900">{c.village}, {d.name}</div></div>
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-[11px] text-ink-500 inline-flex items-center gap-1"><Sprout className="h-3 w-3" /> Crop · stage</div><div className="font-semibold text-ink-900">{crop.emoji} {crop.name} · {c.stage}</div></div>
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-[11px] text-ink-500">Outbreak risk</div><div className="mt-0.5"><RiskBadge level={c.risk} /> <span className="text-xs text-ink-500">{c.riskScore}/100</span></div></div>
            <div className="rounded-xl bg-sand-100 p-3"><div className="text-[11px] text-ink-500">Nearby cases (14 km)</div><div className="font-semibold text-ink-900">{c.districtId === "nashik" ? 36 : c.districtId === "jalgaon" ? 57 : 18} · rising</div></div>
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="font-display font-bold text-ink-900">Weather at submission · {d.name}</div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[{ i: ThermometerSun, v: `${weather.temp}°C`, l: "Temp", c: "text-amber-600 bg-amber-100" }, { i: Droplets, v: `${weather.humidity}%`, l: "Humidity", c: "text-sky-500 bg-sky-100" }, { i: CloudRain, v: `${weather.rain72h} mm`, l: "Rain 72h", c: "text-sky-500 bg-sky-100" }, { i: Wind, v: `${weather.wind} km/h`, l: "Wind", c: "text-ink-600 bg-ink-100" }].map((x) => {
              const Icon = x.i;
              return <div key={x.l} className="rounded-xl border border-ink-100 p-2.5"><span className={cn("mx-auto flex h-8 w-8 items-center justify-center rounded-lg", x.c)}><Icon className="h-4 w-4" /></span><div className="mt-1 text-sm font-bold text-ink-900">{x.v}</div><div className="text-[10.5px] text-ink-500">{x.l}</div></div>;
            })}
          </div>
          <div className="mt-3 rounded-xl bg-sand-100 p-3 text-xs text-ink-600"><span className="font-semibold text-ink-800">Favours {threat.name}:</span> {threat.favours}</div>
        </div>

        <details className="card-surface p-5 group">
          <summary className="flex cursor-pointer items-center justify-between font-display font-bold text-ink-900"><span className="inline-flex items-center gap-2"><FlaskConical className="h-4 w-4 text-earth-700" /> Soil Health Card</span><span className="text-xs text-ink-500 group-open:hidden">expand</span></summary>
          <div className="mt-3"><SoilNutrients soil={DEMO_FARMER.soil} compact /></div>
        </details>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2 font-display font-bold text-ink-900"><History className="h-4 w-4 text-forest-700" /> Previous history</div>
          {history.length === 0 ? <div className="mt-2 text-sm text-ink-500">First report from this farmer.</div> : (
            <ul className="mt-2 divide-y divide-ink-100">
              {history.map((h) => (
                <li key={h.id} className="flex items-center gap-3 py-2 text-sm">
                  <span className="font-mono text-xs text-ink-500">{formatDate(h.createdAt)}</span>
                  <span className="flex-1 truncate text-ink-800">{cropById(h.cropId).name} · {threatById(h.expertThreatId ?? h.ai.threatId).name}</span>
                  <StatusBadge status={h.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className={cn("card-surface p-5", decided && "opacity-90")}>
          <div className="flex items-center justify-between">
            <div className="font-display font-bold text-ink-900">Expert decision</div>
            {decided && c.expertName && <span className="text-xs text-ink-500 inline-flex items-center gap-1"><UserRound className="h-3.5 w-3.5" /> {c.expertName}</span>}
          </div>
          {decided ? (
            <div className="mt-3 rounded-xl bg-forest-50 border border-forest-200 p-3 text-sm text-forest-900">
              <div className="font-semibold">{c.status}{c.expertThreatId ? ` → ${threatById(c.expertThreatId).name}` : ""}</div>
              {c.expertNote && <div className="mt-1 text-ink-700">{c.expertNote}</div>}
              {c.status === "Corrected" && <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700"><Sparkles className="h-3.5 w-3.5" /> Added to retraining set · improves future predictions</div>}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button onClick={() => setAction("confirm")}><Check className="h-4 w-4" /> Confirm Diagnosis</Button>
              <Button variant="outline" onClick={() => setAction("correct")}><Pencil className="h-4 w-4" /> Correct Diagnosis</Button>
              <Button variant="outline" onClick={() => setAction("info")}><MessageSquareMore className="h-4 w-4" /> Request More Info</Button>
              <Button variant="outline" onClick={() => setAction("refer")}><FlaskConical className="h-4 w-4" /> Refer to Laboratory</Button>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!action} onClose={() => setAction(null)} title={action === "confirm" ? "Confirm diagnosis" : action === "correct" ? "Correct diagnosis" : action === "info" ? "Request more information" : "Refer to laboratory"}>
        <div className="space-y-4">
          {action === "confirm" && <div className="rounded-xl bg-forest-50 p-3 text-sm text-forest-900">Confirm <b>{threat.name}</b> ({c.ai.severity}) on {crop.name} for {c.farmerName}. The IPM advisory will be unlocked immediately and the case will be added to the {d.name} hotspot cluster.</div>}
          {action === "correct" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm"><span className="rounded-lg bg-ink-100 px-2 py-1 line-through text-ink-500">{threat.name}</span><span>→</span>
                <Select className="flex-1" value={corrected} onChange={(e) => setCorrected(e.target.value)}>{THREATS.filter((x) => x.id !== c.ai.threatId).map((x) => <option key={x.id} value={x.id}>{x.name} ({x.scientific})</option>)}</Select>
              </div>
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs text-purple-800"><Sparkles className="mr-1 inline h-3.5 w-3.5" /> This correction becomes a labelled field sample. The next model version (CropNet-v2.4) learns from it, improving {threatById(corrected).name} vs {threat.name} discrimination for {d.name} {crop.name} growers.</div>
            </div>
          )}
          {action === "info" && <div className="rounded-xl bg-amber-100/60 p-3 text-sm text-amber-600">The farmer will receive an SMS and in-app request. Suggested: leaf underside in daylight, 3 neighbouring plants, and a wide shot of the plot.</div>}
          {action === "refer" && <div className="rounded-xl bg-sky-100 p-3 text-sm text-sky-500">Refer to <b className="text-ink-900">MPKV Rahuri Plant Health Clinic</b> for pathogen isolation. Sample pickup via Krishi Sevak within 48 h. Turnaround 3–5 days.</div>}
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Note for the farmer and the case record (optional)" className="w-full rounded-xl border border-ink-200 p-3 text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200" />
          <div className="flex gap-2"><Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button><Button className="flex-1" onClick={apply}>Apply decision</Button></div>
        </div>
      </Modal>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 z-[1100] w-[min(92vw,520px)] -translate-x-1/2 rounded-2xl bg-forest-900 p-4 text-sm text-white shadow-lift">
            <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-300" /><div>{toast}</div></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
