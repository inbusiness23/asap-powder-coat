"use client";

import { useState } from "react";
import { EXAMPLE_SWATCHES, SWATCH_DISCLAIMER } from "@/lib/copy";
import { HardwareViz, type HardwareKind } from "@/components/HardwareViz";

export default function ColorizedExample({ kind }: { kind: HardwareKind }) {
  const [active, setActive] = useState<(typeof EXAMPLE_SWATCHES)[number]>(
    EXAMPLE_SWATCHES[3]
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <HardwareViz
        kind={kind}
        color={active.hex}
        className="mx-auto h-40 w-full"
      />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {EXAMPLE_SWATCHES.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            onClick={() => setActive(swatch)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
              active.id === swatch.id
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-zinc-50 text-zinc-700"
            }`}
            aria-pressed={active.id === swatch.id}
          >
            <span
              className="h-4 w-4 rounded-full border border-zinc-300"
              style={{ backgroundColor: swatch.hex }}
            />
            {swatch.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-zinc-500">
        {SWATCH_DISCLAIMER}
      </p>
    </div>
  );
}
