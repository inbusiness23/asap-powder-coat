export const ASAP_LP_LEAD_URL = "https://asapfenceandgate.com/api/lp/lead";
export const ASAP_CONTACT_URL = "https://asapfenceandgate.com/api/contact";

export const POWDER_COAT = "powder-coat" as const;
export const LP_SOURCE_RETRY = "website-lp" as const;
export const CONTACT_SOURCE_RETRY = "website-contact-form" as const;

const FORBIDDEN_URL_FRAGMENTS = [
  "gohighlevel",
  "GHL_WEBHOOK",
  "/api/book/estimate",
  "hoaapprovedfence",
] as const;

export const LP_LEAD_KEYS = [
  "name",
  "phone",
  "zip",
  "city",
  "community",
  "service_type",
  "service",
  "source",
  "lp_slug",
  "intent_key",
  "geo_key",
  "use_case",
  "content_variant",
  "landing_url",
  "referrer",
  "attribution",
  "user_agent",
] as const;

export const CONTACT_KEYS = [
  "name",
  "phone",
  "email",
  "message",
  "source",
] as const;

export type QuoteLeadInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  sku: string;
  color: string;
  quantity: string;
  dimensions: string;
};

export type LeadContext = {
  landing_url: string;
  referrer: string;
  user_agent: string;
};

export type LeadDelivery =
  | { ok: true; id?: string; via: "lp-lead" | "contact" }
  | { ok: false };

type FetchLike = (
  input: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string }
) => Promise<{
  ok: boolean;
  status: number;
  text(): Promise<string>;
}>;

type PostResult = {
  ok: boolean;
  status: number;
  networkError: boolean;
  id?: string;
};

function assertAllowedUrl(url: string): void {
  const lower = url.toLowerCase();
  FORBIDDEN_URL_FRAGMENTS.forEach((frag) => {
    if (lower.includes(frag.toLowerCase())) {
      throw new Error("Forbidden lead URL");
    }
  });
  if (url !== ASAP_LP_LEAD_URL && url !== ASAP_CONTACT_URL) {
    throw new Error("Lead URL is not the locked ASAP path");
  }
}

export function parseCityZip(address: string): { city: string; zip: string } {
  const zipMatch = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  const zip = zipMatch?.[1] ?? "";
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  let city = "";
  if (parts.length >= 2) {
    const candidate = parts[parts.length - 2] ?? "";
    city = candidate
      .replace(/\b[A-Z]{2}\b/g, "")
      .replace(/\d{5}(?:-\d{4})?/g, "")
      .trim();
  }
  return { city, zip };
}

export function powderCoatUseCase(input: QuoteLeadInput): string {
  return [
    `sku=${input.sku}`,
    `color=${input.color}`,
    `qty=${input.quantity || "n/a"}`,
    `dims=${input.dimensions || "n/a"}`,
    `email=${input.email}`,
    `address=${input.address}`,
  ].join(" ");
}

export function contactMessage(input: QuoteLeadInput): string {
  return powderCoatUseCase(input);
}

function lpLeadBody(
  input: QuoteLeadInput,
  source: typeof POWDER_COAT | typeof LP_SOURCE_RETRY,
  ctx: LeadContext
): Record<(typeof LP_LEAD_KEYS)[number], string | Record<string, never>> {
  const { city, zip } = parseCityZip(input.address);
  return {
    name: input.name,
    phone: input.phone,
    zip,
    city,
    community: "",
    service_type: POWDER_COAT,
    service: POWDER_COAT,
    source,
    lp_slug: POWDER_COAT,
    intent_key: "",
    geo_key: "",
    use_case: powderCoatUseCase(input),
    content_variant: "",
    landing_url: ctx.landing_url,
    referrer: ctx.referrer,
    attribution: {},
    user_agent: ctx.user_agent,
  };
}

function contactBody(
  input: QuoteLeadInput,
  source: typeof POWDER_COAT | typeof CONTACT_SOURCE_RETRY,
  message: string
): Record<(typeof CONTACT_KEYS)[number], string> {
  return {
    name: input.name,
    phone: input.phone,
    email: input.email,
    message,
    source,
  };
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status === 502 || status === 503 || status === 504;
}

function readReturnedId(text: string): string | undefined {
  try {
    const parsed = JSON.parse(text) as { id?: unknown };
    if (typeof parsed?.id === "string" && parsed.id.trim()) {
      return parsed.id.trim();
    }
    if (typeof parsed?.id === "number" && Number.isFinite(parsed.id)) {
      return String(parsed.id);
    }
  } catch {
    // Body is not JSON or has no id — omit rather than fabricate.
  }
  return undefined;
}

function delivered(
  via: "lp-lead" | "contact",
  id?: string
): Extract<LeadDelivery, { ok: true }> {
  return id ? { ok: true, id, via } : { ok: true, via };
}

async function postJson(
  fetchImpl: FetchLike,
  url: string,
  body: unknown
): Promise<PostResult> {
  assertAllowedUrl(url);
  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      networkError: false,
      id: response.ok ? readReturnedId(text) : undefined,
    };
  } catch {
    return { ok: false, status: 0, networkError: true };
  }
}

async function postWithNetworkRetry(
  fetchImpl: FetchLike,
  url: string,
  body: unknown
): Promise<PostResult> {
  const first = await postJson(fetchImpl, url, body);
  if (first.ok) return first;
  if (first.networkError || isRetryableStatus(first.status)) {
    return postJson(fetchImpl, url, body);
  }
  return first;
}

const emptyCtx: LeadContext = {
  landing_url: "",
  referrer: "",
  user_agent: "",
};

/**
 * Locked Firstmate lead path. Not GHL. Not /api/book/estimate.
 * Primary: ASAP /api/lp/lead. Fallback: ASAP /api/contact.
 * If both reject, fail closed.
 */
export async function deliverPowderCoatLead(
  input: QuoteLeadInput,
  ctx: LeadContext = emptyCtx,
  fetchImpl: FetchLike = fetch as FetchLike
): Promise<LeadDelivery> {
  const leadPowder = await postWithNetworkRetry(
    fetchImpl,
    ASAP_LP_LEAD_URL,
    lpLeadBody(input, POWDER_COAT, ctx)
  );
  if (leadPowder.ok) {
    return delivered("lp-lead", leadPowder.id);
  }

  if (leadPowder.status >= 400 && leadPowder.status < 500 && !leadPowder.networkError) {
    const leadRetry = await postWithNetworkRetry(
      fetchImpl,
      ASAP_LP_LEAD_URL,
      lpLeadBody(input, LP_SOURCE_RETRY, ctx)
    );
    if (leadRetry.ok) {
      return delivered("lp-lead", leadRetry.id);
    }
  }

  const message = contactMessage(input);
  const contactPowder = await postWithNetworkRetry(
    fetchImpl,
    ASAP_CONTACT_URL,
    contactBody(input, POWDER_COAT, message)
  );
  if (contactPowder.ok) {
    return delivered("contact", contactPowder.id);
  }

  if (
    contactPowder.status >= 400 &&
    contactPowder.status < 500 &&
    !contactPowder.networkError
  ) {
    const contactRetry = await postWithNetworkRetry(
      fetchImpl,
      ASAP_CONTACT_URL,
      contactBody(
        input,
        CONTACT_SOURCE_RETRY,
        `${POWDER_COAT}. ${message}`
      )
    );
    if (contactRetry.ok) {
      return delivered("contact", contactRetry.id);
    }
  }

  return { ok: false };
}
