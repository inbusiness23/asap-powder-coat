import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PAGE_H1 } from "@/lib/copy";
import HomePage from "@/app/page";
import HingesPage from "@/app/hinges/page";
import DropRodsPage from "@/app/drop-rods/page";
import HandlesPage from "@/app/handles/page";
import FramesPage from "@/app/frames/page";
import PricingPage from "@/app/pricing/page";
import QuotePage from "@/app/quote/page";

vi.mock("@/app/quote/actions", () => ({
  submitQuote: vi.fn(async () => ({ ok: false })),
}));

const publicLandings = [
  { name: "home", Page: HomePage, heading: PAGE_H1.home },
  { name: "hinges", Page: HingesPage, heading: PAGE_H1.hinges },
  { name: "drop-rods", Page: DropRodsPage, heading: PAGE_H1.dropRods },
  { name: "handles", Page: HandlesPage, heading: PAGE_H1.handles },
  { name: "frames", Page: FramesPage, heading: PAGE_H1.frames },
  { name: "quote", Page: QuotePage, heading: PAGE_H1.quote },
] as const;

function pageText(Page: (typeof publicLandings)[number]["Page"]): string {
  const { container } = render(<Page />);
  return container.textContent ?? "";
}

describe("landing H1 smoke", () => {
  for (const { name, Page, heading } of publicLandings) {
    it(`renders the ${name} H1`, () => {
      render(<Page />);
      expect(
        screen.getByRole("heading", { level: 1, name: heading })
      ).toBeInTheDocument();
    });
  }

  it("renders the pricing H1", () => {
    render(<PricingPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: PAGE_H1.pricing })
    ).toBeInTheDocument();
  });
});

describe("public pages do not offer Brian COST as a customer price", () => {
  for (const { name, Page } of publicLandings) {
    it(`${name} does not render $7 or $3 as a customer offer`, () => {
      const text = pageText(Page);
      expect(text).not.toMatch(/\$7(\.00)?/);
      expect(text).not.toMatch(/\$3(\.00|\.50)?/);
      expect(text).not.toMatch(/starting at/i);
      expect(text.toLowerCase()).not.toContain("per sq ft");
      expect(text.toLowerCase()).not.toContain("per square foot");
      expect(text.toLowerCase()).not.toContain("/sq ft");
    });
  }

  it("staff pricing page shows $7 / $3 as COST, not sell", () => {
    render(<PricingPage />);
    expect(screen.getAllByText("COST").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { level: 1, name: PAGE_H1.pricing })
        .textContent
    ).toMatch(/not customer prices/i);
    const text = document.body.textContent ?? "";
    expect(text).toContain("$7.00");
    expect(text).toContain("$3.00");
    expect(text).toMatch(/vendor cost/i);
    expect(text).not.toMatch(/starting at \$7/i);
    expect(screen.getByTestId("estimator-sell-price").textContent).toMatch(
      /request quote/i
    );
  });
});
