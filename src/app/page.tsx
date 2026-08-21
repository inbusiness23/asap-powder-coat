import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { COMPANY, PAGE_H1, SAFE_FINISH_COPY } from "@/lib/copy";
import { HeroGate, SwatchRow } from "@/components/Swatches";
import { HardwareViz } from "@/components/HardwareViz";

export const metadata: Metadata = {
  title: PAGE_H1.home,
};

const merch = [
  {
    href: "/handles",
    kind: "handle" as const,
    title: "Handle",
    body: "The piece people touch. A second color here reads as custom without recoating the leaf.",
  },
  {
    href: "/hinges",
    kind: "hinge" as const,
    title: "Hinge",
    body: "Steel hinges can take a powder accent. Polymer or nylon hinges, and sealed hydraulic closers, we refuse — buy those pre-finished.",
  },
  {
    href: "/drop-rods",
    kind: "drop-rod" as const,
    title: "Drop rod",
    body: "A cane bolt in lime (or another accent) against a dark gate is a high-end tell.",
  },
  {
    href: "/quote",
    kind: "latch" as const,
    title: "Latch",
    body: "Match the handle language, or contrast it. Quote the latch as accent hardware.",
  },
  {
    href: "/frames",
    kind: "frame" as const,
    title: "Frame accent",
    body: "Top rail, posts, or the leaf envelope in a second color — not automatically a full-gate respray.",
  },
  {
    href: "/quote",
    kind: "frame" as const,
    title: "Full gate custom",
    body: "Whole-leaf custom color is a quote path. It is not one-click, and it is not a public price list.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-zinc-950">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-lime-accent">
              {COMPANY.name} · Florida · GC #{COMPANY.license}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {PAGE_H1.home}
            </h1>
            <p className="mt-5 text-xl font-medium text-zinc-200">
              You may not want a whole estate gate lime green. You will pay to
              powder-coat the handles, hinges, or drop rods a different color.
            </p>
            <p className="mt-4 max-w-xl text-zinc-400">
              High-end / bespoke accent hardware. Stock hopper color or a
              special-order solid — we quote the coat. This page is color-finish
              only, not fence installation, not FDT, not a dealer portal.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/quote" className="btn-primary">
                Get a color quote
              </Link>
              <a href={`tel:${COMPANY.phoneTel}`} className="btn-secondary">
                <Phone className="h-5 w-5" />
                Call {COMPANY.phoneDisplay}
              </a>
            </div>
          </div>
          <HeroGate />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-zinc-900">
            Example colors
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600">
            Black, bronze, white, and lime are visualization examples — not a
            stocked RAL catalog. Tell us the color you want on the quote form.
          </p>
          <div className="mt-10">
            <SwatchRow />
          </div>
        </div>
      </section>

      <section className="bg-zinc-100 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-zinc-900">
            Merchandising order
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Handle → hinge → drop rod → latch → frame accent → full gate custom.
            Start with the piece people notice. A full custom leaf is last, and
            it is always a quote.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {merch.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <HardwareViz
                  kind={item.kind}
                  className="my-3 h-28 w-full"
                />
                <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{item.body}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-zinc-900">
                  {item.href === "/quote" ? "Get a color quote" : "View"}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm text-zinc-500">{SAFE_FINISH_COPY}</p>
          <Link href="/quote" className="btn-dark mt-8">
            Get a color quote
          </Link>
        </div>
      </section>
    </>
  );
}
