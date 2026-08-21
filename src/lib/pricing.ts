export const PRICE_LABEL = {
  COST: "COST",
  PROPOSED: "Proposed",
} as const;

export type PriceLabel = (typeof PRICE_LABEL)[keyof typeof PRICE_LABEL];

export const PRICE_ROLE = {
  VENDOR_COST: "vendor-cost",
  PROPOSED_ADDER: "proposed-adder",
} as const;

export type PriceRole = (typeof PRICE_ROLE)[keyof typeof PRICE_ROLE];

/**
 * Brian locked vendor COST to ASAP. Not a customer price, not a
 * starting-at, not an ad offer. Do not change without Brian.
 * Fulfillment is vendor-only — not a public co-brand.
 * Sell markup is not invented — customer coat price = request a quote
 * until the captain locks a multiplier.
 */
export const FACT_RATES = {
  gateStockPerSqft: 7.0,
  linealStockPerLf: 3.0,
  linealMaxWidestInches: 3.5,
  millFinishBlastPerSqft: 0,
  gateSku: "PC-GATE-STK",
  linealSku: "PC-LIN-STK",
  source: "FACT",
  role: PRICE_ROLE.VENDOR_COST,
  isCustomerPrice: false,
} as const;

/**
 * Industry-analog numbers. Not Brian. Must display as Proposed.
 * These are not unpublished vendor rates and are not customer sell prices.
 */
export const PROPOSED_RATES = {
  stockHopperRalAdder: 0,
  tier1SpecialOrderPercent: 0.25,
  tier1PercentBand: { min: 0.15, max: 0.35 },
  tier1GateAdderPerSqft: { min: 1.0, max: 2.5 },
  tier1LinealAdderPerLf: { min: 0.45, max: 1.05 },
  recoatBlastPerSqft: 3.5,
  isCustomerPrice: false,
} as const;

export const CALL_BRIAN = "Call Brian" as const;

export const SELL_POLICY =
  "Proposed SELL is staff-only and not locked. Do not use it on ads. Public pages stay quote-only. Do not treat these dollars as fact.";

export const SELL_INTENT =
  "Premium / bespoke — as much as we can. Not a cheap COST pass-through. Do not show $7 or $3 as a customer price.";

/**
 * Staff estimator Proposed SELL menu. Not locked. Not for public/ad pages.
 */
export const PROPOSED_SELL = {
  locked: false,
  label: PRICE_LABEL.PROPOSED,
  isCustomerPrice: false,
  hardwareAccentSet: {
    pieces: { hinges: 4, dropRods: 1, handles: 2 },
    price: 695,
    floor: 495,
  },
  frameAccent: {
    perLf: 18,
    min: 350,
    floorPerLf: 12,
    floorMin: 250,
  },
  fullGateCustom: {
    perSqft: 22,
    minPerLeaf: 1250,
    floorPerSqft: 16,
    floorMin: 850,
    discourage: true,
  },
  hardwareEach: {
    hinge: 60,
    dropRod: 55,
    handle: 45,
    latch: 45,
    colorLot: 150,
  },
  optionalStock: {
    gatePerSqft: 14,
    linealPerLf: 12,
  },
} as const;

export const PROPOSED_SELL_DISPLAY = "Proposed" as const;

export type ProposedSellPlaceholder = {
  display: typeof PROPOSED_SELL_DISPLAY;
  dollars: "staff-menu";
  label: typeof PRICE_LABEL.PROPOSED;
  intent: typeof SELL_INTENT;
  isCustomerPrice: false;
  locked: false;
};

export function proposedSellPlaceholder(): ProposedSellPlaceholder {
  return {
    display: PROPOSED_SELL_DISPLAY,
    dollars: "staff-menu",
    label: PRICE_LABEL.PROPOSED,
    intent: SELL_INTENT,
    isCustomerPrice: false,
    locked: false,
  };
}

export type LengthUnit = "ft" | "in";

export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Leaf envelope area. Uses outer W × H only.
 * Does not subtract picket gaps. Does not ×2 for both faces.
 */
export function envelopeSqft(
  width: number,
  height: number,
  unit: LengthUnit = "ft"
): number {
  if (width <= 0 || height <= 0) return 0;
  const wFt = unit === "in" ? width / 12 : width;
  const hFt = unit === "in" ? height / 12 : height;
  return wFt * hFt;
}

export type LabeledAmount = {
  amount: number;
  label: PriceLabel;
  role: PriceRole;
  source?: "FACT";
  sku?: string;
  isCustomerPrice: false;
};

function vendorCost(
  amount: number,
  sku?: string
): LabeledAmount {
  return {
    amount: roundMoney(amount),
    label: PRICE_LABEL.COST,
    role: PRICE_ROLE.VENDOR_COST,
    source: "FACT",
    sku,
    isCustomerPrice: false,
  };
}

