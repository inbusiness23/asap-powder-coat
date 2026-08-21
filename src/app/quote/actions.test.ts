import { beforeEach, describe, expect, it, vi } from "vitest";
import { deliverPowderCoatLead } from "@/lib/asap-lead";
import { submitQuote } from "@/app/quote/actions";
import { QUOTE_FIELD_MAX, QUOTE_MAX_PAYLOAD_CHARS } from "@/lib/quote-options";

vi.mock("@/lib/asap-lead", async () => {
  const actual = await vi.importActual<typeof import("@/lib/asap-lead")>(
    "@/lib/asap-lead"
  );
  return {
    ...actual,
    deliverPowderCoatLead: vi.fn(),
  };
});

const deliverMock = vi.mocked(deliverPowderCoatLead);

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
}

const valid = {
  name: "Ada",
  phone: "9414178992",
  email: "ada@example.com",
  address: "2219 63rd Avenue East",
  sku: "handle",
  color: "official-black",
  quantity: "2",
  dimensions: "",
};

describe("submitQuote hardening", () => {
  beforeEach(() => {
    deliverMock.mockReset();
  });

  it("rejects unknown sku and color", async () => {
    await expect(
      submitQuote(form({ ...valid, sku: "not-a-sku" }))
    ).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/SKU/i) });
    await expect(
      submitQuote(form({ ...valid, color: "hot-pink" }))
    ).resolves.toMatchObject({
      ok: false,
      error: expect.stringMatching(/color/i),
    });
    expect(deliverMock).not.toHaveBeenCalled();
  });

  it("rejects oversized fields and payloads", async () => {
    const longName = "A".repeat(QUOTE_FIELD_MAX.name + 1);
    await expect(
      submitQuote(form({ ...valid, name: longName }))
    ).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/too long/i) });

    const huge = "B".repeat(QUOTE_MAX_PAYLOAD_CHARS + 1);
    await expect(
      submitQuote(form({ ...valid, dimensions: huge }))
    ).resolves.toMatchObject({
      ok: false,
      error: expect.stringMatching(/too large/i),
    });
    expect(deliverMock).not.toHaveBeenCalled();
  });

  it("rejects unexpected fields", async () => {
    const data = form(valid);
    data.set("extra", "nope");
    await expect(submitQuote(data)).resolves.toMatchObject({
      ok: false,
      error: expect.stringMatching(/Unexpected/i),
    });
  });

  it("returns ok:false when both locked ASAP endpoints reject", async () => {
    deliverMock.mockResolvedValue({ ok: false });
    const result = await submitQuote(form(valid));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/could not store/i);
    expect(result.id).toBeUndefined();
  });

  it("returns ok:true only after the locked lead path succeeds", async () => {
    deliverMock.mockResolvedValue({
      ok: true,
      id: "lp-123",
      via: "lp-lead",
    });
    await expect(submitQuote(form(valid))).resolves.toEqual({
      ok: true,
      id: "lp-123",
    });
  });
});
