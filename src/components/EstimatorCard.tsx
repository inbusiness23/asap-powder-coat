"use client";

import { useMemo, useState } from "react";
import {
  CALL_BRIAN,
  estimateStockJob,
  FACT_RATES,
  formatUsd,
  PRICE_LABEL,
  PROPOSED_RATES,
  proposedLimeHardwareExample,
  SELL_POLICY,
  type ColorPath,
} from "@/lib/pricing";

export default function EstimatorCard() {
  const [kind, setKind] = useState<"gate" | "lineal">("gate");
  const [widthFt, setWidthFt] = useState("4");
  const [heightFt, setHeightFt] = useState("6");
  const [linearFeet, setLinearFeet] = useState("20");
  const [widest, setWidest] = useState("2");
  const [colorPath, setColorPath] = useState<ColorPath>("stock-hopper");
  const [recoat, setRecoat] = useState(false);

  const result = useMemo(
    () =>
      estimateStockJob({
        kind,
        widthFt: Number(widthFt) || 0,
        heightFt: Number(heightFt) || 0,
        linearFeet: Number(linearFeet) || 0,
        widestSideInches: Number(widest) || 0,
        colorPath,
        recoat,
      }),
    [kind, widthFt, heightFt, linearFeet, widest, colorPath, recoat]
  );

  const example = proposedLimeHardwareExample();

  return (
    <div
      className="rounded-2xl border-2 border-sky-300 bg-white p-6 shadow-sm"
      data-testid="estimator-card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-cost">COST</span>
        <h2 className="text-xl font-bold text-zinc-900">
          Staff estimator — Brian vendor cost, not sell
        </h2>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Use this card to price <strong>stock</strong> gate / lineal{" "}
        <strong>COST</strong> without a phone call. Figures are ASAP&apos;s
        vendor cost from Brian. They are not customer prices, starting-at
        prices, or ad offers. {SELL_POLICY}
      </p>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-zinc-700">Job type</legend>
        <div className="mt-2 flex gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="kind"
              checked={kind === "gate"}
              onChange={() => setKind("gate")}
              data-testid="estimator-kind-gate"
            />
            Gate leaf ({FACT_RATES.gateSku})
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="kind"
              checked={kind === "lineal"}
              onChange={() => setKind("lineal")}
              data-testid="estimator-kind-lineal"
            />
            Lineal profile ({FACT_RATES.linealSku})
          </label>
        </div>
      </fieldset>

      {kind === "gate" ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="widthFt" className="text-sm font-medium">
              Width (ft)
            </label>
            <input
              id="widthFt"
              data-testid="estimator-width"
              type="number"
              min="0"
              step="0.1"
              value={widthFt}
              onChange={(e) => setWidthFt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="heightFt" className="text-sm font-medium">
              Height (ft)
            </label>
            <input
              id="heightFt"
              data-testid="estimator-height"
              type="number"
              min="0"
              step="0.1"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="linearFeet" className="text-sm font-medium">
              Linear feet
            </label>
            <input
              id="linearFeet"
              data-testid="estimator-lf"
              type="number"
              min="0"
              step="0.1"
              value={linearFeet}
              onChange={(e) => setLinearFeet(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="widest" className="text-sm font-medium">
              Widest side (in)
            </label>
            <input
              id="widest"
              data-testid="estimator-widest"
              type="number"
              min="0"
              step="0.1"
              value={widest}
              onChange={(e) => setWidest(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="colorPath" className="text-sm font-medium">
          Color path
        </label>
        <select
          id="colorPath"
          data-testid="estimator-color-path"
          value={colorPath}
          onChange={(e) => setColorPath(e.target.value as ColorPath)}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        >
          <option value="stock-hopper">Stock hopper color (Proposed $0 adder)</option>
          <option value="tier1-special">Tier 1 special-order solid (Proposed)</option>
          <option value="custom-match">Custom / candy / two-tone — call Brian</option>
          <option value="candy">Candy — call Brian</option>
          <option value="two-tone">Two-tone — call Brian</option>
        </select>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={recoat}
          onChange={(e) => setRecoat(e.target.checked)}
          data-testid="estimator-recoat"
        />
        Recoat / rusty (Proposed blast adder on gate envelopes)
      </label>

      <div className="mt-6 rounded-xl bg-zinc-50 p-4" data-testid="estimator-result">
        {result.callBrian ? (
          <p className="text-lg font-bold text-zinc-900">
            {CALL_BRIAN}
            {result.callBrianReason ? (
              <span className="ml-2 text-sm font-normal text-zinc-600">
                ({result.callBrianReason})
              </span>
            ) : null}
          </p>
        ) : (
          <dl className="space-y-2 text-sm">
            {result.stockCoatCost ? (
              <div className="flex justify-between gap-4">
                <dt>
                  Stock coat COST{" "}
                  <span className="label-cost">{result.stockCoatCost.label}</span>
                </dt>
                <dd className="font-semibold">
                  {formatUsd(result.stockCoatCost.amount)}
                </dd>
              </div>
            ) : null}
            {result.millFinishBlast ? (
              <div className="flex justify-between gap-4">
                <dt>
                  Mill-finish blast{" "}
                  <span className="label-cost">{result.millFinishBlast.label}</span>
                </dt>
                <dd>{formatUsd(result.millFinishBlast.amount)}</dd>
              </div>
            ) : null}
            {result.hopperAdder ? (
              <div className="flex justify-between gap-4">
                <dt>
                  Stock hopper adder{" "}
                  <span className="label-proposed">
                    {result.hopperAdder.label}
                  </span>
                </dt>
                <dd>{formatUsd(result.hopperAdder.amount)}</dd>
              </div>
            ) : null}
            {result.tier1Adder ? (
              <div className="flex justify-between gap-4">
                <dt>
                  Tier 1 special-order adder{" "}
                  <span className="label-proposed">{result.tier1Adder.label}</span>
                </dt>
                <dd>{formatUsd(result.tier1Adder.amount)}</dd>
              </div>
            ) : null}
            {result.recoatBlast ? (
              <div className="flex justify-between gap-4">
                <dt>
                  Recoat blast{" "}
                  <span className="label-proposed">{result.recoatBlast.label}</span>
                </dt>
                <dd>{formatUsd(result.recoatBlast.amount)}</dd>
              </div>
            ) : null}
            {result.vendorCostTotal ? (
              <div className="flex justify-between gap-4 border-t border-zinc-200 pt-2 text-base">
                <dt className="font-bold">
                  Vendor COST total{" "}
                  <span
                    className={
                      result.vendorCostTotal.label === PRICE_LABEL.COST
                        ? "label-cost"
                        : "label-proposed"
                    }
                  >
                    {result.vendorCostTotal.label}
                  </span>
                </dt>
                <dd className="font-bold" data-testid="estimator-cost-total">
                  {formatUsd(result.vendorCostTotal.amount)}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4 text-zinc-500">
              <dt>Customer sell price</dt>
              <dd data-testid="estimator-sell-price">Not set — request quote</dd>
            </div>
          </dl>
        )}
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-zinc-600">
          {result.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-bold text-zinc-900">
          Accent hardware analog{" "}
          <span className="label-proposed">{example.label}</span>
        </p>
        <p className="mt-1 text-sm text-zinc-700">
          {example.pieces.hinges} hinges + {example.pieces.dropRods} drop rod +{" "}
          {example.pieces.handles} handles lime, gate stays {example.gateStays}{" "}
          ≈ {formatUsd(example.approximateTotal)} ({example.sku} lot mid{" "}
          {formatUsd(example.lotFee)}). Industry analog — not Brian, not a
          customer sell price.
        </p>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Color-lot Proposed default {formatUsd(PROPOSED_RATES.colorLotDefault)}{" "}
        (band {formatUsd(PROPOSED_RATES.colorLotBand.min)}–
        {formatUsd(PROPOSED_RATES.colorLotBand.max)}). Same-color hardware on
        the same hang: Proposed {formatUsd(PROPOSED_RATES.sameColorHardwareEach)}{" "}
        each. Wide-profile, custom, candy, match: {CALL_BRIAN}.
      </p>
    </div>
  );
}
