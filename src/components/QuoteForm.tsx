"use client";

import { useState, type FormEvent } from "react";
import { submitQuote, type QuoteActionState } from "@/app/quote/actions";
import { COMPANY } from "@/lib/copy";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime/40";

export default function QuoteForm() {
  const [state, setState] = useState<QuoteActionState>({ ok: false });
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      const result = await submitQuote(formData);
      setState(result);
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    void onSubmit(formData);
  }

  if (state.ok) {
    return (
      <div
        className="rounded-xl border border-green-200 bg-green-50 p-8 text-center"
        data-testid="quote-success"
      >
        <h2 className="text-2xl font-bold text-zinc-900">Quote request saved</h2>
        <p className="mt-3 text-zinc-600">
          We stored your request (no CRM webhook). Someone from{" "}
          {COMPANY.shortName} will follow up. Need it faster? Call{" "}
          <a
            href={`tel:${COMPANY.phoneTel}`}
            className="font-semibold text-zinc-900 underline"
          >
            {COMPANY.phoneDisplay}
          </a>
          .
        </p>
        {state.id ? (
          <p className="mt-2 text-xs text-zinc-500">Reference {state.id}</p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" data-testid="quote-form">
      {state.error ? (
        <p
          className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-semibold text-zinc-700"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          data-testid="quote-name"
          className={fieldClass}
          autoComplete="name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            data-testid="quote-phone"
            className={fieldClass}
            autoComplete="tel"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            data-testid="quote-email"
            className={fieldClass}
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="mb-1.5 block text-sm font-semibold text-zinc-700"
        >
          Address <span className="text-red-500">*</span>
        </label>
        <input
          id="address"
          name="address"
          required
          data-testid="quote-address"
          className={fieldClass}
          autoComplete="street-address"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="sku"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            SKU / item <span className="text-red-500">*</span>
          </label>
          <select
            id="sku"
            name="sku"
            required
            data-testid="quote-sku"
            className={`${fieldClass} bg-white`}
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="handle">Handle (accent)</option>
            <option value="hinge">Hinge (accent)</option>
            <option value="drop-rod">Drop rod (accent)</option>
            <option value="latch">Latch (accent)</option>
            <option value="frame-accent">Frame accent</option>
            <option value="PC-HW-LOT">PC-HW-LOT accent hardware lot</option>
            <option value="PC-GATE-STK">
              PC-GATE-STK full gate (quote path)
            </option>
            <option value="PC-LIN-STK">PC-LIN-STK lineal profile</option>
            <option value="full-gate-custom">
              Full gate custom color (quote path)
            </option>
          </select>
        </div>
        <div>
          <label
            htmlFor="color"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            Color <span className="text-red-500">*</span>
          </label>
          <select
            id="color"
            name="color"
            required
            data-testid="quote-color"
            className={`${fieldClass} bg-white`}
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="official-black">Official aluminum: black</option>
            <option value="official-bronze">Official aluminum: bronze</option>
            <option value="official-white">Official aluminum: white</option>
            <option value="example-lime">
              Lime — example custom accent, not stocked
            </option>
            <option value="other-custom">
              Other custom accent — call to confirm
            </option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="quantity"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            data-testid="quote-quantity"
            className={fieldClass}
            placeholder="e.g. 4 hinges"
          />
        </div>
        <div>
          <label
            htmlFor="dimensions"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            Dimensions
          </label>
          <input
            id="dimensions"
            name="dimensions"
            data-testid="quote-dimensions"
            className={fieldClass}
            placeholder="e.g. 4 ft W × 6 ft H leaf"
          />
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Official colors are black, bronze, and white. Lime is an example custom
        accent, not a stocked catalog. Other custom accents and full-gate custom
        color are a quote path, not add-to-cart. Customer coat pricing is
        quote-only.
      </p>

      <button
        type="submit"
        data-testid="quote-submit"
        disabled={pending}
        className="btn-primary w-full sm:w-auto"
      >
        {pending ? "Sending…" : "Get a color quote"}
      </button>
    </form>
  );
}
