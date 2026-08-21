import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { QuotePersistError, storeQuote } from "@/lib/quotes";

const input = {
  name: "Ada",
  phone: "9414178992",
  email: "ada@example.com",
  address: "2219 63rd Avenue East",
  sku: "handle",
  color: "official-black",
  quantity: "2",
  dimensions: "",
};

async function withQuotesFile<T>(
  file: string,
  run: () => Promise<T>
): Promise<T> {
  const previous = process.env.QUOTES_FILE;
  process.env.QUOTES_FILE = file;
  try {
    return await run();
  } finally {
    if (previous === undefined) delete process.env.QUOTES_FILE;
    else process.env.QUOTES_FILE = previous;
  }
}

describe("storeQuote persist honesty", () => {
  const dirs: string[] = [];

  afterEach(async () => {
    await Promise.all(
      dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))
    );
  });

  it("returns the quote only after a durable disk write that round-trips", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "quotes-"));
    dirs.push(dir);
    const file = path.join(dir, "quotes.json");

    const saved = await withQuotesFile(file, () => storeQuote(input));
    expect(saved.name).toBe("Ada");
    const parsed = JSON.parse(await readFile(file, "utf8")) as Array<{
      id: string;
    }>;
    expect(parsed.some((row) => row.id === saved.id)).toBe(true);
  });

  it("throws QuotePersistError when the write cannot persist", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "quotes-"));
    dirs.push(dir);
    const blocker = path.join(dir, "quotes.json");
    await writeFile(blocker, "not-a-directory", "utf8");
    const file = path.join(blocker, "nested.json");

    await expect(
      withQuotesFile(file, () => storeQuote(input))
    ).rejects.toBeInstanceOf(QuotePersistError);
  });
});
