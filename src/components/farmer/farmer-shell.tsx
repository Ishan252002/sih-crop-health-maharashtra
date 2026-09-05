"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Home, Sprout, Camera, CloudSun, Lightbulb, FileText, UserRound, ArrowLeft } from "lucide-react";
import { useApp } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { LogoMark } from "@/components/shared/logo";

const NAV = [
  { href: "/farmer", key: "home", icon: Home },
  { href: "/farmer/farm", key: "myFarm", icon: Sprout },
  { href: "/farmer/check", key: "checkMyCrop", icon: Camera, primary: true },
  { href: "/farmer/risk", key: "riskForecast", icon: CloudSun },
  { href: "/farmer/reports", key: "myReports", icon: FileText },
] as const;

export function FarmerShell({ children, title, back, hideNav }: { children: ReactNode; title?: string; back?: string; hideNav?: boolean }) {
  const { t, loggedIn, hydrated } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !loggedIn) router.replace("/farmer/login");
  }, [hydrated, loggedIn, router]);

  return (
    <div className="min-h-dvh bg-sand-50 sm:bg-sand-200 sm:py-6">
      <div className="relative mx-auto flex min-h-dvh sm:min-h-[calc(100dvh-3rem)] w-full max-w-[440px] flex-col bg-sand-50 sm:rounded-[2.2rem] sm:border sm:border-ink-200/70 sm:shadow-lift overflow-hidden">
        <header className="sticky top-0 z-30 glass px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {back ? (
              <Link href={back} className="h-9 w-9 -ml-1 rounded-xl hover:bg-ink-100 flex items-center justify-center text-ink-700" aria-label="Back">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            ) : (
              <LogoMark size={30} />
            )}
            <span className="font-display text-[15px] font-bold text-forest-900 truncate">{title ?? "KrishiRakshak"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher compact />
            <Link href="/farmer/profile" className="h-9 w-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center" aria-label={t.profile}>
              <UserRound className="h-4.5 w-4.5" />
            </Link>
          </div>
        </header>

        <motion.main key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className={cn("flex-1 px-4 pt-4", hideNav ? "pb-8" : "safe-bottom")}>
          {children}
        </motion.main>

        {!hideNav && (
          <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-ink-100 bg-white/90 backdrop-blur-lg px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
            <ul className="grid grid-cols-5 items-end">
              {NAV.map((n) => {
                const active = n.href === "/farmer" ? pathname === "/farmer" : pathname.startsWith(n.href);
                const Icon = n.icon;
                if ("primary" in n && n.primary) {
                  return (
                    <li key={n.href} className="flex justify-center">
                      <Link href={n.href} className="relative -mt-7 flex h-14 w-14 items-center justify-center rounded-2xl gradient-forest text-white shadow-glow-green ring-4 ring-sand-50 transition-transform active:scale-95" aria-label={t[n.key]}>
                        <Icon className="h-6 w-6" />
                        <span className="absolute inset-0 rounded-2xl bg-forest-400/40 animate-pulse-ring" />
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={n.href}>
                    <Link href={n.href} className={cn("flex flex-col items-center gap-1 rounded-xl py-1 text-[10.5px] font-semibold transition-colors", active ? "text-forest-800" : "text-ink-400 hover:text-ink-700")}>
                      <span className={cn("flex h-8 w-11 items-center justify-center rounded-xl transition-colors", active && "bg-forest-100")}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="truncate max-w-[64px]">{t[n.key]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export { Lightbulb };
