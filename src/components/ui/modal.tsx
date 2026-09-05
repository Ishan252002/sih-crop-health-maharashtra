"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({ open, onClose, title, children, className, size = "md" }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-ink-900/45 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={cn("relative w-full bg-white rounded-t-3xl sm:rounded-3xl shadow-lift max-h-[92vh] overflow-y-auto", widths[size], className)}
          >
            {title && (
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink-100 bg-white/90 backdrop-blur px-6 py-4 rounded-t-3xl">
                <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
                <button onClick={onClose} className="h-9 w-9 rounded-xl hover:bg-ink-100 flex items-center justify-center text-ink-500" aria-label="Close">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