function proposedAdder(amount: number, sku?: string): LabeledAmount {
  return {
    amount: roundMoney(amount),
    label: PRICE_LABEL.PROPOSED,
    role: PRICE_ROLE.PROPOSED_ADDER,
    sku,
    isCustomerPrice: false,
  };
}

export function stockGateCoatCost(sqft: number): LabeledAmount {
  return vendorCost(
    sqft * FACT_RATES.gateStockPerSqft,
    FACT_RATES.gateSku
  );
}

export type LinealCoatResult =
  | (LabeledAmount & { callBrian: false })
  | { callBrian: true; reason: "wide-profile"; message: typeof CALL_BRIAN };

export function stockLinealCoatCost(
  linearFeet: number,
  widestSideInches: number
): LinealCoatResult {
  if (widestSideInches > FACT_RATES.linealMaxWidestInches) {
    return {
      callBrian: true,
      reason: "wide-profile",
      message: CALL_BRIAN,
    };
  }
  return {
    ...vendorCost(
      linearFeet * FACT_RATES.linealStockPerLf,
      FACT_RATES.linealSku
    ),
    callBrian: false,
  };
}

export function proposedStockHopperAdder(): LabeledAmount {
  return proposedAdder(PROPOSED_RATES.stockHopperRalAdder);
}

export function proposedTier1SpecialOrderAdder(
  stockCoatCostAmount: number
): LabeledAmount {
  return proposedAdder(
    stockCoatCostAmount * PROPOSED_RATES.tier1SpecialOrderPercent
  );
}

export function proposedRecoatBlast(sqft: number): LabeledAmount {
  return proposedAdder(sqft * PROPOSED_RATES.recoatBlastPerSqft);
}

export function proposedMillFinishBlast(): LabeledAmount {
  return vendorCost(FACT_RATES.millFinishBlastPerSqft);
}

export type StaffPackage =
  | "hardware-accent-set"
  | "frame-accent"
  | "full-gate-custom"
  | "optional-stock-gate"
  | "optional-stock-lineal";

export type ProposedSellLine = {
  label: typeof PRICE_LABEL.PROPOSED;
  locked: false;
  isCustomerPrice: false;
  amount: number | null;
  floor?: number;
  display: string;
  detail: string;
  discourage?: boolean;
};

export function proposedHardwareAccentSetSell(): ProposedSellLine {
  const { price, floor, pieces } = PROPOSED_SELL.hardwareAccentSet;
  return {
    label: PRICE_LABEL.PROPOSED,
    locked: false,
    isCustomerPrice: false,
    amount: price,
    floor,
    display: formatUsd(price),
    detail: `${pieces.hinges} hinges + ${pieces.dropRods} drop + ${pieces.handles} handles, custom color. Floor ${formatUsd(floor)}. Not locked.`,
  };
}

export function proposedFrameAccentSell(linearFeet: number): ProposedSellLine {
  const { perLf, min, floorPerLf, floorMin } = PROPOSED_SELL.frameAccent;
  const amount = Math.max(roundMoney(linearFeet * perLf), min);
  const floor = Math.max(roundMoney(linearFeet * floorPerLf), floorMin);
  return {
    label: PRICE_LABEL.PROPOSED,
    locked: false,
    isCustomerPrice: false,
    amount,
    floor,
    display: formatUsd(amount),
    detail: `${formatUsd(perLf)} / lf, min ${formatUsd(min)} (floor ${formatUsd(floorPerLf)} / lf, min ${formatUsd(floorMin)}). Not locked.`,
  };
}

export function proposedFullGateCustomSell(sqft: number): ProposedSellLine {
  const { perSqft, minPerLeaf, floorPerSqft, floorMin } =
    PROPOSED_SELL.fullGateCustom;
  const amount = Math.max(roundMoney(sqft * perSqft), minPerLeaf);
  const floor = Math.max(roundMoney(sqft * floorPerSqft), floorMin);
  return {
    label: PRICE_LABEL.PROPOSED,
    locked: false,
    isCustomerPrice: false,
    amount,
    floor,
    display: formatUsd(amount),
    detail: `${formatUsd(perSqft)} / sq ft, min ${formatUsd(minPerLeaf)} / leaf (floor ${formatUsd(floorPerSqft)}, min ${formatUsd(floorMin)}). Discourage — quote path. Not locked.`,
    discourage: true,
  };
}

export function proposedOptionalStockGateSell(sqft: number): ProposedSellLine {
  const amount = roundMoney(sqft * PROPOSED_SELL.optionalStock.gatePerSqft);
  return {
    label: PRICE_LABEL.PROPOSED,
    locked: false,
    isCustomerPrice: false,
    amount,
    display: formatUsd(amount),
    detail: `Optional stock ${formatUsd(PROPOSED_SELL.optionalStock.gatePerSqft)} / sq ft. Still Proposed, not locked.`,
  };
}

