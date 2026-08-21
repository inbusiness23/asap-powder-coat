import type { Metadata } from "next";
import { Phone } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import { COMPANY, PAGE_H1, SAFE_FINISH_COPY } from "@/lib/copy";

export const metadata: Metadata = { title: PAGE_H1.quote };

export default function QuotePage() {
  return (
    <>
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {PAGE_H1.quote}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-300">
            Customer coat pricing is quote-only. Tell us the SKU, color, and
            quantity or dimensions. Custom match, candy, and two-tone are
            confirmed by phone — not one-click.
          </p>
          <a
            href={`tel:${COMPANY.phoneTel}`}
            className="btn-secondary mt-6 inline-flex"
          >
            <Phone className="h-5 w-5" />
            {COMPANY.phoneDisplay}
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <QuoteForm />
        </div>
        <aside className="lg:col-span-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="font-bold text-zinc-900">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm text-zinc-600">
              <li>1. Your request is stored on this site (no CRM webhook).</li>
              <li>2. We review SKU, color, and size.</li>
              <li>
                3. Stock hopper vs special-order vs custom match — we confirm
                before anything is coated.
              </li>
            </ol>
            <p className="mt-6 text-xs text-zinc-500">{SAFE_FINISH_COPY}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
