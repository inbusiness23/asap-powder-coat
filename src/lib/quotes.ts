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

const memoryStore: QuoteSubmission[] = [];

function quotesFilePath(): string {
  return path.join(process.cwd(), "data", "quotes.json");
}

async function persist(all: QuoteSubmission[]): Promise<void> {
  try {
    const file = quotesFilePath();
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(all, null, 2), "utf8");
  } catch {
    // Vercel / serverless filesystems may be read-only. In-memory is enough.
  }
}

async function loadFromDisk(): Promise<QuoteSubmission[]> {
  try {
    const raw = await readFile(quotesFilePath(), "utf8");
    const parsed = JSON.parse(raw) as QuoteSubmission[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // first run or unreadable
  }
  return [];
}

export async function storeQuote(
  input: Omit<QuoteSubmission, "id" | "createdAt">
): Promise<QuoteSubmission> {
  const fromDisk = await loadFromDisk();
  const knownIds = new Set([
    ...memoryStore.map((q) => q.id),
    ...fromDisk.map((q) => q.id),
  ]);
  const merged = [
    ...fromDisk.filter((q) => !memoryStore.some((m) => m.id === q.id)),
    ...memoryStore,
  ];

  const quote: QuoteSubmission = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  if (!knownIds.has(quote.id)) {
    merged.push(quote);
    memoryStore.push(quote);
  }

  await persist(merged);
  return quote;
}

export function listQuotesInMemory(): QuoteSubmission[] {
  return [...memoryStore];
}
