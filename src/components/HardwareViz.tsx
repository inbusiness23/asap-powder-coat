import { EXAMPLE_SWATCHES } from "@/lib/copy";

export type HardwareKind = "handle" | "hinge" | "drop-rod" | "latch" | "frame";

type VizProps = {
  color?: string;
  className?: string;
  title: string;
};

const DEFAULT = EXAMPLE_SWATCHES[3].hex;

export function HandleViz({ color = DEFAULT, className, title }: VizProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
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
    </svg>
  );
}

export function AccentGateViz({
  frame = EXAMPLE_SWATCHES[0].hex,
  hardware = EXAMPLE_SWATCHES[3].hex,
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
