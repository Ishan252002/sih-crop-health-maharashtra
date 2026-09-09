"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Camera, Check, ImagePlus, MapPin, RefreshCcw, Sparkles, Upload } from "lucide-react";
import { FarmerShell } from "@/components/farmer/farmer-shell";
import { useApp } from "@/lib/store/app-store";
import { CROPS, DISTRICTS, cropById } from "@/lib/mock/geo";
import { CROP_NAMES, STAGE_NAMES, DISTRICT_NAMES } from "@/lib/i18n/ui";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { Button } from "@/components/ui/button";
import { ScanAnimation } from "@/components/shared/scan-animation";
import { DiagnosisResultCard } from "@/components/farmer/diagnosis-result";
import { AnalysisStages } from "@/components/farmer/analysis-stages";
import { ModelArchitecture } from "@/components/farmer/model-architecture";
import { needsExpert, analyzeDemoSample, manualCrop, DEMO_SAMPLES, DEMO_SAMPLE_ORDER, type DemoSampleId } from "@/lib/ai-mock";
import { analyzeUploadedImage } from "@/lib/vision/prototype";
import { toStoredImage } from "@/lib/image";
import type { AnalysisResult } from "@/lib/vision/types";
import { weatherFor } from "@/lib/mock/weather";
import { computeRisk } from "@/lib/risk-engine";
import { HOTSPOTS } from "@/lib/mock/hotspots";
import type { CropCase, CropIdentification, CropStage, DiagnosisResult } from "@/lib/types";
import { cn, pad } from "@/lib/utils";

type Step = "upload" | "scan" | "identify" | "result";

/** What is loaded on the upload screen. A demo tile carries its id, a real photo carries the File. */
type Source = { kind: "demo"; sampleId: DemoSampleId } | { kind: "upload"; file: File };

const defaultStage = (cropId: string): CropStage => {
  const stages = cropById(cropId).stages;
  return stages.includes("Fruiting") ? "Fruiting" : stages[1];
};

