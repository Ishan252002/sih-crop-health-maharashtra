"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, ImagePlus, MapPin, RefreshCcw, Sparkles, Upload } from "lucide-react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { CROPS, DISTRICTS, cropById } from "@/lib/mock/geo";
import { CROP_NAMES, STAGE_NAMES } from "@/lib/i18n/ui";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { Button } from "@/components/ui/button";
import { ScanAnimation } from "@/components/shared/scan-animation";
import { DiagnosisResultCard } from "@/components/farmer/diagnosis-result";
import { simulateDiagnosis, needsExpert, type SampleKey } from "@/lib/ai-mock";
import { weatherFor } from "@/lib/mock/weather";
import { computeRisk } from "@/lib/risk-engine";
import { HOTSPOTS } from "@/lib/mock/hotspots";
import type { CropCase, CropStage, DiagnosisResult } from "@/lib/types";
import { cn, pad } from "@/lib/utils";

type Step = "setup" | "upload" | "scan" | "result";

export default function CheckCrop() {
  const { t, lang, addCase, farmerName, cases } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<Step>("setup");
  const [cropId, setCropId] = useState("tomato");
  const [districtId, setDistrictId] = useState(DEMO_FARMER.districtId);
  const [stage, setStage] = useState<CropStage>("Fruiting");
  const [image, setImage] = useState<string | null>(null);
  const [sample, setSample] = useState<SampleKey>("upload");
  const [imageLabel, setImageLabel] = useState("Uploaded photo");
  const [ai, setAi] = useState<DiagnosisResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const crop = cropById(cropId);
  const weather = weatherFor(districtId);
  const nearby = HOTSPOTS.filter((h) => h.districtId === districtId).reduce((a, h) => a + h.cases, 0);
  const risk = useMemo(() => (ai ? computeRisk({ weather, cropId, stage, threatId: ai.threatId, soil: DEMO_FARMER.soil, localCases: nearby }) : null), [ai, weather, cropId, stage, nearby]);

  const pick = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setSample("upload");
    setImageLabel(file.name);
  };
  const pickSample = (key: SampleKey, src: string, label: string) => {
    setImage(src);
    setSample(key);
    setImageLabel(label);
  };
  const startScan = () => {
    setAi(null);
    setSavedId(null);
    setStep("scan");
  };
  const onScanDone = useCallback(() => {
    setAi(simulateDiagnosis(cropId, sample));
    setStep("result");
  }, [cropId, sample]);

  const save = () => {
    if (!ai || !risk) return;
    const d = DISTRICTS.find((x) => x.id === districtId)!;
    const id = `MH-${d.code}-2026-${pad(500 + cases.filter((c) => c.source === "farmer").length + 1)}`;
    const c: CropCase = {
      id, farmerId: DEMO_FARMER.id, farmerName, village: DEMO_FARMER.village, districtId, cropId, stage,
      image: image!, imageLabel, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      ai, risk: risk.level, riskScore: risk.score, status: needsExpert(ai.confidence) ? "Pending" : "Confirmed",
      expertName: needsExpert(ai.confidence) ? undefined : "Auto-validated (≥75%)",
      followUpDue: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), followUps: [], source: "farmer",
    };
    addCase(c);
    setSavedId(id);
  };

  const goAdvisory = () => {
    if (!ai) return;
    if (!savedId) save();
    router.push(`/farmer/advisory?threat=${ai.threatId}&crop=${cropId}&severity=${ai.severity}`);
  };

  const steps: { id: Step; label: string }[] = [{ id: "setup", label: "Crop" }, { id: "upload", label: "Photo" }, { id: "scan", label: "AI" }, { id: "result", label: "Result" }];
  const idx = steps.findIndex((s) => s.id === step);

  return (
    <FarmerShell title={t.checkMyCrop} back="/farmer" hideNav={step === "scan"}>
      <div className="mb-4 flex items-center gap-1.5">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center gap-1.5">
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors", i < idx ? "bg-forest-600 text-white" : i === idx ? "bg-forest-900 text-white ring-4 ring-forest-100" : "bg-ink-100 text-ink-400")}>{i < idx ? <Check className="h-3 w-3" /> : i + 1}</span>
            <span className={cn("text-[11px] font-semibold", i === idx ? "text-ink-900" : "text-ink-400")}>{s.label}</span>
            {i < steps.length - 1 && <span className={cn("h-px flex-1", i < idx ? "bg-forest-500" : "bg-ink-200")} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">{t.selectCrop}</h2>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {CROPS.map((c) => (
                  <button key={c.id} onClick={() => { setCropId(c.id); setStage(c.stages.includes("Fruiting") ? "Fruiting" : c.stages[1]); }} className={cn("flex flex-col items-center gap-1 rounded-2xl border p-2.5 transition-all", cropId === c.id ? "border-forest-600 bg-forest-50 shadow-glow-green" : "border-ink-100 bg-white hover:border-forest-300")}>
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-[11px] font-semibold text-ink-800 leading-tight text-center">{CROP_NAMES[lang][c.id]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">{t.cropStage}</h2>
              <div className="mt-2 flex gap-1.5 overflow-x-auto hide-scrollbar">
                {crop.stages.map((s) => (
                  <button key={s} onClick={() => setStage(s)} className={cn("shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors", stage === s ? "border-forest-800 bg-forest-800 text-white" : "border-ink-200 bg-white text-ink-700")}>{STAGE_NAMES[lang][s]}</button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">{t.selectLocation}</h2>
              <div className="mt-2 card-surface p-3">
                <div className="flex items-center gap-2 rounded-xl bg-forest-50 px-3 py-2 text-xs text-forest-800"><MapPin className="h-4 w-4" /> GPS: 20.20° N, 73.83° E · {DEMO_FARMER.village}, {DISTRICTS.find((d) => d.id === districtId)?.name}</div>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {DISTRICTS.slice(0, 9).map((d) => (
                    <button key={d.id} onClick={() => setDistrictId(d.id)} className={cn("rounded-xl border px-2 py-2 text-[11.5px] font-semibold transition-colors truncate", districtId === d.id ? "border-forest-800 bg-forest-800 text-white" : "border-ink-100 bg-white text-ink-700")}>{d.name}</button>
                  ))}
                </div>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={() => setStep("upload")}>{t.next} · {CROP_NAMES[lang][cropId]} <Camera className="h-4 w-4" /></Button>
          </motion.div>
        )}

        {step === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="font-display text-lg font-bold text-ink-900">{t.uploadPhoto}</h2>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
            <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
            {image ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-3xl shadow-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Selected crop" className="aspect-[4/3] w-full object-cover" />
                <button onClick={() => setImage(null)} className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-800 shadow-soft"><RefreshCcw className="h-3.5 w-3.5" /> {t.retake}</button>
                <div className="absolute bottom-3 left-3 rounded-lg bg-ink-900/70 px-2 py-1 text-[11px] text-white">{imageLabel}</div>
              </motion.div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) pick(f); }}
                onClick={() => galleryRef.current?.click()}
                className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-forest-300 bg-forest-50/60 text-center transition-colors hover:bg-forest-50"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-forest-700 shadow-soft"><Camera className="h-7 w-7" /></span>
                <div className="font-semibold text-ink-900">{t.takePhoto}</div>
                <div className="text-xs text-ink-500">or drag and drop · JPG, PNG, HEIC</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => fileRef.current?.click()}><Camera className="h-4 w-4" /> {t.takePhoto}</Button>
              <Button variant="outline" onClick={() => galleryRef.current?.click()}><ImagePlus className="h-4 w-4" /> {t.chooseFromGallery}</Button>
            </div>
            <div className="card-surface p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-600"><Sparkles className="h-3.5 w-3.5 text-amber-500" /> {t.useSample}</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => pickSample("tomato-early-blight", "/samples/tomato-early-blight.svg", t.sampleClear)} className={cn("overflow-hidden rounded-xl border text-left transition-all", sample === "tomato-early-blight" && image ? "border-forest-600 ring-2 ring-forest-200" : "border-ink-100")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/samples/tomato-early-blight.svg" alt="" className="aspect-[16/10] w-full object-cover" />
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-ink-800">{t.sampleClear}</div>
                </button>
                <button onClick={() => pickSample("leaf-blurry", "/samples/leaf-blurry.svg", t.sampleBlurry)} className={cn("overflow-hidden rounded-xl border text-left transition-all", sample === "leaf-blurry" && image ? "border-forest-600 ring-2 ring-forest-200" : "border-ink-100")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/samples/leaf-blurry.svg" alt="" className="aspect-[16/10] w-full object-cover" />
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-ink-800">{t.sampleBlurry} <span className="text-amber-600">(→ expert)</span></div>
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep("setup")}>{t.back}</Button>
              <Button size="lg" className="flex-1" disabled={!image} onClick={startScan}><Upload className="h-4 w-4" /> {t.scanNow}</Button>
            </div>
          </motion.div>
        )}

        {step === "scan" && image && (
          <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScanAnimation image={image} onDone={onScanDone} title={t.analyzing} />
          </motion.div>
        )}

        {step === "result" && ai && risk && image && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <DiagnosisResultCard image={image} cropId={cropId} ai={ai} risk={risk.level} riskScore={risk.score} riskExplanation={risk.explanations[lang]} onSave={save} onAdvisory={goAdvisory} saved={!!savedId} />
            {savedId && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-forest-900 p-4 text-white">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-forest-300">{t.reportSaved}</div>
                <div className="mt-0.5 font-mono text-sm">{savedId}</div>
                <div className="mt-1 text-xs text-white/70">{needsExpert(ai.confidence) ? "Sent to expert queue · visible on the government dashboard as Pending" : "Logged to district surveillance · hotspot map updated"}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="glass" className="flex-1" onClick={() => router.push(`/farmer/reports/${savedId}`)}>{t.trackFollowUp}</Button>
                  <Button size="sm" variant="glass" className="flex-1" onClick={() => { setStep("setup"); setImage(null); setAi(null); setSavedId(null); }}>{t.newScan}</Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </FarmerShell>
  );
}
