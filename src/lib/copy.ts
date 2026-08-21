export const COMPANY = {
  name: "ASAP Fence & Gates",
  shortName: "ASAP Fence",
  phoneDisplay: "(941) 417-8992",
  phoneTel: "+19414178992",
  license: "CBC1266715",
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
  vendor: {
    contact: "Brian",
    name: "Coating Application Systems / CAT Sandblasting & Powder Coating",
    shortName: "CAT",
    address: "1851 67th Ave E, Sarasota, FL",
    site: "https://catpowdercoat.com",
    siteLabel: "catpowdercoat.com",
  },
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

export const EXAMPLE_SWATCHES = [
  { id: "black", name: "Black", hex: "#1A1A1A" },
  { id: "bronze", name: "Bronze", hex: "#6B4423" },
  { id: "white", name: "White", hex: "#F4F1EA" },
  { id: "lime", name: "Lime", hex: "#C8F542" },
] as const;

export const SAFE_FINISH_COPY =
  "Powder is factory-cured and is generally harder than field paint. Outdoor life depends on chemistry, color, prep, and Florida sun and salt. We do not publish a year count.";

export const SWATCH_DISCLAIMER =
  "Example colors for visualization only — not a stocked RAL catalog.";
