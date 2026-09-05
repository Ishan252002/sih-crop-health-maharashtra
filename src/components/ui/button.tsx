"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "amber" | "glass";
type Size = "sm" | "md" | "lg" | "xl" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-forest-800 text-white hover:bg-forest-700 shadow-[0_8px_24px_-8px_rgba(11,61,46,0.55)] hover:shadow-[0_12px_28px_-8px_rgba(11,61,46,0.6)] active:translate-y-px",
  secondary: "bg-forest-100 text-forest-900 hover:bg-forest-200",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100",
  outline: "bg-white border border-ink-200 text-ink-800 hover:border-forest-400 hover:text-forest-800",
  danger: "bg-risk-high text-white hover:bg-critical",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
  glass: "glass text-forest-900 hover:bg-white/90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-xl gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-2xl gap-2",
  xl: "h-14 px-7 text-base rounded-2xl gap-2.5",
  icon: "h-10 w-10 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn("inline-flex items-center justify-center font-semibold transition-all duration-200 select-none disabled:opacity-55 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2", variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
});
