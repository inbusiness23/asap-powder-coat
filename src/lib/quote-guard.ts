/**
 * Coarse unauthenticated quote guard. Honeypot + IP/session throttle.
 * Fail closed before POSTing the live ASAP lead API. Not a captcha vendor.
 */

export const QUOTE_GUARD_FAIL =
  "We could not store this request. Please call us instead.";

export const QUOTE_THROTTLE = {
  ipMax: 3,
  ipWindowMs: 15 * 60 * 1000,
  sessionMinMs: 60 * 1000,
} as const;

export const QUOTE_SESSION_COOKIE = "pc_q";

const ipHits = new Map<string, number[]>();

export function resetQuoteThrottleForTests(): void {
  ipHits.clear();
}

type HeaderReader = {
  get(name: string): string | null | undefined;
};

function lastForwardedHop(value: string): string {
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
}

/**
 * Platform-trusted client IP for coarse throttling.
 * Prefer Vercel/Cloudflare connecting-IP headers. If only X-Forwarded-For
 * is present, use the rightmost hop (the one the platform set). Do not use
 * the leftmost hop — callers can spoof it.
 */
export function clientIpFromHeaders(h: HeaderReader): string {
  const real = h.get("x-real-ip")?.trim();
  if (real) return lastForwardedHop(real);

  const cf = h.get("cf-connecting-ip")?.trim();
  if (cf) return lastForwardedHop(cf);

  const vercelFwd = h.get("x-vercel-forwarded-for")?.trim();
  if (vercelFwd) return lastForwardedHop(vercelFwd);

  const forwarded = h.get("x-forwarded-for")?.trim();
  if (forwarded) return lastForwardedHop(forwarded);

  return "unknown";
}

export type QuoteGuardInput = {
  honeypot: string;
  ip: string;
  sessionStamp: number | null;
  now?: number;
};

export type QuoteGuardResult =
  | { ok: true; nextSessionStamp: number }
  | { ok: false };

export function checkQuoteGuard(input: QuoteGuardInput): QuoteGuardResult {
  if (input.honeypot.trim()) {
    return { ok: false };
  }

  const now = input.now ?? Date.now();
  if (
    input.sessionStamp != null &&
    now - input.sessionStamp < QUOTE_THROTTLE.sessionMinMs
  ) {
    return { ok: false };
  }

  const ip = input.ip.trim() || "unknown";
  const windowStart = now - QUOTE_THROTTLE.ipWindowMs;
  const recent = (ipHits.get(ip) ?? []).filter((stamp) => stamp > windowStart);
  if (recent.length >= QUOTE_THROTTLE.ipMax) {
    return { ok: false };
  }

  recent.push(now);
  ipHits.set(ip, recent);
  return { ok: true, nextSessionStamp: now };
}
