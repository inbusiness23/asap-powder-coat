"use client";

import { useMemo, useState } from "react";
import {
  estimateCostVsSell,
  FACT_RATES,
  formatUsd,
  PRICE_LABEL,
  PROPOSED_SELL,
  type StaffPackage,
} from "@/lib/pricing";

const PACKAGES: { id: StaffPackage; label: string; needs: "gate" | "lineal" | "none" }[] =
  [
    {
      id: "hardware-accent-set",
      label: "Hardware accent set (4 hinges + drop + 2 handles)",
      needs: "none",
    },
    { id: "frame-accent", label: "Frame accent", needs: "lineal" },
    {
      id: "full-gate-custom",
      label: "Full gate custom color (discourage — quote path)",
      needs: "gate",
    },
    {
      id: "optional-stock-gate",
      label: "Optional stock gate (Proposed)",
      needs: "gate",
    },
    {
      id: "optional-stock-lineal",
      label: "Optional stock lineal (Proposed)",
      needs: "lineal",
    },
  ];

export default function EstimatorCard() {
  const [pack, setPack] = useState<StaffPackage>("hardware-accent-set");
  const [widthFt, setWidthFt] = useState("4");
  const [heightFt, setHeightFt] = useState("6");
  const [linearFeet, setLinearFeet] = useState("20");
  const [widest, setWidest] = useState("2");

  const needs = PACKAGES.find((p) => p.id === pack)?.needs ?? "none";

  const result = useMemo(
    () =>
      estimateCostVsSell({
        pack,
        widthFt: Number(widthFt) || 0,
        heightFt: Number(heightFt) || 0,
        linearFeet: Number(linearFeet) || 0,
        widestSideInches: Number(widest) || 0,
      }),
    [pack, widthFt, heightFt, linearFeet, widest]
  );

  const each = PROPOSED_SELL.hardwareEach;

  return (
    <div
      className="rounded-2xl border-2 border-sky-300 bg-white p-6 shadow-sm"
      data-testid="estimator-card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-cost">COST</span>
        <span className="text-zinc-400">vs</span>
        <span className="label-proposed">Proposed</span>
        <h2 className="text-xl font-bold text-zinc-900">
          Staff estimator — COST vs proposed SELL
        </h2>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Left column is Brian FACT <strong>COST</strong> ($7 / sq ft gates, $3 /
        lf lineal ≤ 3.5 in). Right column is <strong>Proposed SELL</strong> —
        not locked, not for ads. Public pages stay quote-only.
      </p>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-zinc-700">Package</legend>
        <div className="mt-2 grid gap-2">
          {PACKAGES.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="pack"
                checked={pack === item.id}
                onChange={() => setPack(item.id)}
                data-testid={`estimator-pack-${item.id}`}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      {needs === "gate" ? (
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
      ) : null}

      {needs === "lineal" ? (
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
      ) : null}

      <div
        className="mt-6 grid gap-4 sm:grid-cols-2"
        data-testid="estimator-result"
      >
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
          <p className="label-cost">{PRICE_LABEL.COST}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
            Brian FACT
          </p>
          <p
            className="mt-1 text-2xl font-bold text-zinc-900"
            data-testid="estimator-cost-total"
          >
            {result.cost.display}
          </p>
          <p className="mt-2 text-xs text-zinc-600">{result.cost.detail}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="label-proposed">{result.sell.label}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
            Proposed SELL — not locked
          </p>
          <p
            className="mt-1 text-2xl font-bold text-zinc-900"
            data-testid="estimator-sell-price"
          >
            {result.sell.display}
          </p>
          {result.sell.floor != null ? (
            <p className="text-xs text-zinc-600">
              Floor {formatUsd(result.sell.floor)}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-zinc-600">{result.sell.detail}</p>
          {result.sell.discourage ? (
            <p className="mt-2 text-xs font-semibold text-amber-900">
              Discourage full-gate custom — quote path, not one-click.
            </p>
          ) : null}
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-500" data-testid="estimator-sell-locked">
        Locked: {String(result.sell.locked)}. Customer sell as fact: no.
        {FACT_RATES.gateSku} COST {formatUsd(FACT_RATES.gateStockPerSqft)} / sq
        ft · {FACT_RATES.linealSku} COST {formatUsd(FACT_RATES.linealStockPerLf)}{" "}
        / lf.
      </p>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm">
        <p className="font-bold text-zinc-900">
          Hardware each{" "}
          <span className="label-proposed">{PRICE_LABEL.PROPOSED}</span>
        </p>
        <ul className="mt-2 grid gap-1 text-zinc-700 sm:grid-cols-2">
          <li>Hinge {formatUsd(each.hinge)}</li>
          <li>Drop rod {formatUsd(each.dropRod)}</li>
          <li>Handle {formatUsd(each.handle)}</li>
          <li>Latch {formatUsd(each.latch)}</li>
          <li>Color lot {formatUsd(each.colorLot)}</li>
        </ul>
        <p className="mt-2 text-xs text-zinc-500">
          A-la-carte Proposed SELL, not locked, not Brian COST.
        </p>
      </div>
    </div>
  );
}
