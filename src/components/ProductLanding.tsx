import Link from "next/link";
import type { ReactNode } from "react";
import ColorizedExample from "@/components/ColorizedExample";
import type { HardwareKind } from "@/components/HardwareViz";
import { COMPANY, SAFE_FINISH_COPY } from "@/lib/copy";

export default function ProductLanding({
  h1,
  lede,
  kind,
  extra,
}: {
  h1: string;
  lede: string;
  kind: HardwareKind;
  extra?: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-lime-accent">
            {COMPANY.name} · color finish
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {h1}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-300">{lede}</p>
          <Link href="/quote" className="btn-primary mt-8">
            Get a color quote
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 lg:grid-cols-2">
        <ColorizedExample kind={kind} />
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">
            Stock vs custom color
          </h2>
          <p className="mt-3 text-zinc-600">
            Stock hopper colors are the everyday path. Special-order solids
            (lime and other buyable-box colors) and custom match / candy /
            two-tone are a different conversation — we confirm those by phone,
            not with a one-click price.
          </p>
          <h2 className="mt-8 text-2xl font-bold text-zinc-900">
            Accent hardware vs full gate
          </h2>
          <p className="mt-3 text-zinc-600">
            Many people want a lime handle on a black gate — not a whole estate
            leaf in lime. Accent hardware and frame accents are the product.
            A full-gate custom color is a quote path, not an add-to-cart
            purchase.
          </p>
          {extra}
          <p className="mt-8 text-sm text-zinc-500">{SAFE_FINISH_COPY}</p>
        </div>
      </section>
    </>
  );
}
