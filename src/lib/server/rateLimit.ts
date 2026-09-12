import type { NextRequest } from "next/server";

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const globalForRateLimit = globalThis as typeof globalThis & {
  __edgeCalRateLimitBuckets?: Map<string, Bucket>;
};

const buckets =
  globalForRateLimit.__edgeCalRateLimitBuckets ?? new Map<string, Bucket>();
if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.__edgeCalRateLimitBuckets = buckets;
}

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("x-real-ip")?.trim() ||
    forwarded ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

/**
 * Small in-memory limiter for the invited beta. It is deliberately bounded
 * and fails open across cold starts; replace with a shared store before
 * scaling beyond a single preview/region.
 */
export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const key = `${getClientKey(request)}:${options.limit}:${options.windowMs}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    pruneExpiredBuckets(now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function pruneExpiredBuckets(now: number): void {
  if (buckets.size < 1_000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
