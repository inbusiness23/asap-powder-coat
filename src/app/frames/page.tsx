import type { Metadata } from "next";
import ProductLanding from "@/components/ProductLanding";
import { PAGE_H1 } from "@/lib/copy";

export const metadata: Metadata = { title: PAGE_H1.frames };

export default function FramesPage() {
  return (
    <ProductLanding
      h1={PAGE_H1.frames}
      kind="frame"
      lede="A frame accent is a second color on the leaf envelope or rails — not automatically a full-gate custom. Full-gate custom color stays a quote path."
    />
  );
}
