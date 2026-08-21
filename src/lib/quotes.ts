import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type QuoteSubmission = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  sku: string;
  color: string;
  quantity: string;
  dimensions: string;
};

export class QuotePersistError extends Error {
  constructor(
    message = "We could not store this request. Please call us instead."
  ) {
    super(message);
    this.name = "QuotePersistError";
  }
}

function quotesFilePath(): string {
  return (
    process.env.QUOTES_FILE ??
    path.join(process.cwd(), "data", "quotes.json")
  );
}

async function persist(all: QuoteSubmission[]): Promise<void> {
  const file = quotesFilePath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(all, null, 2), "utf8");
}

async function loadFromDisk(): Promise<QuoteSubmission[]> {
  try {
    const raw = await readFile(quotesFilePath(), "utf8");
    const parsed = JSON.parse(raw) as QuoteSubmission[];
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    if (code === "ENOENT") return [];
    throw new QuotePersistError();
  }
  throw new QuotePersistError();
}

/**
 * Optional local file copy. Customer-facing success is the locked ASAP
 * lead path in asap-lead.ts, not this disk write.
 *
 * Do not invent a GHL webhook. Do not POST /api/book/estimate or
 * hoaapprovedfence.com.
 */
export async function storeQuote(
  input: Omit<QuoteSubmission, "id" | "createdAt">
): Promise<QuoteSubmission> {
  const existing = await loadFromDisk();

  const quote: QuoteSubmission = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const next = [...existing, quote];

  try {
    await persist(next);
    const verified = await loadFromDisk();
    if (!verified.some((row) => row.id === quote.id)) {
      throw new QuotePersistError();
    }
  } catch (error) {
    if (error instanceof QuotePersistError) throw error;
    throw new QuotePersistError();
  }

  return quote;
}
