import { afterEach, describe, expect, it } from "vitest";
import {
  QUOTE_THROTTLE,
  checkQuoteGuard,
  clientIpFromHeaders,
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

describe("clientIpFromHeaders", () => {
  function headers(map: Record<string, string>) {
    return {
      get(name: string) {
        return map[name.toLowerCase()] ?? null;
      },
    };
  }

  it("prefers x-real-ip over a spoofed leftmost X-Forwarded-For hop", () => {
    expect(
      clientIpFromHeaders(
        headers({
          "x-forwarded-for": "203.0.113.1, 10.0.0.1",
          "x-real-ip": "198.51.100.20",
        })
      )
    ).toBe("198.51.100.20");
  });

  it("uses cf-connecting-ip when x-real-ip is missing", () => {
    expect(
      clientIpFromHeaders(
        headers({
          "x-forwarded-for": "203.0.113.9, 10.0.0.1",
          "cf-connecting-ip": "198.51.100.30",
        })
      )
    ).toBe("198.51.100.30");
  });

  it("uses the rightmost X-Forwarded-For hop, not the leftmost spoofable hop", () => {
    expect(
      clientIpFromHeaders(
        headers({
          "x-forwarded-for": "203.0.113.1, 203.0.113.2, 198.51.100.40",
        })
      )
    ).toBe("198.51.100.40");
  });

  it("still keys the same IP when a caller rotates the leftmost XFF hop", () => {
    const connecting = "198.51.100.40";
    const first = clientIpFromHeaders(
      headers({ "x-forwarded-for": `203.0.113.11, ${connecting}` })
    );
    const second = clientIpFromHeaders(
      headers({ "x-forwarded-for": `203.0.113.99, ${connecting}` })
    );
    expect(first).toBe(connecting);
    expect(second).toBe(connecting);
  });

  it("does not give a fresh throttle bucket when leftmost XFF rotates", () => {
    const now = 50_000;
    for (let i = 0; i < QUOTE_THROTTLE.ipMax; i += 1) {
      const ip = clientIpFromHeaders(
        headers({
          "x-forwarded-for": `203.0.113.${i}, 198.51.100.40`,
        })
      );
      expect(
        checkQuoteGuard({
          honeypot: "",
          ip,
          sessionStamp: null,
          now: now + i,
        }).ok
      ).toBe(true);
    }
    const ip = clientIpFromHeaders(
      headers({
        "x-forwarded-for": "203.0.113.200, 198.51.100.40",
      })
    );
    expect(
      checkQuoteGuard({
        honeypot: "",
        ip,
        sessionStamp: null,
        now: now + 10,
      })
    ).toEqual({ ok: false });
  });
});
