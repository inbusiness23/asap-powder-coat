"use client";

import { useState, type FormEvent } from "react";
import { submitQuote, type QuoteActionState } from "@/app/quote/actions";
import { COMPANY } from "@/lib/copy";
import {
  QUOTE_COLOR_OPTIONS,
  QUOTE_FIELD_MAX,
  QUOTE_SKU_OPTIONS,
} from "@/lib/quote-options";

const fieldClass =
  "w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime/40";

const SAVE_FAILED =
  "We could not store this request. Please call us instead.";

export default function QuoteForm() {
  const [state, setState] = useState<QuoteActionState>({ ok: false });
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      const result = await submitQuote(formData);
      setState(result);
    } catch {
      setState({ ok: false, error: SAVE_FAILED });
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
        <h2 className="text-2xl font-bold text-zinc-900">Quote request sent</h2>
        <p className="mt-3 text-zinc-600">
          We received your request. Someone from {COMPANY.shortName} will
          follow up. Need it faster? Call{" "}
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
          data-testid="quote-error"
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
          maxLength={QUOTE_FIELD_MAX.name}
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
            maxLength={QUOTE_FIELD_MAX.phone}
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
            maxLength={QUOTE_FIELD_MAX.email}
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
          maxLength={QUOTE_FIELD_MAX.address}
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
            {QUOTE_SKU_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
            {QUOTE_COLOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
            maxLength={QUOTE_FIELD_MAX.quantity}
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
            maxLength={QUOTE_FIELD_MAX.dimensions}
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