export function proposedOptionalStockLinealSell(
  linearFeet: number
): ProposedSellLine {
  const amount = roundMoney(
    linearFeet * PROPOSED_SELL.optionalStock.linealPerLf
  );
  return {
    label: PRICE_LABEL.PROPOSED,
    locked: false,
    isCustomerPrice: false,
    amount,
    display: formatUsd(amount),
    detail: `Optional stock ${formatUsd(PROPOSED_SELL.optionalStock.linealPerLf)} / lf. Still Proposed, not locked.`,
  };
}

export type CostColumn = {
  amount: number | null;
  label: PriceLabel | "n/a";
  display: string;
  detail: string;
  callBrian: boolean;
};

export type CostVsSellResult = {
  pack: StaffPackage;
  cost: CostColumn;
  sell: ProposedSellLine;
  customerSellPrice: null;
};

export function estimateCostVsSell(input: {
  pack: StaffPackage;
  widthFt: number;
  heightFt: number;
  linearFeet: number;
  widestSideInches: number;
}): CostVsSellResult {
  const sqft = envelopeSqft(input.widthFt, input.heightFt, "ft");
  const customerSellPrice = null;

  if (input.pack === "hardware-accent-set") {
    return {
      pack: input.pack,
      cost: {
        amount: null,
        label: "n/a",
        display: "No locked Brian COST",
        detail: "Brian did not lock a hardware piece COST.",
        callBrian: false,
      },
      sell: proposedHardwareAccentSetSell(),
      customerSellPrice,
    };
  }

  if (input.pack === "frame-accent") {
    const lineal = stockLinealCoatCost(
      input.linearFeet,
      input.widestSideInches
    );
    if (lineal.callBrian) {
      return {
        pack: input.pack,
        cost: {
          amount: null,
          label: PRICE_LABEL.COST,
          display: CALL_BRIAN,
          detail: "Widest side over 3.5 in — call Brian for COST.",
          callBrian: true,
        },
        sell: proposedFrameAccentSell(input.linearFeet),
        customerSellPrice,
      };
    }
    return {
      pack: input.pack,
      cost: {
        amount: lineal.amount,
        label: PRICE_LABEL.COST,
        display: formatUsd(lineal.amount),
        detail: `${FACT_RATES.linealSku} ${formatUsd(FACT_RATES.linealStockPerLf)} / lf COST.`,
        callBrian: false,
      },
      sell: proposedFrameAccentSell(input.linearFeet),
      customerSellPrice,
    };
  }

  if (input.pack === "full-gate-custom") {
    const cost = stockGateCoatCost(sqft);
    return {
      pack: input.pack,
      cost: {
        amount: cost.amount,
        label: PRICE_LABEL.COST,
        display: formatUsd(cost.amount),
        detail: `${FACT_RATES.gateSku} ${formatUsd(FACT_RATES.gateStockPerSqft)} / sq ft COST. Envelope W×H.`,
        callBrian: false,
      },
      sell: proposedFullGateCustomSell(sqft),
      customerSellPrice,
    };
  }

  if (input.pack === "optional-stock-lineal") {
    const lineal = stockLinealCoatCost(
      input.linearFeet,
      input.widestSideInches
    );
    if (lineal.callBrian) {
      return {
        pack: input.pack,
        cost: {
          amount: null,
          label: PRICE_LABEL.COST,
          display: CALL_BRIAN,
          detail: "Widest side over 3.5 in — call Brian for COST.",
          callBrian: true,
        },
        sell: proposedOptionalStockLinealSell(input.linearFeet),
        customerSellPrice,
      };
    }
    return {
      pack: input.pack,
      cost: {
        amount: lineal.amount,
        label: PRICE_LABEL.COST,
        display: formatUsd(lineal.amount),
        detail: `${FACT_RATES.linealSku} ${formatUsd(FACT_RATES.linealStockPerLf)} / lf COST.`,
        callBrian: false,
      },
      sell: proposedOptionalStockLinealSell(input.linearFeet),
      customerSellPrice,
    };
  }

  const cost = stockGateCoatCost(sqft);
  return {
    pack: "optional-stock-gate",
    cost: {
      amount: cost.amount,
      label: PRICE_LABEL.COST,
      display: formatUsd(cost.amount),
      detail: `${FACT_RATES.gateSku} ${formatUsd(FACT_RATES.gateStockPerSqft)} / sq ft COST. Envelope W×H.`,
      callBrian: false,
    },
    sell: proposedOptionalStockGateSell(sqft),
    customerSellPrice,
  };
}
