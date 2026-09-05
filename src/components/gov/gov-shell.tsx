"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Radar, MapPinned, BarChart3, Users, UserCheck, Bell, FileBarChart, Menu, X, Search, Smartphone, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/shared/logo";
import { useApp } from "@/lib/store/app-store";
import { ALERTS } from "@/lib/mock/cases";

const NAV = [
  { href: "/gov", label: "Overview", icon: LayoutDashboard },
  { href: "/gov/surveillance", label: "Surveillance", icon: Radar },
  { href: "/gov/hotspots", label: "Live Hotspots", icon: MapPinned },
  { href: "/gov/analytics", label: "Disease Analytics", icon: BarChart3 },
  { href: "/gov/farmers", label: "Farmers", icon: Users },
  { href: "/gov/validation", label: "Expert Validation", icon: UserCheck },
  { href: "/gov/alerts", label: "Alerts", icon: Bell },
  { href: "/gov/reports", label: "Reports", icon: FileBarChart },
];

export function GovShell({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { cases, ackAlerts } = useApp();
  const pending = cases.filter((c) => c.status === "Pending" || c.status === "Under Review").length;
  const unread = ALERTS.filter((a) => !a.acknowledged && !ackAlerts.includes(a.id)).length;

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <Logo dark href="/gov" />
        <button className="lg:hidden h-9 w-9 rounded-lg hover:bg-white/10 text-white flex items-center justify-center" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
      </div>
      <div className="mx-4 mb-4 rounded-2xl bg-white/8 border border-white/10 p-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-forest-300"><ShieldCheck className="h-3.5 w-3.5" /> Government of Maharashtra</div>
        <div className="mt-1 text-sm font-semibold text-white">Dept. of Agriculture</div>
        <div className="text-xs text-white/60">Surveillance & Planning Cell</div>
      </div>
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map((n) => {
          const active = n.href === "/gov" ? pathname === "/gov" : pathname.startsWith(n.href);
          const Icon = n.icon;
          const badge = n.href === "/gov/validation" ? pending : n.href === "/gov/alerts" ? unread : 0;
          return (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={cn("group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "text-white" : "text-white/65 hover:text-white hover:bg-white/6")}>
              {active && <motion.span layoutId="gov-nav" className="absolute inset-0 rounded-xl bg-white/12 border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <Icon className={cn("relative h-4.5 w-4.5", active ? "text-forest-300" : "text-white/55 group-hover:text-white/85")} />
              <span className="relative">{n.label}</span>
              {badge > 0 && <span className={cn("relative ml-auto rounded-full px-2 py-0.5 text-[10.5px] font-bold", n.href === "/gov/alerts" ? "bg-risk-high text-white" : "bg-amber-500 text-white")}>{badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 space-y-1.5 border-t border-white/10">
        <Link href="/expert" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 hover:text-white hover:bg-white/6 transition-colors">
          <UserCheck className="h-4.5 w-4.5" /> Expert Console <ChevronRight className="ml-auto h-4 w-4" />
        </Link>
        <Link href="/farmer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 hover:text-white hover:bg-white/6 transition-colors">
          <Smartphone className="h-4.5 w-4.5" /> Farmer App <ChevronRight className="ml-auto h-4 w-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-sand-50 lg:flex">
      <aside className="hidden lg:flex lg:w-[264px] lg:shrink-0 lg:flex-col bg-forest-950 sticky top-0 h-dvh">{Sidebar}</aside>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink-900/50" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 320, damping: 32 }} className="absolute left-0 top-0 h-full w-[280px] bg-forest-950">{Sidebar}</motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 glass border-b border-ink-100/70 px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <button className="lg:hidden h-10 w-10 rounded-xl hover:bg-ink-100 flex items-center justify-center" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <div className="lg:hidden"><LogoMark size={30} /></div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink-900 truncate">{title}</h1>
            {subtitle && <p className="text-xs text-ink-500 truncate hidden sm:block">{subtitle}</p>}
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 h-10 w-64 text-sm text-ink-400"><Search className="h-4 w-4" /> Search farmer, case, district…</div>
          <Link href="/gov/alerts" className="relative h-10 w-10 rounded-xl hover:bg-ink-100 flex items-center justify-center text-ink-700" aria-label="Alerts">
            <Bell className="h-5 w-5" />
            {unread > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-risk-high ring-2 ring-white" />}
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-ink-100">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-forest-600 to-forest-900 text-white text-xs font-bold flex items-center justify-center">AK</div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold text-ink-900">A. Kadam</div>
              <div className="text-[11px] text-ink-500">Jt. Director, Plant Protection</div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {actions && <div className="mb-5 flex flex-wrap items-center gap-2">{actions}</div>}
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>{children}</motion.div>
        </main>
      </div>
    </div>
  );
}
