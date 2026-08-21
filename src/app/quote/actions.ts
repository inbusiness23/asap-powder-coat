"use server";

import { storeQuote, QuotePersistError } from "@/lib/quotes";
import {
  QUOTE_ALLOWED_KEYS,
  QUOTE_COLORS,
  QUOTE_FIELD_MAX,
  QUOTE_MAX_PAYLOAD_CHARS,
  QUOTE_SKUS,
} from "@/lib/quote-options";

export type QuoteActionState = {
  ok: boolean;
  error?: string;
  id?: string;
};

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function payloadCharCount(formData: FormData): number {
  let total = 0;
  Array.from(formData.values()).forEach((value) => {
    if (typeof value === "string") total += value.length;
    else total += value.size;
  });
  return total;
}

function isSku(value: string): value is (typeof QUOTE_SKUS)[number] {
  return (QUOTE_SKUS as readonly string[]).includes(value);
}

function isColor(value: string): value is (typeof QUOTE_COLORS)[number] {
  return (QUOTE_COLORS as readonly string[]).includes(value);
}

export async function submitQuote(
  formData: FormData
): Promise<QuoteActionState> {
  if (payloadCharCount(formData) > QUOTE_MAX_PAYLOAD_CHARS) {
    return { ok: false, error: "That request is too large. Please shorten it." };
  }

  if (
    Array.from(formData.keys()).some(
      (key) => !(QUOTE_ALLOWED_KEYS as readonly string[]).includes(key)
    )
  ) {
    return { ok: false, error: "Unexpected field." };
  }

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

  if (name.length > QUOTE_FIELD_MAX.name) {
    return { ok: false, error: "Name is too long." };
  }
  if (phone.length > QUOTE_FIELD_MAX.phone) {
    return { ok: false, error: "Phone is too long." };
  }
  if (email.length > QUOTE_FIELD_MAX.email) {
    return { ok: false, error: "Email is too long." };
  }
  if (address.length > QUOTE_FIELD_MAX.address) {
    return { ok: false, error: "Address is too long." };
  }
  if (quantity.length > QUOTE_FIELD_MAX.quantity) {
    return { ok: false, error: "Quantity is too long." };
  }
  if (dimensions.length > QUOTE_FIELD_MAX.dimensions) {
    return { ok: false, error: "Dimensions are too long." };
  }

  if (!isSku(sku)) {
    return { ok: false, error: "Please choose a SKU from the list." };
  }
  if (!isColor(color)) {
    return { ok: false, error: "Please choose a color from the list." };
  }

  try {
    // Fail-closed local persist only. No GHL, no asapfenceandgate.com
    // APIs, no FDT webhook — those were not publicly verified.
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
  } catch (error) {
    const message =
      error instanceof QuotePersistError
        ? error.message
        : "We could not store this request. Please call us instead.";
    return { ok: false, error: message };
  }
}
