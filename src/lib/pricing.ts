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
  colorLotDefault: 75,
  colorLotBand: { min: 50, max: 150 },
  recoatBlastPerSqft: 3.5,
  sameColorHardwareEach: 10,
  hardwareLotSku: "PC-HW-LOT",
  hardwareLotMid: 100,
  hardwareLotBand: { min: 75, max: 125 },
  hardwareStockEach: {
    hinge: { min: 18, max: 45 },
    dropRod: { min: 15, max: 40 },
    handle: { min: 12, max: 35 },
    latch: { min: 15, max: 40 },
  },
  isCustomerPrice: false,
} as const;

export const CALL_BRIAN = "Call Brian" as const;

export const SELL_POLICY =
  "Sell = request quote until the captain locks a multiplier. Do not invent a customer coat price.";

/** Display string for unlocked sell. No fake dollars. */
export const PROPOSED_SELL_DISPLAY = "Proposed — quote" as const;

export const SELL_INTENT =
  "Premium / bespoke — as much as we can. Not a cheap COST pass-through. Do not show $7 or $3 as a customer price.";

export type ProposedSellPlaceholder = {
  display: typeof PROPOSED_SELL_DISPLAY;
  dollars: null;
  label: typeof PRICE_LABEL.PROPOSED;
  intent: typeof SELL_INTENT;
  isCustomerPrice: false;
  locked: false;
};

