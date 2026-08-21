import type { Metadata } from "next";
import ProductLanding from "@/components/ProductLanding";
import { PAGE_H1 } from "@/lib/copy";

export const metadata: Metadata = { title: PAGE_H1.dropRods };

export default function DropRodsPage() {
  return (
    <ProductLanding
      h1={PAGE_H1.dropRods}
      kind="drop-rod"
      lede="A drop rod (cane bolt) in a second powder-coat color is a small weldment with a large visual payoff. Keep the gate stock; accent the rod."
    />
  );
}
