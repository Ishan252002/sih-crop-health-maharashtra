"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ClipboardList, History, LayoutDashboard, Smartphone, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { useApp } from "@/lib/store/app-store";

export function ExpertShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const pathname = usePathname();
  const { cases } = useApp();
  const queue = cases.filter((c) => c.status === "Pending" || c.status === "Under Review").length;
  const nav = [
    { href: "/expert", label: "Review Queue", icon: ClipboardList, badge: queue },
    { href: "/expert/history", label: "Validation History", icon: History },
  ];
  return (
    <div className="min-h-dvh bg-sand-50">
      <header className="sticky top-0 z-30 glass border-b border-ink-100/70">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-16 flex items-center gap-4">
          <Logo href="/expert" subtitle={false} />
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700"><Stethoscope className="h-3.5 w-3.5" /> Expert Console</span>
          <nav className="ml-auto flex items-center gap-1">
            {nav.map((n) => {
              const active = n.href === "/expert" ? pathname === "/expert" || pathname.startsWith("/expert/case") : pathname.startsWith(n.href);
              const Icon = n.icon;
              return (
                <Link key={n.href} href={n.href} className={cn("relative flex items-center gap-2 rounded-xl px-3 h-10 text-sm font-medium transition-colors", active ? "text-forest-900" : "text-ink-500 hover:text-ink-900")}>
                  {active && <motion.span layoutId="expert-nav" className="absolute inset-0 rounded-xl bg-forest-100" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <Icon className="relative h-4.5 w-4.5" />
                  <span className="relative hidden sm:inline">{n.label}</span>
                  {n.badge ? <span className="relative rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{n.badge}</span> : null}
                </Link>
              );
            })}
            <span className="mx-1 h-6 w-px bg-ink-200" />
            <Link href="/gov" className="flex items-center gap-2 rounded-xl px-3 h-10 text-sm font-medium text-ink-500 hover:text-ink-900"><LayoutDashboard className="h-4.5 w-4.5" /><span className="hidden md:inline">Gov Dashboard</span></Link>
            <Link href="/farmer" className="flex items-center gap-2 rounded-xl px-3 h-10 text-sm font-medium text-ink-500 hover:text-ink-900"><Smartphone className="h-4.5 w-4.5" /><span className="hidden md:inline">Farmer App</span></Link>
          </nav>
          <div className="flex items-center gap-2 pl-3 border-l border-ink-100">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-forest-800 text-white text-xs font-bold flex items-center justify-center">MK</div>
            <div className="hidden lg:block leading-tight">
              <div className="text-sm font-semibold text-ink-900">Dr. Meera Kulkarni</div>
              <div className="text-[11px] text-ink-500">Plant Pathologist · KVK Nashik</div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6">
        <div className="mb-5">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
          {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
        <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>{children}</motion.div>
      </main>
    </div>
  );
}