export function proposedSellPlaceholder(): ProposedSellPlaceholder {
  return {
    display: PROPOSED_SELL_DISPLAY,
    dollars: null,
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

export type ColorPath =
  | "stock-hopper"
  | "tier1-special"
  | "custom-match"
  | "candy"
  | "two-tone";

export function colorPathNeedsBrian(path: ColorPath): boolean {
  return path === "custom-match" || path === "candy" || path === "two-tone";
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

export type LimeHardwareExample = {
  label: typeof PRICE_LABEL.PROPOSED;
  role: typeof PRICE_ROLE.PROPOSED_ADDER;
  sku: typeof PROPOSED_RATES.hardwareLotSku;
  gateStays: "black";
  accentColor: "lime";
  pieces: { hinges: 4; dropRods: 1; handles: 2 };
  lotFee: number;
  lotBand: { min: number; max: number };
  unitPrices: { hinge: number; dropRod: number; handle: number };
  approximateTotal: number;
  isCustomerPrice: false;
};

/**
 * Staff-only merchandising analog (Proposed): 4 hinges + 1 drop + 2 handles lime,
 * gate stays black ≈ $320. Not Brian. Not a customer sell price.
 */
export function proposedLimeHardwareExample(): LimeHardwareExample {
  const unitPrices = { hinge: 35, dropRod: 30, handle: 25 };
  const pieces = { hinges: 4, dropRods: 1, handles: 2 } as const;
  const lotFee = PROPOSED_RATES.hardwareLotMid;
  const approximateTotal =
    pieces.hinges * unitPrices.hinge +
    pieces.dropRods * unitPrices.dropRod +
    pieces.handles * unitPrices.handle +
    lotFee;

  return {
    label: PRICE_LABEL.PROPOSED,
    role: PRICE_ROLE.PROPOSED_ADDER,
    sku: PROPOSED_RATES.hardwareLotSku,
    gateStays: "black",
    accentColor: "lime",
    pieces,
    lotFee,
    lotBand: PROPOSED_RATES.hardwareLotBand,
    unitPrices,
    approximateTotal,
    isCustomerPrice: false,
  };
}

export type EstimatorInput = {
  kind: "gate" | "lineal";
  widthFt: number;
  heightFt: number;
  linearFeet: number;
  widestSideInches: number;
  colorPath: ColorPath;
  recoat: boolean;
};

export type EstimatorResult = {
  callBrian: boolean;
  callBrianReason?: string;
  stockCoatCost?: LabeledAmount;
  millFinishBlast?: LabeledAmount;
  hopperAdder?: LabeledAmount;
  tier1Adder?: LabeledAmount;
  recoatBlast?: LabeledAmount;
  vendorCostTotal?: LabeledAmount;
  customerSellPrice: null;
  proposedSell: ProposedSellPlaceholder;
  notes: string[];
};

export function estimateStockJob(input: EstimatorInput): EstimatorResult {
  const sellNote = SELL_POLICY;
  const proposedSell = proposedSellPlaceholder();

  if (colorPathNeedsBrian(input.colorPath)) {
    return {
      callBrian: true,
      callBrianReason: "custom-match / candy / two-tone",
      customerSellPrice: null,
      proposedSell,
      notes: [
        "Custom match, candy, or two-tone on one weldment: call to confirm. Do not one-click. We do not publish Brian's fee.",
        sellNote,
        proposedSell.intent,
      ],
    };
  }

  if (input.kind === "lineal") {
    const lineal = stockLinealCoatCost(
      input.linearFeet,
      input.widestSideInches
    );
    if (lineal.callBrian) {
      return {
        callBrian: true,
        callBrianReason: "wide-profile",
        customerSellPrice: null,
        proposedSell,
        notes: [
          `Widest side over ${FACT_RATES.linealMaxWidestInches} in: ${CALL_BRIAN}.`,
          sellNote,
        ],
      };
    }

    const hopperAdder = proposedStockHopperAdder();
    const tier1Adder =
      input.colorPath === "tier1-special"
        ? proposedTier1SpecialOrderAdder(lineal.amount)
        : undefined;
    const notes = [
      `COST (Brian) ${FACT_RATES.linealSku} at $${FACT_RATES.linealStockPerLf.toFixed(2)} / linear ft vendor cost — cut-list sticks, not assembled gates. Not a customer price.`,
      sellNote,
    ];
    if (input.recoat) {
      notes.push(
        "Recoat blast is Proposed per square foot on gate envelopes. For lineal recoats, call Brian."
      );
      return {
        callBrian: true,
        callBrianReason: "lineal-recoat",
        stockCoatCost: lineal,
        customerSellPrice: null,
        proposedSell,
        notes,
      };
    }

    const extra = (tier1Adder?.amount ?? 0) + hopperAdder.amount;
    return {
      callBrian: false,
      stockCoatCost: lineal,
      millFinishBlast: proposedMillFinishBlast(),
      hopperAdder,
      tier1Adder,
      vendorCostTotal: {
        amount: roundMoney(lineal.amount + extra),
        label: extra > 0 ? PRICE_LABEL.PROPOSED : PRICE_LABEL.COST,
        role:
          extra > 0
            ? PRICE_ROLE.PROPOSED_ADDER
            : PRICE_ROLE.VENDOR_COST,
        isCustomerPrice: false,
      },
      customerSellPrice: null,
      proposedSell,
      notes,
    };
  }

  const sqft = envelopeSqft(input.widthFt, input.heightFt, "ft");
  const stockCoatCost = stockGateCoatCost(sqft);
  const millFinishBlast = proposedMillFinishBlast();
  const hopperAdder = proposedStockHopperAdder();
  const tier1Adder =
    input.colorPath === "tier1-special"
      ? proposedTier1SpecialOrderAdder(stockCoatCost.amount)
      : undefined;
  const recoatBlast = input.recoat ? proposedRecoatBlast(sqft) : undefined;

  const extra =
    hopperAdder.amount +
    (tier1Adder?.amount ?? 0) +
    (recoatBlast?.amount ?? 0);

  const notes = [
    `COST (Brian) ${FACT_RATES.gateSku} at $${FACT_RATES.gateStockPerSqft.toFixed(2)} / sq ft vendor cost. Envelope is W × H. Picket gaps are not subtracted. Both faces are not doubled. Not a customer price.`,
    "New mill-finish blast is $0 assumed inside COST (FACT) until Brian says otherwise. ASAP does not operate a blast booth.",
    sellNote,
  ];

  return {
    callBrian: false,
    stockCoatCost,
    millFinishBlast,
    hopperAdder,
    tier1Adder,
    recoatBlast,
    vendorCostTotal: {
      amount: roundMoney(
        stockCoatCost.amount + millFinishBlast.amount + extra
      ),
      label: extra > 0 ? PRICE_LABEL.PROPOSED : PRICE_LABEL.COST,
      role:
        extra > 0 ? PRICE_ROLE.PROPOSED_ADDER : PRICE_ROLE.VENDOR_COST,
      isCustomerPrice: false,
    },
    customerSellPrice: null,
    proposedSell,
    notes,
  };
}
