"use client";

import { Languages } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { LANGS } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function LanguageSwitcher({ className, compact, dark }: { className?: string; compact?: boolean; dark?: boolean }) {
  const { lang, setLang } = useApp();
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full p-1", dark ? "bg-white/10 border border-white/15" : "bg-ink-100", className)} role="group" aria-label="Language">
      {!compact && <Languages className={cn("h-4 w-4 ml-2 mr-1", dark ? "text-white/70" : "text-ink-500")} />}
      {LANGS.map((l) => {
        const active = l.id === lang;
        return (
          <button key={l.id} onClick={() => setLang(l.id)} className={cn("relative h-8 rounded-full px-3 text-sm font-semibold transition-colors", active ? (dark ? "text-forest-900" : "text-forest-900") : dark ? "text-white/75 hover:text-white" : "text-ink-500 hover:text-ink-800")}>
            {active && <motion.span layoutId={`lang-pill-${dark ? "d" : "l"}`} className="absolute inset-0 rounded-full bg-white shadow-soft" transition={{ type: "spring", stiffness: 450, damping: 34 }} />}
            <span className="relative">{compact ? l.short : l.native}</span>
          </button>
        );
      })}
    </div>
  );
}
