import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b3d2e" />
          <stop offset="1" stopColor="#2f8f6b" />
        </linearGradient>
        <linearGradient id="lg-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#86c65a" />
          <stop offset="1" stopColor="#bfe3d2" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#lg-a)" />
      <path d="M11 27c0-8 6-14 15-15-1 9-7 15-15 15z" fill="url(#lg-b)" />
      <path d="M12 26c3-4 6-7 12-11" stroke="#0b3d2e" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <circle cx="27.5" cy="13.5" r="3.2" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
      <circle cx="27.5" cy="13.5" r="1.1" fill="#fff" />
    </svg>
  );
}

export function Logo({ className, href = "/", dark, subtitle = true }: { className?: string; href?: string; dark?: boolean; subtitle?: boolean }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="leading-tight">
        <span className={cn("block font-display text-[15px] font-bold tracking-tight", dark ? "text-white" : "text-forest-900")}>KrishiRakshak</span>
        {subtitle && <span className={cn("block text-[10.5px] font-medium uppercase tracking-[0.14em]", dark ? "text-white/60" : "text-ink-500")}>Maharashtra Crop Health</span>}
      </span>
    </Link>
  );
}
