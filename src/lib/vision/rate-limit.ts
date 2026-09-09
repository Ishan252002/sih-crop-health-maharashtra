/**
 * Minimal in-process rate limiter for /api/analyze-crop.
 *
 * PRODUCTION NOTE: this is per-instance memory. It is adequate for an SIH demo running
 * on a single serverless region, and it is NOT a distributed limiter: each cold start
 * resets the window and each concurrent instance keeps its own counters. A real
 * deployment should replace `hits` with Redis or Upstash and keep this same interface.
 *
 * No dependency, no persistence, no PII: only a coarse client key and timestamps.
 */

const WINDOW_MS = 5 * 60 * 1000;
/** Enough for a judge to try several photos, low enough that a script is stopped quickly. */
const MAX_PER_WINDOW = 10;
/** Guard against unbounded growth if many distinct keys appear. */
const MAX_TRACKED_KEYS = 5000;

const hits = new Map<string, number[]>();

export interface RateLimitVerdict {
  allowed: boolean;
  remaining: number;
  /** Seconds until the caller may retry. Only meaningful when allowed is false. */
  retryAfter: number;
}

/**
 * Derives a coarse client key from proxy headers. This is used for counting only,
 * is never logged in full and is never stored beyond the window.
 */
export function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown";
  return ip;
}

export function checkRateLimit(key: string, now = Date.now()): RateLimitVerdict {
  if (hits.size > MAX_TRACKED_KEYS) hits.clear();

  const cutoff = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    const oldest = recent[0];
    return { allowed: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000)) };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, remaining: MAX_PER_WINDOW - recent.length, retryAfter: 0 };
}

export const RATE_LIMIT = { windowMs: WINDOW_MS, maxPerWindow: MAX_PER_WINDOW };
