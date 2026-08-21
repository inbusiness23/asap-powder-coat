import {
  COLOR_SWATCHES,
  EXAMPLE_CUSTOM_ACCENT,
  OFFICIAL_ALUMINUM_COLORS,
  SWATCH_DISCLAIMER,
} from "@/lib/copy";
import { AccentGateViz, HardwareViz } from "@/components/HardwareViz";

export function SwatchRow() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {COLOR_SWATCHES.map((swatch) => (
          <div
            key={swatch.id}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
          >
            <div className="bg-zinc-100 p-3">
              <HardwareViz
                kind="handle"
                color={swatch.hex}
                className="h-24 w-full"
              />
            </div>
            <div className="px-3 py-2">
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full border border-zinc-300"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-sm font-semibold text-brand-dark">
                  {swatch.name}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {swatch.kind === "official"
                  ? "Official aluminum color"
                  : "Example custom accent — not stocked"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-zinc-500">
        {SWATCH_DISCLAIMER}
      </p>
    </div>
  );
}

export function HeroGate() {
  return (
    <div className="rounded-2xl border border-zinc-700 bg-black/30 p-4">
      <AccentGateViz
        title="Example: official black gate frame with lime accent hardware (illustration)"
        className="h-64 w-full sm:h-80"
        frame={OFFICIAL_ALUMINUM_COLORS[0].hex}
        hardware={EXAMPLE_CUSTOM_ACCENT.hex}
      />
      <p className="mt-2 text-center text-xs text-zinc-400">
        Illustration: official black frame, lime example custom accent on
        handles / hinges / drop rod. {SWATCH_DISCLAIMER}
      </p>
    </div>
  );
}
