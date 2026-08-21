import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ASAP_CONTACT_URL,
  ASAP_LP_LEAD_URL,
  CONTACT_SOURCE_RETRY,
  LP_SOURCE_RETRY,
  POWDER_COAT,
  contactMessage,
  deliverPowderCoatLead,
  parseCityZip,
  powderCoatUseCase,
} from "@/lib/asap-lead";

const input = {
  name: "Ada",
  phone: "9414178992",
  email: "ada@example.com",
  address: "2219 63rd Avenue East, Bradenton, FL 34203",
  sku: "handle",
  color: "official-black",
  quantity: "2",
  dimensions: "n/a",
};

function jsonResponse(status: number, body = "{}") {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => body,
  };
}

describe("powder-coat address mapping", () => {
  it("pulls city and zip from a comma address without inventing fields", () => {
    expect(parseCityZip(input.address)).toEqual({
      city: "Bradenton",
      zip: "34203",
    });
    expect(powderCoatUseCase(input)).toMatch(/sku=handle/);
    expect(powderCoatUseCase(input)).toMatch(/email=ada@example.com/);
    expect(contactMessage(input)).toMatch(/address=/);
  });
});

describe("deliverPowderCoatLead (mocked fetch only)", () => {
  const fetchImpl = vi.fn();

  beforeEach(() => {
    fetchImpl.mockReset();
  });

  it("POSTs /api/lp/lead with powder-coat on existing keys only", async () => {
    fetchImpl.mockResolvedValue(jsonResponse(200));
    const result = await deliverPowderCoatLead(input, undefined, fetchImpl);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.via).toBe("lp-lead");
      expect(result.id).toBeUndefined();
    }
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as [
      string,
      { method: string; body: string },
    ];
    expect(url).toBe(ASAP_LP_LEAD_URL);
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body) as Record<string, unknown>;
    expect(body).toMatchObject({
      name: "Ada",
      phone: "9414178992",
      service: POWDER_COAT,
      service_type: POWDER_COAT,
      lp_slug: POWDER_COAT,
      source: POWDER_COAT,
      city: "Bradenton",
      zip: "34203",
    });
    expect(String(body.use_case)).toMatch(/sku=handle/);
    expect(body).not.toHaveProperty("ghl");
    expect(body).not.toHaveProperty("webhook");
    expect(Object.keys(body).sort()).toEqual(
      [
        "attribution",
        "city",
        "community",
        "content_variant",
        "geo_key",
        "intent_key",
        "landing_url",
        "lp_slug",
        "name",
        "phone",
        "referrer",
        "service",
        "service_type",
        "source",
        "use_case",
        "user_agent",
        "zip",
      ].sort()
    );
  });

  it("retries lp/lead once with source website-lp if powder-coat is rejected", async () => {
    fetchImpl
      .mockResolvedValueOnce(jsonResponse(400))
      .mockResolvedValueOnce(jsonResponse(200));
    const result = await deliverPowderCoatLead(input, undefined, fetchImpl);
    expect(result.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const second = JSON.parse(
      (fetchImpl.mock.calls[1] as [string, { body: string }])[1].body
    ) as { source: string; service: string; lp_slug: string };
    expect(second.source).toBe(LP_SOURCE_RETRY);
    expect(second.service).toBe(POWDER_COAT);
    expect(second.lp_slug).toBe(POWDER_COAT);
  });

  it("falls back to /api/contact when lp/lead rejects", async () => {
    fetchImpl
      .mockResolvedValueOnce(jsonResponse(400))
      .mockResolvedValueOnce(jsonResponse(500))
      .mockResolvedValueOnce(jsonResponse(200));
    const result = await deliverPowderCoatLead(input, undefined, fetchImpl);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.via).toBe("contact");
    const urls = fetchImpl.mock.calls.map((call) => call[0]);
    expect(urls).toContain(ASAP_CONTACT_URL);
    const contactCall = fetchImpl.mock.calls.find(
      (call) => call[0] === ASAP_CONTACT_URL
    ) as [string, { body: string }];
    const body = JSON.parse(contactCall[1].body) as {
      source: string;
      message: string;
      email: string;
    };
    expect(body.source).toBe(POWDER_COAT);
    expect(body.email).toBe("ada@example.com");
    expect(body.message).toMatch(/sku=handle/);
    expect(body.message).toMatch(/address=/);
  });

  it("retries contact with website-contact-form and a powder-coat message prefix", async () => {
    fetchImpl
      .mockResolvedValueOnce(jsonResponse(400))
      .mockResolvedValueOnce(jsonResponse(400))
      .mockResolvedValueOnce(jsonResponse(400))
      .mockResolvedValueOnce(jsonResponse(200));
    const result = await deliverPowderCoatLead(input, undefined, fetchImpl);
    expect(result.ok).toBe(true);
    const last = JSON.parse(
      (fetchImpl.mock.calls[3] as [string, { body: string }])[1].body
    ) as { source: string; message: string };
    expect(last.source).toBe(CONTACT_SOURCE_RETRY);
    expect(last.message.startsWith(`${POWDER_COAT}. `)).toBe(true);
  });

  it("retries a network blip on lp/lead before falling back", async () => {
    fetchImpl
      .mockRejectedValueOnce(new Error("socket"))
      .mockResolvedValueOnce(jsonResponse(200));
    const result = await deliverPowderCoatLead(input, undefined, fetchImpl);
    expect(result.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[0][0]).toBe(ASAP_LP_LEAD_URL);
    expect(fetchImpl.mock.calls[1][0]).toBe(ASAP_LP_LEAD_URL);
  });

  it("fails closed when both locked endpoints reject", async () => {
    fetchImpl.mockResolvedValue(jsonResponse(400));
    const result = await deliverPowderCoatLead(input, undefined, fetchImpl);
    expect(result).toEqual({ ok: false });
  });

  it("never POSTs GHL, fence booking, or hoaapprovedfence URLs", async () => {
    fetchImpl.mockResolvedValue(jsonResponse(200));
    await deliverPowderCoatLead(input, undefined, fetchImpl);
    const urls = fetchImpl.mock.calls.map((call) => String(call[0]));
    urls.forEach((url) => {
      expect(url).not.toMatch(/gohighlevel/i);
      expect(url).not.toMatch(/GHL/i);
      expect(url).not.toContain("/api/book/estimate");
      expect(url).not.toContain("hoaapprovedfence");
    });
  });

  it("omits id unless the live API body actually returns one", async () => {
    fetchImpl.mockResolvedValueOnce(jsonResponse(200, "{}"));
    const withoutId = await deliverPowderCoatLead(input, undefined, fetchImpl);
    expect(withoutId.ok).toBe(true);
    if (withoutId.ok) expect(withoutId.id).toBeUndefined();

    fetchImpl.mockReset();
    fetchImpl.mockResolvedValueOnce(jsonResponse(200, '{"id":"lead-real-99"}'));
    const withId = await deliverPowderCoatLead(input, undefined, fetchImpl);
    expect(withId).toMatchObject({
      ok: true,
      via: "lp-lead",
      id: "lead-real-99",
    });
  });
});
