"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Fingerprint, MapPin, Phone, ShieldCheck, Sprout, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { LogoMark } from "@/components/shared/logo";
import { Particles } from "@/components/shared/particles";
import { useApp } from "@/lib/store/app-store";
import { DEMO_FARMER } from "@/lib/mock/farmers";
import { DISTRICTS, CROPS } from "@/lib/mock/geo";
import { cn } from "@/lib/utils";
import { OnboardingDocuments } from "@/components/farmer/insurance";

export default function FarmerLogin() {
  const { t, login } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"id" | "otp">("id");
  const [id, setId] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const sendOtp = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 700);
  };
  const verify = () => {
    setLoading(true);
    setTimeout(() => { login(mode === "register" && name ? name : undefined); router.replace("/farmer"); }, 800);
  };

  return (
    <div className="min-h-dvh bg-sand-50 sm:bg-sand-200 sm:py-6">
      <div className="relative mx-auto flex min-h-dvh sm:min-h-[calc(100dvh-3rem)] w-full max-w-[440px] flex-col overflow-hidden bg-sand-50 sm:rounded-[2.2rem] sm:border sm:border-ink-200/70 sm:shadow-lift">
        <div className="relative gradient-forest px-6 pt-12 pb-16 text-white overflow-hidden">
          <Particles count={10} color="rgba(255,255,255,0.25)" />
          <div className="relative flex items-center justify-between">
            <LogoMark size={44} />
            <LanguageSwitcher dark compact />
          </div>
          <h1 className="relative mt-8 font-display text-3xl font-bold leading-tight">{mode === "login" ? t.loginTitle : t.register}</h1>
          <p className="relative mt-2 text-sm text-white/75">{t.loginSub}</p>
          <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-semibold"><ShieldCheck className="h-3.5 w-3.5" /> Government of Maharashtra · Unique Farmer ID</div>
        </div>

        <div className="relative -mt-8 flex-1 px-5 pb-8">
          <div className="card-surface p-5">
            <div className="mb-4 inline-flex w-full rounded-2xl bg-ink-100 p-1">
              {(["login", "register"] as const).map((m) => (
                <button key={m} onClick={() => { setMode(m); setStep("id"); }} className={cn("flex-1 h-9 rounded-xl text-sm font-semibold transition-colors", mode === m ? "bg-white shadow-soft text-forest-900" : "text-ink-500")}>{m === "login" ? "Login" : t.register}</button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === "id" ? (
                <motion.div key={mode} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-3">
                  {mode === "register" && (
                    <>
                      <label className="block text-xs font-semibold text-ink-600">{t.name}<div className="relative mt-1"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" /><Input className="pl-10" placeholder="Ramesh Patil" value={name} onChange={(e) => setName(e.target.value)} /></div></label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block text-xs font-semibold text-ink-600">{t.village}<Input className="mt-1" placeholder="Dindori" /></label>
                        <label className="block text-xs font-semibold text-ink-600">{t.district}<Select className="mt-1" defaultValue="nashik">{DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select></label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block text-xs font-semibold text-ink-600">{t.landSize} (ha)<Input className="mt-1" placeholder="2.4" inputMode="decimal" /></label>
                        <label className="block text-xs font-semibold text-ink-600">{t.currentCrop}<Select className="mt-1" defaultValue="tomato">{CROPS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}</Select></label>
                      </div>
                    </>
                  )}
                  {mode === "register" && <OnboardingDocuments />}
                  <label className="block text-xs font-semibold text-ink-600">{mode === "login" ? t.farmerIdOrMobile : t.mobile}
                    <div className="relative mt-1">
                      {mode === "login" ? <Fingerprint className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" /> : <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />}
                      <Input className="pl-10 font-mono tracking-wide" placeholder={mode === "login" ? DEMO_FARMER.id : "98765 43210"} value={id} onChange={(e) => setId(e.target.value)} inputMode="tel" />
                    </div>
                  </label>
                  <Button size="lg" className="w-full" onClick={sendOtp} loading={loading}>{mode === "login" ? t.sendOtp : t.createId} <ArrowRight className="h-4 w-4" /></Button>
                  <button onClick={() => { setId(DEMO_FARMER.id); }} className="w-full text-center text-xs text-forest-700 font-semibold hover:underline">Use demo Farmer ID · {DEMO_FARMER.id}</button>
                </motion.div>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
                  <div className="text-sm text-ink-600">{t.enterOtp} <span className="font-semibold text-ink-900">{id || DEMO_FARMER.mobile}</span></div>
                  <div className="flex justify-between gap-2">
                    {otp.map((v, i) => (
                      <input
                        key={i}
                        autoFocus={i === 0}
                        value={v}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => {
                          const next = [...otp];
                          next[i] = e.target.value.replace(/\D/g, "").slice(-1);
                          setOtp(next);
                          if (next[i] && i < 3) (e.target.nextElementSibling as HTMLInputElement | null)?.focus();
                        }}
                        className="h-14 w-full rounded-2xl border border-ink-200 bg-white text-center font-display text-2xl font-bold text-ink-900 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-200"
                      />
                    ))}
                  </div>
                  <Button size="lg" className="w-full" onClick={verify} loading={loading}>{t.verify} <ArrowRight className="h-4 w-4" /></Button>
                  <button onClick={() => setOtp(["1", "2", "3", "4"])} className="w-full text-center text-xs text-ink-500">{t.demoHint}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] text-ink-500">
            {[{ i: Sprout, l: "Crop diagnosis" }, { i: MapPin, l: "Local alerts" }, { i: ShieldCheck, l: "Expert verified" }].map((x) => {
              const Icon = x.i;
              return <div key={x.l} className="rounded-2xl bg-white/70 border border-ink-100 p-3"><Icon className="mx-auto h-4.5 w-4.5 text-forest-700" /><div className="mt-1 font-medium">{x.l}</div></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
