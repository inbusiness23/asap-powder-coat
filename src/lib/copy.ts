export const COMPANY = {
  name: "ASAP Fence & Gates",
  wordmark: "ASAP SIGNATURE FENCE",
  shortName: "ASAP Fence",
  phoneDisplay: "(941) 417-8992",
  phoneTel: "+19414178992",
  license: "CBC1266715",
  hours: "Mon–Fri 8–5, Sat by appointment",
  tagline: "Your fence. Built fast. Built to last.",
  googleReviews: { rating: "4.8", count: "460+" },
  financing: "12 months 0% — Wells Fargo & WiseStack",
  workmanship: "1-year workmanship",
  mainSite: "https://asapfenceandgate.com",
  mainSiteLabel: "asapfenceandgate.com",
  locations: [
    {
      name: "Bradenton",
      address: "2219 63rd Avenue East, Bradenton, FL",
    },
    {
      name: "Leesburg",
      address: "2215 Griffin Rd, Leesburg, FL",
    },
  ],
  /** Staff estimator only. Not a public co-brand. */
  vendorContact: "Brian",
} as const;

export const PAGE_H1 = {
  home: "Custom powder coat for gates, frames, and hardware",
  hinges: "Powder-coat hinges as accent hardware",
  dropRods: "Drop rods in a second powder-coat color",
  handles: "Handles powder-coated a color of their own",
  frames: "Frame-accent powder coat, not a full-gate respray",
  pricing: "Staff COST estimator — vendor cost, not customer prices",
  quote: "Get a color quote",
} as const;

export const OFFICIAL_ALUMINUM_COLORS = [
  { id: "black", name: "Black", hex: "#1A1A1A", kind: "official" as const },
  { id: "bronze", name: "Bronze", hex: "#6B4423", kind: "official" as const },
  { id: "white", name: "White", hex: "#F4F1EA", kind: "official" as const },
] as const;

export const EXAMPLE_CUSTOM_ACCENT = {
  id: "lime",
  name: "Lime",
  hex: "#C8F542",
  kind: "example-custom-accent" as const,
} as const;

export const COLOR_SWATCHES = [
  ...OFFICIAL_ALUMINUM_COLORS,
  EXAMPLE_CUSTOM_ACCENT,
] as const;

/** @deprecated use COLOR_SWATCHES */
export const EXAMPLE_SWATCHES = COLOR_SWATCHES;

export const SAFE_FINISH_COPY =
  "Powder is factory-cured and is generally harder than field paint. Outdoor life depends on chemistry, color, prep, and Florida sun and salt. We do not publish a year count for the finish. ASAP workmanship, where it applies, is 1 year — not a lifetime powder warranty. ASAP does not operate a powder plant, ovens, or a sandblast booth.";

export const SWATCH_DISCLAIMER =
  "Black, bronze, and white are ASAP’s official aluminum colors. Lime is an example custom accent only — not a stocked catalog.";
