import type { Metadata } from "next";
import ProductLanding from "@/components/ProductLanding";
import { PAGE_H1 } from "@/lib/copy";

export const metadata: Metadata = { title: PAGE_H1.hinges };

export default function HingesPage() {
  return (
    <ProductLanding
      h1={PAGE_H1.hinges}
      kind="hinge"
      lede="Steel gate hinges can be powder-coated as accent hardware — a different color from the leaf — without committing the whole estate gate to that color."
      extra={
        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          <p className="font-semibold text-zinc-900">What we will not coat</p>
          <p className="mt-2">
            Polymer or nylon hinges, and sealed hydraulic closers: we refuse
            those for powder coat. Buy them pre-finished.
          </p>
        </div>
      }
    />
  );
}
