import { describe, expect, it } from "vitest";
import {
  CALL_BRIAN,
  envelopeSqft,
  estimateCostVsSell,
  FACT_RATES,
  PRICE_LABEL,
  PRICE_ROLE,
  PROPOSED_SELL,
  proposedHardwareAccentSetSell,
  proposedMillFinishBlast,
  proposedOptionalStockGateSell,
  proposedRecoatBlast,
  proposedSellPlaceholder,
  proposedStockHopperAdder,
  proposedTier1SpecialOrderAdder,
  stockGateCoatCost,
  stockLinealCoatCost,
} from "@/lib/pricing";

describe("pricing helpers", () => {
  it("computes envelope sqft from W×H and does not double faces", () => {
    expect(envelopeSqft(4, 6, "ft")).toBe(24);
    expect(envelopeSqft(48, 72, "in")).toBe(24);
    expect(envelopeSqft(3, 5, "ft")).toBe(15);
  });

  it("does not subtract picket gaps from the envelope", () => {
    expect(envelopeSqft(4, 6, "ft")).toBe(24);
  });
});

describe("FACT rates are vendor COST, not customer price", () => {
  it("locks Brian $7 / $3 as COST vendor rates with isCustomerPrice false", () => {
    expect(FACT_RATES.gateStockPerSqft).toBe(7);
    expect(FACT_RATES.linealStockPerLf).toBe(3);
    expect(FACT_RATES.role).toBe(PRICE_ROLE.VENDOR_COST);
    expect(FACT_RATES.isCustomerPrice).toBe(false);
    expect(FACT_RATES.source).toBe("FACT");
  });

  it("labels stock gate and lineal coats as COST (vendor), not sell", () => {
    const gate = stockGateCoatCost(24);
    expect(gate).toMatchObject({
      amount: 168,
      label: PRICE_LABEL.COST,
      role: PRICE_ROLE.VENDOR_COST,
      sku: "PC-GATE-STK",
      isCustomerPrice: false,
    });
    const lineal = stockLinealCoatCost(10, 3.5);
    expect(lineal).toMatchObject({
      amount: 30,
      label: PRICE_LABEL.COST,
      role: PRICE_ROLE.VENDOR_COST,
      sku: "PC-LIN-STK",
      callBrian: false,
      isCustomerPrice: false,
    });
  });

  it("does not invent a customer sell price on the live COST vs SELL estimator", () => {
    const result = estimateCostVsSell({
      pack: "optional-stock-gate",
      widthFt: 4,
      heightFt: 6,
      linearFeet: 0,
      widestSideInches: 0,
    });
    expect(result.customerSellPrice).toBeNull();
    expect(result.cost.amount).toBe(168);
    expect(result.cost.label).toBe(PRICE_LABEL.COST);
    expect(result.sell.label).toBe(PRICE_LABEL.PROPOSED);
    expect(result.sell.locked).toBe(false);
  });

  it("asks staff to call Brian for wide lineal profiles", () => {
    expect(stockLinealCoatCost(10, 3.51)).toEqual({
      callBrian: true,
      reason: "wide-profile",
      message: CALL_BRIAN,
    });
  });

  it("labels hopper adder, tier-1, and recoat blast as Proposed COST adders", () => {
    expect(proposedStockHopperAdder().label).toBe(PRICE_LABEL.PROPOSED);
    expect(proposedStockHopperAdder().amount).toBe(0);
    expect(proposedStockHopperAdder().isCustomerPrice).toBe(false);
    expect(proposedTier1SpecialOrderAdder(168)).toMatchObject({
      amount: 42,
      label: PRICE_LABEL.PROPOSED,
      isCustomerPrice: false,
    });
    expect(proposedRecoatBlast(10)).toMatchObject({
      amount: 35,
      label: PRICE_LABEL.PROPOSED,
    });
  });

  it("keeps mill-finish blast at $0 inside COST (FACT)", () => {
    expect(proposedMillFinishBlast()).toMatchObject({
      amount: 0,
      label: PRICE_LABEL.COST,
      isCustomerPrice: false,
    });
  });
});

describe("proposed SELL menu (staff only, not locked)", () => {
  it("keeps the staff sell menu Proposed and unlocked", () => {
    const sell = proposedSellPlaceholder();
    expect(sell.display).toBe("Proposed");
    expect(sell.dollars).toBe("staff-menu");
    expect(sell.label).toBe(PRICE_LABEL.PROPOSED);
    expect(sell.isCustomerPrice).toBe(false);
    expect(sell.locked).toBe(false);
    expect(sell.intent.toLowerCase()).toMatch(/premium/);
    expect(sell.intent.toLowerCase()).toMatch(/bespoke/);
  });

  it("prices the hardware accent set at Proposed $695 with floor $495", () => {
    const line = proposedHardwareAccentSetSell();
    expect(line.amount).toBe(695);
    expect(line.floor).toBe(495);
    expect(line.label).toBe(PRICE_LABEL.PROPOSED);
    expect(line.locked).toBe(false);
    expect(line.isCustomerPrice).toBe(false);
    expect(PROPOSED_SELL.hardwareEach).toEqual({
      hinge: 60,
      dropRod: 55,
      handle: 45,
      latch: 45,
      colorLot: 150,
    });
  });

  it("applies full-gate custom min $1,250 and optional stock $14 / sq ft", () => {
    const custom = estimateCostVsSell({
      pack: "full-gate-custom",
      widthFt: 4,
      heightFt: 6,
      linearFeet: 0,
      widestSideInches: 0,
    });
    expect(custom.cost.amount).toBe(168);
    expect(custom.cost.label).toBe(PRICE_LABEL.COST);
    expect(custom.sell.amount).toBe(1250);
    expect(custom.sell.discourage).toBe(true);
    expect(custom.sell.locked).toBe(false);
    expect(custom.customerSellPrice).toBeNull();

    const stock = proposedOptionalStockGateSell(24);
    expect(stock.amount).toBe(336);
    expect(stock.label).toBe(PRICE_LABEL.PROPOSED);
  });

  it("applies frame accent $18 / lf with a $350 minimum", () => {
    const short = estimateCostVsSell({
      pack: "frame-accent",
      widthFt: 0,
      heightFt: 0,
      linearFeet: 10,
      widestSideInches: 2,
    });
    expect(short.cost.amount).toBe(30);
    expect(short.sell.amount).toBe(350);

    const longer = estimateCostVsSell({
      pack: "frame-accent",
      widthFt: 0,
      heightFt: 0,
      linearFeet: 30,
      widestSideInches: 2,
    });
    expect(longer.sell.amount).toBe(540);
  });
});
