import { afterEach, describe, expect, it } from "vitest";
import {
  QUOTE_THROTTLE,
  checkQuoteGuard,
  resetQuoteThrottleForTests,
} from "@/lib/quote-guard";

describe("quote guard", () => {
  afterEach(() => {
    resetQuoteThrottleForTests();
  });

  it("fails closed when the honeypot is filled", () => {
    const result = checkQuoteGuard({
      honeypot: "http://spam.example",
      ip: "1.1.1.1",
      sessionStamp: null,
      now: 1_000,
    });
    expect(result).toEqual({ ok: false });
  });

  it("fails closed when the session cookie is too fresh", () => {
    const now = 60_000;
    expect(
      checkQuoteGuard({
        honeypot: "",
        ip: "1.1.1.1",
        sessionStamp: now - QUOTE_THROTTLE.sessionMinMs + 1,
        now,
      })
    ).toEqual({ ok: false });
  });

  it("allows a later session after the minimum gap", () => {
    const first = checkQuoteGuard({
      honeypot: "",
      ip: "2.2.2.2",
      sessionStamp: null,
      now: 1_000,
    });
    expect(first.ok).toBe(true);
    const later = checkQuoteGuard({
      honeypot: "",
      ip: "2.2.2.2",
      sessionStamp: 1_000,
      now: 1_000 + QUOTE_THROTTLE.sessionMinMs,
    });
    expect(later.ok).toBe(true);
  });

  it("throttles a coarse per-IP burst and does not count a blocked honeypot", () => {
    const now = 10_000;
    for (let i = 0; i < QUOTE_THROTTLE.ipMax; i += 1) {
      expect(
        checkQuoteGuard({
          honeypot: "",
          ip: "8.8.8.8",
          sessionStamp: null,
          now: now + i,
        }).ok
      ).toBe(true);
    }
    expect(
      checkQuoteGuard({
        honeypot: "",
        ip: "8.8.8.8",
        sessionStamp: null,
        now: now + QUOTE_THROTTLE.ipMax,
      })
    ).toEqual({ ok: false });
    expect(
      checkQuoteGuard({
        honeypot: "bot",
        ip: "9.9.9.9",
        sessionStamp: null,
        now,
      })
    ).toEqual({ ok: false });
    expect(
      checkQuoteGuard({
        honeypot: "",
        ip: "9.9.9.9",
        sessionStamp: null,
        now,
      }).ok
    ).toBe(true);
  });
});
