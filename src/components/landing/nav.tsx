"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Smartphone, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Platform" },
  { href: "#impact", label: "Impact" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "glass shadow-soft" : "bg-transparent")}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-xl px-3.5 py-2 text-sm font-medium text-ink-600 hover:text-forest-900 hover:bg-forest-50 transition-colors">{l.label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/gov"><Button variant="outline" size="sm"><LayoutDashboard className="h-4 w-4" /> Government</Button></Link>
          <Link href="/farmer"><Button size="sm"><Smartphone className="h-4 w-4" /> Farmer App</Button></Link>
        </div>
        <button className="md:hidden h-10 w-10 rounded-xl hover:bg-ink-100 flex items-center justify-center" onClick={() => setOpen((o) => !o)} aria-label="Menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass border-t border-ink-100 overflow-hidden">
            <div className="px-4 py-3 flex flex-col gap-1">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-forest-50">{l.label}</a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/gov"><Button variant="outline" className="w-full">Government</Button></Link>
                <Link href="/farmer"><Button className="w-full">Farmer App</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
