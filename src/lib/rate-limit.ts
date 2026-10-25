/**
 * Small sliding-window rate limiter kept in memory.
 *
 * On Vercel each serverless instance has its own memory, so this limits bursts per instance.
 * For a strict global limit, swap this for Upstash Redis (@upstash/ratelimit) — the call
 * site in app/api/contact/route.ts stays the same.
 */
type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export function rateLimit(key: string, limit: number, windowMs: number, now: number) {
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - bucket.hits[0]!)) / 1000);
    buckets.set(key, bucket);
    return { ok: false as const, retryAfter };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  // Keep memory bounded.
  if (buckets.size > MAX_KEYS) {
    const oldest = buckets.keys().next().value;
    if (oldest) buckets.delete(oldest);
  }
  return { ok: true as const, remaining: limit - bucket.hits.length };
}
