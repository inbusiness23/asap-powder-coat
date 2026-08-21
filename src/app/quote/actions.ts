"use server";

import { storeQuote } from "@/lib/quotes";

export type QuoteActionState = {
  ok: boolean;
  error?: string;
  id?: string;
};

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitQuote(
  formData: FormData
): Promise<QuoteActionState> {
  const name = read(formData, "name");
  const phone = read(formData, "phone");
  const email = read(formData, "email");
  const address = read(formData, "address");
  const sku = read(formData, "sku");
  const color = read(formData, "color");
  const quantity = read(formData, "quantity");
  const dimensions = read(formData, "dimensions");

  if (!name || !phone || !email || !address || !sku || !color) {
    return {
      ok: false,
      error: "Please fill name, phone, email, address, SKU, and color.",
    };
  }
  if (!quantity && !dimensions) {
    return { ok: false, error: "Please add a quantity and/or dimensions." };
  }

  const saved = await storeQuote({
    name,
    phone,
    email,
    address,
    sku,
    color,
    quantity,
    dimensions,
  });

  return { ok: true, id: saved.id };
}
