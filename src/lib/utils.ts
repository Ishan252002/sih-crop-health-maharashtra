import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

const LOCALES: Record<string, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }, lang: string = "en") {
  return new Date(iso).toLocaleDateString(LOCALES[lang] ?? "en-IN", opts);
}

export interface RelStrings { justNow: string; minAgo: string; hrAgo: string; dayAgo: string; daysAgo: string }

/** Localised relative time. Strings use {n} as the number placeholder. */
export function relativeTimeI18n(iso: string, s: RelStrings) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return s.justNow;
  if (m < 60) return s.minAgo.replace("{n}", String(m));
  const h = Math.round(m / 60);
  if (h < 24) return s.hrAgo.replace("{n}", String(h));
  const d = Math.round(h / 24);
  return (d > 1 ? s.daysAgo : s.dayAgo).replace("{n}", String(d));
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

export function pad(n: number, len = 4) {
  return String(n).padStart(len, "0");
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
