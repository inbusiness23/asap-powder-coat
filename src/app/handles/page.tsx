import type { Metadata } from "next";
import ProductLanding from "@/components/ProductLanding";
import { PAGE_H1 } from "@/lib/copy";

export const metadata: Metadata = { title: PAGE_H1.handles };

export default function HandlesPage() {
  return (
    <ProductLanding
      h1={PAGE_H1.handles}
      kind="handle"
      lede="Start here. The handle is the first merchandising item: a bespoke powder-coat color on the piece people grab, while the gate can stay a stock dark."
    />
  );
}
