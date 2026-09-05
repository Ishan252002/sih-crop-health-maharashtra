import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, align = "left", className, dark }: { eyebrow?: string; title: string; description?: string; align?: "left" | "center"; className?: string; dark?: boolean }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <div className={cn("mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]", dark ? "text-forest-300" : "text-forest-600")}><span className="h-px w-6 bg-current" />{eyebrow}</div>}
      <h2 className={cn("font-display text-3xl sm:text-4xl font-bold tracking-tight", dark ? "text-white" : "text-ink-900")}>{title}</h2>
      {description && <p className={cn("mt-3 text-base sm:text-lg leading-relaxed", dark ? "text-white/70" : "text-ink-500")}>{description}</p>}
    </div>
  );
}

export function PageHeader({ title, description, actions, className }: { title: string; description?: string; actions?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4", className)}>
      <div>
        <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-ink-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
