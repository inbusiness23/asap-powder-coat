export const QUOTE_SKU_OPTIONS = [
  { value: "handle", label: "Handle (accent)" },
  { value: "hinge", label: "Hinge (accent)" },
  { value: "drop-rod", label: "Drop rod (accent)" },
  { value: "latch", label: "Latch (accent)" },
  { value: "frame-accent", label: "Frame accent" },
  { value: "PC-HW-LOT", label: "PC-HW-LOT accent hardware lot" },
  { value: "PC-GATE-STK", label: "PC-GATE-STK full gate (quote path)" },
  { value: "PC-LIN-STK", label: "PC-LIN-STK lineal profile" },
  {
    value: "full-gate-custom",
    label: "Full gate custom color (quote path)",
  },
] as const;

export const QUOTE_COLOR_OPTIONS = [
  { value: "official-black", label: "Official aluminum: black" },
  { value: "official-bronze", label: "Official aluminum: bronze" },
  { value: "official-white", label: "Official aluminum: white" },
  {
    value: "example-lime",
    label: "Lime — example custom accent, not stocked",
  },
  {
    value: "other-custom",
    label: "Other custom accent — call to confirm",
  },
] as const;

export const QUOTE_SKUS = QUOTE_SKU_OPTIONS.map((o) => o.value);
export const QUOTE_COLORS = QUOTE_COLOR_OPTIONS.map((o) => o.value);

export const QUOTE_FIELD_MAX = {
  name: 100,
  phone: 40,
  email: 120,
  address: 200,
  quantity: 80,
  dimensions: 120,
} as const;

export const QUOTE_ALLOWED_KEYS = [
  "name",
  "phone",
  "email",
  "address",
  "sku",
  "color",
  "quantity",
  "dimensions",
  "website",
] as const;

/** Hidden honeypot. Real customers leave this empty. Never sent to ASAP. */
export const QUOTE_HONEYPOT_KEY = "website" as const;

export const QUOTE_MAX_PAYLOAD_CHARS = 1600;

export type QuoteSku = (typeof QUOTE_SKU_OPTIONS)[number]["value"];
export type QuoteColor = (typeof QUOTE_COLOR_OPTIONS)[number]["value"];
