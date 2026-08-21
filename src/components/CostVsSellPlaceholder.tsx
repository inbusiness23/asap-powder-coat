import { HardwareViz, type HardwareKind } from "@/components/HardwareViz";
import {
  FACT_RATES,
  formatUsd,
  PRICE_LABEL,
  proposedSellPlaceholder,
  SELL_INTENT,
} from "@/lib/pricing";

const ROWS: {
  item: string;
  kind: HardwareKind;
  cost: string;
}[] = [
  {
    item: "Handle (accent)",
    kind: "handle",
    cost: "No locked Brian COST — not a customer price",
  },
  {
    item: "Hinge (accent)",
    kind: "hinge",
    cost: "No locked Brian COST — not a customer price",
  },
  {
    item: "Drop rod (accent)",
    kind: "drop-rod",
    cost: "No locked Brian COST — not a customer price",
  },
  {
    item: "Latch (accent)",
    kind: "latch",
    cost: "No locked Brian COST — not a customer price",
  },
  {
    item: "Frame accent",
    kind: "frame",
    cost: "No locked Brian COST — not a customer price",
  },
  {
    item: `${FACT_RATES.gateSku} full gate`,
    kind: "frame",
    cost: `${formatUsd(FACT_RATES.gateStockPerSqft)} / sq ft COST (envelope W×H)`,
  },
  {
    item: `${FACT_RATES.linealSku} lineal`,
    kind: "frame",
    cost: `${formatUsd(FACT_RATES.linealStockPerLf)} / lf COST (widest ≤ ${FACT_RATES.linealMaxWidestInches} in)`,
  },
];

export default function CostVsSellPlaceholder() {
  const sell = proposedSellPlaceholder();

  return (
    <section
      className="rounded-2xl border-2 border-brand-dark bg-white p-6"
      data-testid="cost-vs-sell"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-cost">{PRICE_LABEL.COST}</span>
        <span className="text-zinc-400">vs</span>
        <span className="label-proposed">{PRICE_LABEL.PROPOSED}</span>
        <h2 className="text-xl font-bold text-brand-dark">
          COST vs proposed sell (placeholder)
        </h2>
      </div>
      <p className="mt-3 text-sm text-zinc-700">{SELL_INTENT}</p>
      <p className="mt-2 text-sm text-zinc-600">
        Captain has not locked a sell formula. Until the researched sell menu
        lands with sources, sell is{" "}
        <strong data-testid="proposed-sell-display">{sell.display}</strong> — no
        invented markup dollars, not a fact on ads.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
              <th className="py-2 pr-3">Item</th>
              <th className="py-2 pr-3">
                Vendor <span className="label-cost">{PRICE_LABEL.COST}</span>
              </th>
              <th className="py-2">
                Sell{" "}
                <span className="label-proposed">{PRICE_LABEL.PROPOSED}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.item} className="border-b border-zinc-100">
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-3">
                    <HardwareViz
                      kind={row.kind}
                      className="h-12 w-16 flex-shrink-0"
                    />
                    <span className="font-medium text-brand-dark">
                      {row.item}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-3 text-zinc-700">{row.cost}</td>
                <td className="py-3 font-semibold text-zinc-900">
                  {sell.display}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Placeholder only. {sell.intent} Locked: {String(sell.locked)}. Dollars:{" "}
        {sell.dollars === null ? "none" : formatUsd(sell.dollars)}.
      </p>
    </section>
  );
}
