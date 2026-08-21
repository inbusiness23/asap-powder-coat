import type { Metadata } from "next";
import Link from "next/link";
import EstimatorCard from "@/components/EstimatorCard";
import { COMPANY, PAGE_H1, SAFE_FINISH_COPY } from "@/lib/copy";
import {
  FACT_RATES,
  formatUsd,
  PRICE_LABEL,
  PROPOSED_RATES,
  SELL_POLICY,
} from "@/lib/pricing";

export const metadata: Metadata = { title: PAGE_H1.pricing };

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-amber-300 bg-amber-50">
        <div className="mx-auto max-w-5xl px-4 py-4 text-sm font-semibold text-amber-950">
          Internal / staff page. The dollar figures below are vendor{" "}
          <span className="label-cost">{PRICE_LABEL.COST}</span> (Brian) or{" "}
          <span className="label-proposed">{PRICE_LABEL.PROPOSED}</span>{" "}
          industry analogs. They are not customer prices and must not be used
          in ads.
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {PAGE_H1.pricing}
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-300">
            Staff can price stock gate and lineal <strong>COST</strong> without
            calling {COMPANY.vendor.contact}. Custom / candy / match / wide
            profile: call {COMPANY.vendor.contact}. {SELL_POLICY}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-10 px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
            <p className="label-cost">{PRICE_LABEL.COST}</p>
            <h2 className="mt-3 text-xl font-bold text-zinc-900">
              Brian vendor cost (FACT, locked)
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-800">
              <li>
                {FACT_RATES.gateSku} gates: {formatUsd(FACT_RATES.gateStockPerSqft)}{" "}
                / sq ft COST — leaf envelope W×H, do not subtract picket gaps,
                do not ×2 for both faces.
              </li>
              <li>
                {FACT_RATES.linealSku} lineal, widest side ≤{" "}
                {FACT_RATES.linealMaxWidestInches} in:{" "}
                {formatUsd(FACT_RATES.linealStockPerLf)} / linear ft COST —
                cut-list sticks, not assembled gates.
              </li>
              <li>
                New mill-finish ASAP steel blast: {formatUsd(0)} assumed inside
                COST until Brian says otherwise.
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="label-proposed">{PRICE_LABEL.PROPOSED}</p>
            <h2 className="mt-3 text-xl font-bold text-zinc-900">
              Industry adders (not Brian, not sell)
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-800">
              <li>
                Stock hopper / RAL: {formatUsd(PROPOSED_RATES.stockHopperRalAdder)}{" "}
                adder.
              </li>
              <li>
                Tier 1 special-order solid: +
                {PROPOSED_RATES.tier1SpecialOrderPercent * 100}% of stock COST
                coat (mid of {PROPOSED_RATES.tier1PercentBand.min * 100}–
                {PROPOSED_RATES.tier1PercentBand.max * 100}%) or +
                {formatUsd(PROPOSED_RATES.tier1GateAdderPerSqft.min)}–
                {formatUsd(PROPOSED_RATES.tier1GateAdderPerSqft.max)}/sq ft gate
                / +{formatUsd(PROPOSED_RATES.tier1LinealAdderPerLf.min)}–
                {formatUsd(PROPOSED_RATES.tier1LinealAdderPerLf.max)}/lf;
                color-lot {formatUsd(PROPOSED_RATES.colorLotDefault)} default.
              </li>
              <li>
                Recoat / rusty blast: +
                {formatUsd(PROPOSED_RATES.recoatBlastPerSqft)} / sq ft.
              </li>
              <li>
                Custom match / candy / two-tone: call to confirm — do not invent
                Brian&apos;s fee.
              </li>
            </ul>
          </article>
        </div>

        <EstimatorCard />

        <p className="text-sm text-zinc-500">{SAFE_FINISH_COPY}</p>
        <Link href="/quote" className="btn-dark">
          Get a color quote
        </Link>
      </section>
    </>
  );
}
