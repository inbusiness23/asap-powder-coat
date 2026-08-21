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