export default function CheckCrop() {
  const { t, tx, lang, addCase, farmerName, cases } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [cropId, setCropId] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropIdentification | null>(null);
  const [pendingCropId, setPendingCropId] = useState("tomato");
  const [districtId, setDistrictId] = useState(DEMO_FARMER.districtId);
  const [stage, setStage] = useState<CropStage>("Fruiting");
  const [image, setImage] = useState<string | null>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  /** Durable copy of an uploaded photo. A blob: URL cannot survive localStorage. */
  const [storedImage, setStoredImage] = useState<string | null>(null);
  const pending = useRef<Promise<AnalysisResult> | null>(null);
  const [imageLabel, setImageLabel] = useState("Uploaded photo");
  const [ai, setAi] = useState<DiagnosisResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const weather = weatherFor(districtId);
  const nearby = HOTSPOTS.filter((h) => h.districtId === districtId).reduce((a, h) => a + h.cases, 0);
  const risk = useMemo(
    () => (ai && cropId ? computeRisk({ weather, cropId, stage, threatId: ai.threatId, soil: DEMO_FARMER.soil, localCases: nearby }) : null),
    [ai, weather, cropId, stage, nearby],
  );

  /** Arbitrary browser upload. Only File metadata is available, never the crop identity. */
  /** On low confidence the picker leads with the crop head's own shortlist, then everything else. */
  const rankedCrops = useMemo(() => {
    const shortlist =
      analysis?.status === "low_confidence"
        ? ([analysis.topGuess, ...analysis.alternatives.map((a) => a.cropId)].filter(Boolean) as string[])
        : [];
    if (shortlist.length === 0) return CROPS;
    const seen = new Set<string>();
    const ranked = shortlist.flatMap((id) => {
      if (seen.has(id)) return [];
      const c = CROPS.find((x) => x.id === id);
      if (!c) return [];
      seen.add(id);
      return [c];
    });
    return [...ranked, ...CROPS.filter((c) => !seen.has(c.id))];
  }, [analysis]);

  /** Real farmer photo. Analysed locally by the prototype path; nothing leaves the device. */
  const pick = (file: File) => {
    if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
    const url = URL.createObjectURL(file);
    setImage(url);
    setSource({ kind: "upload", file });
    setImageLabel(file.name);
    // Downscaled data URL prepared in the background so the saved report keeps its thumbnail.
    setStoredImage(null);
    void toStoredImage(file)
      .then(setStoredImage)
      .catch((err) => console.error("[check-crop] could not build a stored thumbnail:", err));
  };
  /** Built-in demo image. The sample id is passed to the mock crop head, never a filename. */
  const pickSample = (sampleId: DemoSampleId, label: string) => {
    if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
    // Demo tiles are static public paths, already durable.
    setStoredImage(null);
    setImage(DEMO_SAMPLES[sampleId].src);
    setSource({ kind: "demo", sampleId });
    setImageLabel(label);
  };
  const startScan = () => {
    if (!source) return;
    setAnalysis(null);
    // Inference starts now so the scan animation covers it. Both paths are local.
    pending.current =
      source.kind === "upload"
        ? analyzeUploadedImage(source.file, { cropStage: stage, location: districtId })
        : Promise.resolve(analyzeDemoSample(source.sampleId));
    setAi(null);
    setCrop(null);
    setCropId(null);
    setSavedId(null);
    setStep("scan");
  };

  /** Crop head runs first. Below threshold the farmer picks the crop instead of the app guessing. */
  const onScanDone = useCallback(async () => {
    const result = (await pending.current) ?? { status: "error" as const, source: "upload" as const, code: "no_analysis" as const, reason: "No analysis was started" };
    setAnalysis(result);

    if (result.status === "error") {
      console.error(`[check-crop] analysis failed (${result.code}):`, result.reason);
      setCrop(null);
      setStep("identify");
      return;
    }

    if (result.status === "low_confidence") {
      setCrop(null);
      if (result.topGuess) {
        setPendingCropId(result.topGuess);
        setStage(defaultStage(result.topGuess));
      }
      setStep("identify");
      return;
    }

    setCrop(result.crop);
    setCropId(result.crop.cropId);
    setStage(defaultStage(result.crop.cropId));
    setAi(result.diagnosis);
    setStep("result");
  }, []);

  /**
   * Only reachable when the crop head was unsure. For a real photo we deliberately do NOT
   * run a diagnosis here: the model could not read the image, so claiming a disease after
   * the farmer names the crop would be an invention. The case goes to an agronomist instead.
   */
  const confirmManualCrop = () => {
    if (!source) return;
    const identification = manualCrop(pendingCropId);
    setCrop(identification);
    setCropId(pendingCropId);
    router.push(`/farmer/expert?crop=${pendingCropId}&stage=${stage}`);
  };

  const save = () => {
    if (!ai || !risk || !cropId) return;
    const d = DISTRICTS.find((x) => x.id === districtId)!;
    const id = `MH-${d.code}-2026-${pad(500 + cases.filter((c) => c.source === "farmer").length + 1)}`;
    const c: CropCase = {
      id, farmerId: DEMO_FARMER.id, farmerName, village: DEMO_FARMER.village, districtId, cropId, stage,
      image: storedImage ?? image!, imageLabel, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      ai, risk: risk.level, riskScore: risk.score, status: needsExpert(ai.confidence) ? "Pending" : "Confirmed",
      expertName: needsExpert(ai.confidence) ? undefined : "Auto-validated (≥75%)",
      followUpDue: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), followUps: [], source: "farmer",
    };
    addCase(c);
    setSavedId(id);
  };

  const goAdvisory = () => {
    if (!ai || !cropId) return;
    if (!savedId) save();
    router.push(`/farmer/advisory?threat=${ai.threatId}&crop=${cropId}&severity=${ai.severity}`);
  };

  const restart = () => {
    if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
    setStep("upload");
    setStoredImage(null);
    setSource(null);
    setAnalysis(null);
    pending.current = null;
    setImage(null);
    setAi(null);
    setCrop(null);
    setCropId(null);
    setSavedId(null);
  };

  const steps: { id: Step; label: string }[] = [
    { id: "upload", label: t.stepPhoto },
    { id: "scan", label: t.stepAI },
    ...(step === "identify" ? [{ id: "identify" as Step, label: t.stepCrop }] : []),
    { id: "result", label: t.stepResult },
  ];
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
        {step === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="font-display text-lg font-bold text-ink-900">{t.uploadPhoto}</h2>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
            <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
            {image ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-3xl shadow-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={t.uploadedPhoto} className="aspect-[4/3] w-full object-cover" />
                <button onClick={() => setImage(null)} className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-800 shadow-soft"><RefreshCcw className="h-3.5 w-3.5" /> {t.retake}</button>
                <div className="absolute bottom-3 left-3 rounded-lg bg-ink-900/70 px-2 py-1 text-[11px] text-white">{tx(imageLabel)}</div>
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
                <div className="text-xs text-ink-500">{t.dragDrop}</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => fileRef.current?.click()}><Camera className="h-4 w-4" /> {t.takePhoto}</Button>
              <Button variant="outline" onClick={() => galleryRef.current?.click()}><ImagePlus className="h-4 w-4" /> {t.chooseFromGallery}</Button>
            </div>
            <div className="card-surface p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-600"><Sparkles className="h-3.5 w-3.5 text-amber-500" /> {t.useSample}</div>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {DEMO_SAMPLE_ORDER.map((id) => {
                  const ds = DEMO_SAMPLES[id];
                  const label =
                    id === "tomato-early-blight-clear" ? t.sampleClear
                    : id === "tomato-early-blight-lowconf" ? t.sampleBlurry
                    : `${CROP_NAMES[lang][ds.cropId]}, ${t.samplePhoto}`;
                  const storedLabel =
                    id === "tomato-early-blight-clear" ? "Tomato leaf, clear photo"
                    : id === "tomato-early-blight-lowconf" ? "Leaf photo, low light"
                    : `${CROP_NAMES.en[ds.cropId]}, sample photo`;
                  return (
                    <button
                      key={id}
                      onClick={() => pickSample(id, storedLabel)}
                      className={cn("w-[134px] shrink-0 overflow-hidden rounded-xl border text-left transition-all", source?.kind === "demo" && source.sampleId === id && image ? "border-forest-600 ring-2 ring-forest-200" : "border-ink-100")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ds.src} alt="" className="aspect-[16/10] w-full bg-forest-50 object-cover" />
                      <div className="px-2 py-1.5 text-[11px] font-semibold leading-tight text-ink-800">
                        {label}
                        {ds.expertRoute && <span className="block text-amber-600">{t.toExpert}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-ink-500">{t.uploadOwnNote}</p>
            </div>

            <details className="card-surface p-3">
              <summary className="cursor-pointer text-xs font-semibold text-ink-600">{t.farmDetails}</summary>
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-forest-50 px-3 py-2 text-xs text-forest-800"><MapPin className="h-4 w-4" /> {t.gps}: 20.20° N, 73.83° E · {tx(DEMO_FARMER.village)}, {DISTRICT_NAMES[lang][districtId]}</div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {DISTRICTS.slice(0, 9).map((d) => (
                  <button key={d.id} onClick={() => setDistrictId(d.id)} className={cn("rounded-xl border px-2 py-2 text-[11.5px] font-semibold transition-colors truncate", districtId === d.id ? "border-forest-800 bg-forest-800 text-white" : "border-ink-100 bg-white text-ink-700")}>{DISTRICT_NAMES[lang][d.id]}</button>
                ))}
              </div>
            </details>

            <Button size="lg" className="w-full" disabled={!image} onClick={startScan}><Upload className="h-4 w-4" /> {t.scanNow}</Button>
          </motion.div>
        )}

        {step === "scan" && image && (
          <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {demoMode && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-[11px] font-semibold text-ink-600">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> {t.demoModeChip}
              </div>
            )}
            <ScanAnimation image={image} onDone={onScanDone} title={source?.kind === "upload" ? t.analyzingImage : t.analyzing} />
          </motion.div>
        )}

        {step === "identify" && image && analysis && analysis.status !== "ok" && (
          <motion.div key="identify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-100/60 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-soft"><AlertCircle className="h-5 w-5" /></span>
              <div>
                <div className="font-display font-bold text-ink-900">
                  {analysis.status === "error"
                    ? t.detectionUnavailable
                    : analysis.reason === "healthy" ? t.noConditionFound : t.cropNotIdentified}
                </div>
                {analysis.status === "low_confidence" && <div className="mt-0.5 text-xs font-semibold text-amber-600">{t.confidence}: {analysis.confidence}%</div>}
                <p className="mt-1.5 text-[13px] text-ink-700">
                  {analysis.status === "error"
                    ? t.detectionUnavailableHelp
                    : analysis.reason === "healthy" ? t.noConditionFoundHelp : t.cropNotIdentifiedHelp}
                </p>
                {analysis.status === "low_confidence" && analysis.topGuess && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[11.5px] font-semibold text-ink-700 shadow-soft">
                    {t.closestMatch}: {CROP_NAMES[lang][analysis.topGuess]} · {analysis.confidence}%
                  </div>
                )}
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-2 py-1 text-[11.5px] font-semibold text-amber-700">
                  {t.expertReview}
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">{t.selectCropManually}</h2>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {rankedCrops.map((c) => (
                  <button key={c.id} onClick={() => { setPendingCropId(c.id); setStage(defaultStage(c.id)); }} className={cn("flex flex-col items-center gap-1 rounded-2xl border p-2.5 transition-all", pendingCropId === c.id ? "border-forest-600 bg-forest-50 shadow-glow-green" : "border-ink-100 bg-white hover:border-forest-300")}>
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-[11px] font-semibold text-ink-800 leading-tight text-center">{CROP_NAMES[lang][c.id]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">{t.cropStage}</h2>
              <div className="mt-2 flex gap-1.5 overflow-x-auto hide-scrollbar">
                {cropById(pendingCropId).stages.map((s) => (
                  <button key={s} onClick={() => setStage(s)} className={cn("shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors", stage === s ? "border-forest-800 bg-forest-800 text-white" : "border-ink-200 bg-white text-ink-700")}>{STAGE_NAMES[lang][s]}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep("upload")}>{t.back}</Button>
              <Button size="lg" className="flex-1" onClick={confirmManualCrop}>{t.sendToExpert} · {CROP_NAMES[lang][pendingCropId]}</Button>
            </div>
          </motion.div>
        )}

        {step === "result" && ai && risk && image && crop && cropId && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <AnalysisStages ai={ai} crop={crop} stage={stage} onStageChange={setStage} />
            <DiagnosisResultCard image={image} cropId={cropId} ai={ai} risk={risk.level} riskScore={risk.score} riskExplanation={risk.explanations[lang]} onSave={save} onAdvisory={goAdvisory} saved={!!savedId} soil={DEMO_FARMER.soil} stage={stage} />
            <ModelArchitecture />
            {savedId && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-forest-900 p-4 text-white">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-forest-300">{t.reportSaved}</div>
                <div className="mt-0.5 font-mono text-sm">{savedId}</div>
                <div className="mt-1 text-xs text-white/70">{needsExpert(ai.confidence) ? t.sentToExpertQueue : t.loggedToSurveillance}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="glass" className="flex-1" onClick={() => router.push(`/farmer/reports/${savedId}`)}>{t.trackFollowUp}</Button>
                  <Button size="sm" variant="glass" className="flex-1" onClick={restart}>{t.newScan}</Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </FarmerShell>
  );
}
