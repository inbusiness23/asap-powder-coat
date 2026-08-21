import { describe, expect, it } from "vitest";
import {
  CALL_BRIAN,
  envelopeSqft,
  estimateStockJob,
  FACT_RATES,
  PRICE_LABEL,
  PRICE_ROLE,
  proposedLimeHardwareExample,
  proposedMillFinishBlast,
  proposedRecoatBlast,
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

  it("does not invent a customer sell price on the stock estimator", () => {
    const result = estimateStockJob({
      kind: "gate",
      widthFt: 4,
      heightFt: 6,
      linearFeet: 0,
      widestSideInches: 0,
      colorPath: "stock-hopper",
      recoat: false,
    });
    expect(result.customerSellPrice).toBeNull();
    expect(result.vendorCostTotal?.amount).toBe(168);
    expect(result.vendorCostTotal?.label).toBe(PRICE_LABEL.COST);
    expect(result.vendorCostTotal?.isCustomerPrice).toBe(false);
    expect(result.notes.join(" ")).toMatch(/Not a customer price/);
  });

  it("asks staff to call Brian for wide lineal profiles", () => {
    expect(stockLinealCoatCost(10, 3.51)).toEqual({
      callBrian: true,
      reason: "wide-profile",
      message: CALL_BRIAN,
    });
  });

  it("labels hopper adder, tier-1, recoat blast, and hardware example as Proposed", () => {
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
    expect(proposedLimeHardwareExample().label).toBe(PRICE_LABEL.PROPOSED);
  });

  it("keeps mill-finish blast at $0 inside COST (FACT)", () => {
    expect(proposedMillFinishBlast()).toMatchObject({
      amount: 0,
      label: PRICE_LABEL.COST,
      isCustomerPrice: false,
    });
  });
});

describe("hardware lot example", () => {
  it("prices 4 hinges + 1 drop + 2 handles lime, gate stays black, at about $320 Proposed (not sell)", () => {
    const example = proposedLimeHardwareExample();
    expect(example.pieces).toEqual({ hinges: 4, dropRods: 1, handles: 2 });
    expect(example.accentColor).toBe("lime");
    expect(example.gateStays).toBe("black");
    expect(example.sku).toBe("PC-HW-LOT");
    expect(example.lotFee).toBe(100);
    expect(example.approximateTotal).toBe(320);
    expect(example.label).toBe(PRICE_LABEL.PROPOSED);
    expect(example.isCustomerPrice).toBe(false);
  });
});
