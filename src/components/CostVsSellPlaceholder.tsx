import { HardwareViz, type HardwareKind } from "@/components/HardwareViz";
import {
  FACT_RATES,
  formatUsd,
  PRICE_LABEL,
  PROPOSED_SELL,
  SELL_INTENT,
  proposedSellPlaceholder,
} from "@/lib/pricing";

const ROWS: {
  item: string;
  kind: HardwareKind;
  cost: string;
  sell: string;
}[] = [
  {
    item: "Hardware accent set (4 hinges + drop + 2 handles)",
    kind: "handle",
    cost: "No locked Brian COST",
    sell: `${formatUsd(PROPOSED_SELL.hardwareAccentSet.price)} (floor ${formatUsd(PROPOSED_SELL.hardwareAccentSet.floor)})`,
  },
  {
    item: "Frame accent",
    kind: "frame",
    cost: `Lineal COST ${formatUsd(FACT_RATES.linealStockPerLf)} / lf if ≤ ${FACT_RATES.linealMaxWidestInches} in`,
    sell: `${formatUsd(PROPOSED_SELL.frameAccent.perLf)} / lf, min ${formatUsd(PROPOSED_SELL.frameAccent.min)} (floor ${formatUsd(PROPOSED_SELL.frameAccent.floorPerLf)} / lf, min ${formatUsd(PROPOSED_SELL.frameAccent.floorMin)})`,
  },
  {
    item: "Full gate custom color",
    kind: "frame",
    cost: `${formatUsd(FACT_RATES.gateStockPerSqft)} / sq ft COST (envelope W×H)`,
    sell: `${formatUsd(PROPOSED_SELL.fullGateCustom.perSqft)} / sq ft, min ${formatUsd(PROPOSED_SELL.fullGateCustom.minPerLeaf)} / leaf (floor ${formatUsd(PROPOSED_SELL.fullGateCustom.floorPerSqft)}, min ${formatUsd(PROPOSED_SELL.fullGateCustom.floorMin)}) — discourage; quote path`,
  },
  {
    item: "Hinge / drop / handle / latch each",
    kind: "hinge",
    cost: "No locked Brian COST",
    sell: `Hinge ${formatUsd(PROPOSED_SELL.hardwareEach.hinge)}, drop ${formatUsd(PROPOSED_SELL.hardwareEach.dropRod)}, handle ${formatUsd(PROPOSED_SELL.hardwareEach.handle)}, latch ${formatUsd(PROPOSED_SELL.hardwareEach.latch)}, lot ${formatUsd(PROPOSED_SELL.hardwareEach.colorLot)}`,
  },
  {
    item: "Optional stock gate",
    kind: "frame",
    cost: `${formatUsd(FACT_RATES.gateStockPerSqft)} / sq ft COST`,
    sell: `${formatUsd(PROPOSED_SELL.optionalStock.gatePerSqft)} / sq ft`,
  },
  {
    item: "Optional stock lineal",
    kind: "frame",
    cost: `${formatUsd(FACT_RATES.linealStockPerLf)} / lf COST`,
    sell: `${formatUsd(PROPOSED_SELL.optionalStock.linealPerLf)} / lf`,
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
          COST vs proposed SELL
        </h2>
      </div>
      <p className="mt-3 text-sm text-zinc-700">{SELL_INTENT}</p>
      <p className="mt-2 text-sm text-zinc-600">
        Staff menu only. Labelled{" "}
        <strong data-testid="proposed-sell-display">{sell.display}</strong>,
        locked = {String(sell.locked)}. Do not put these dollars on public/ad
        pages.
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
                <td className="py-3 font-semibold text-zinc-900">{row.sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
