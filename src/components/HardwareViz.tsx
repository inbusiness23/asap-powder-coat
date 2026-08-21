"use client";

import { useId } from "react";
import { COLOR_SWATCHES, EXAMPLE_CUSTOM_ACCENT } from "@/lib/copy";

export type HardwareKind = "handle" | "hinge" | "drop-rod" | "latch" | "frame";

type VizProps = {
  color?: string;
  className?: string;
  title: string;
};

const DEFAULT = EXAMPLE_CUSTOM_ACCENT.hex;

function CoatSheen() {
  const id = useId().replace(/:/g, "");
  const gid = `coat-sheen-${id}`;
  return (
    <>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="38%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`url(#${gid})`}
        style={{ mixBlendMode: "soft-light", pointerEvents: "none" }}
      />
    </>
  );
}

export function HandleViz({ color = DEFAULT, className, title }: VizProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect x="20" y="18" width="120" height="84" rx="10" fill="#dfe3e8" />
      <rect x="48" y="28" width="28" height="64" rx="4" fill="#2a2a2a" />
      <rect x="54" y="36" width="16" height="48" rx="2" fill="#111" />
      <rect
        x="72"
        y="48"
        width="64"
        height="14"
        rx="7"
        fill={color}
        stroke="#111"
        strokeWidth="1.5"
      />
      <rect x="72" y="62" width="10" height="8" fill={color} />
      <ellipse cx="104" cy="52" rx="18" ry="3" fill="#fff" opacity="0.28" />
      <CoatSheen />
    </svg>
  );
}

export function HingeViz({ color = DEFAULT, className, title }: VizProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect x="16" y="16" width="128" height="88" rx="10" fill="#dfe3e8" />
      <rect
        x="28"
        y="28"
        width="42"
        height="64"
        rx="3"
        fill={color}
        stroke="#111"
        strokeWidth="1.5"
      />
      <rect
        x="90"
        y="28"
        width="42"
        height="64"
        rx="3"
        fill={color}
        stroke="#111"
        strokeWidth="1.5"
      />
      <rect x="68" y="30" width="24" height="60" rx="12" fill={color} />
      <rect x="74" y="34" width="12" height="52" rx="6" fill="#111" />
      {[40, 56, 72].map((y) => (
        <circle key={y} cx="42" cy={y} r="3.5" fill="#111" />
      ))}
      {[40, 56, 72].map((y) => (
        <circle key={`r-${y}`} cx="118" cy={y} r="3.5" fill="#111" />
      ))}
      <rect x="32" y="32" width="12" height="52" fill="#fff" opacity="0.18" />
      <CoatSheen />
    </svg>
  );
}

export function DropRodViz({ color = DEFAULT, className, title }: VizProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect x="16" y="8" width="128" height="104" rx="10" fill="#dfe3e8" />
      <rect x="20" y="100" width="120" height="8" fill="#2a2a2a" />
      <rect
        x="74"
        y="16"
        width="12"
        height="86"
        rx="3"
        fill={color}
        stroke="#111"
        strokeWidth="1.5"
      />
      <rect x="62" y="28" width="36" height="10" rx="2" fill={color} />
      <rect x="66" y="70" width="28" height="8" rx="2" fill="#1a1a1a" />
      <circle cx="80" cy="20" r="8" fill={color} stroke="#111" strokeWidth="1.5" />
      <rect x="76" y="22" width="4" height="70" fill="#fff" opacity="0.28" />
      <CoatSheen />
    </svg>
  );
}

export function LatchViz({ color = DEFAULT, className, title }: VizProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect x="16" y="16" width="128" height="88" rx="10" fill="#dfe3e8" />
      <rect
        x="36"
        y="40"
        width="52"
        height="40"
        rx="4"
        fill={color}
        stroke="#111"
        strokeWidth="1.5"
      />
      <path
        d="M88 48 h28 a8 8 0 0 1 0 24 H88"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="54" cy="60" r="5" fill="#111" />
      <rect x="40" y="44" width="16" height="28" fill="#fff" opacity="0.2" />
      <CoatSheen />
    </svg>
  );
}

export function FrameViz({
  color = DEFAULT,
  accent = DEFAULT,
  className,
  title,
}: VizProps & { accent?: string }) {
  return (
    <svg
      viewBox="0 0 160 140"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect x="8" y="4" width="144" height="132" rx="10" fill="#dfe3e8" />
      <rect
        x="24"
        y="12"
        width="112"
        height="116"
        fill="none"
        stroke={color}
        strokeWidth="8"
      />
      {[48, 72, 96, 120].map((x) => (
        <rect key={x} x={x} y="20" width="6" height="100" fill={color} />
      ))}
      <rect x="24" y="12" width="112" height="10" fill={accent} />
      <circle cx="28" cy="40" r="5" fill={accent} />
      <circle cx="28" cy="100" r="5" fill={accent} />
      <rect x="28" y="16" width="104" height="4" fill="#fff" opacity="0.25" />
      <CoatSheen />
    </svg>
  );
}

export function AccentGateViz({
  frame = COLOR_SWATCHES[0].hex,
  hardware = EXAMPLE_CUSTOM_ACCENT.hex,
  className,
  title,
}: {
  frame?: string;
  hardware?: string;
  className?: string;
  title: string;
}) {
  return (
    <svg
      viewBox="0 0 280 220"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect x="8" y="4" width="264" height="212" rx="12" fill="#2a323c" />
      <rect
        x="40"
        y="16"
        width="200"
        height="188"
        fill="none"
        stroke={frame}
        strokeWidth="12"
      />
      {[76, 108, 140, 172, 204].map((x) => (
        <rect key={x} x={x} y="28" width="8" height="164" fill={frame} />
      ))}
      <rect
        x="168"
        y="96"
        width="56"
        height="12"
        rx="6"
        fill={hardware}
        stroke="#111"
        strokeWidth="1"
      />
      <rect x="28" y="48" width="18" height="36" rx="3" fill={hardware} />
      <rect x="28" y="136" width="18" height="36" rx="3" fill={hardware} />
      <rect x="248" y="28" width="8" height="160" rx="2" fill={hardware} />
      <rect x="172" y="98" width="20" height="4" fill="#fff" opacity="0.3" />
      <CoatSheen />
    </svg>
  );
}

export function HardwareViz({
  kind,
  color,
  className,
}: {
  kind: HardwareKind;
  color?: string;
  className?: string;
}) {
  const titles: Record<HardwareKind, string> = {
    handle: "Example powder-coat handle (illustration)",
    hinge: "Example powder-coat hinge (illustration)",
    "drop-rod": "Example powder-coat drop rod (illustration)",
    latch: "Example powder-coat latch (illustration)",
    frame: "Example powder-coat frame accent (illustration)",
  };
  const props = { color, className, title: titles[kind] };
  switch (kind) {
    case "handle":
      return <HandleViz {...props} />;
    case "hinge":
      return <HingeViz {...props} />;
    case "drop-rod":
      return <DropRodViz {...props} />;
    case "latch":
      return <LatchViz {...props} />;
    case "frame":
      return <FrameViz {...props} accent={color} />;
  }
}
