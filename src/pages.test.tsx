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
      expect(text).not.toMatch(/\$695/);
      expect(text).not.toMatch(/\$14(\.00)?/);
      expect(text).not.toMatch(/\$22(\.00)?/);
      expect(text).not.toMatch(/\$18(\.00)?/);
      expect(text).not.toMatch(/\$1,?250/);
      expect(text).not.toMatch(/\$12(\.00)?\s*\/\s*lf/i);
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
    expect(screen.getByTestId("estimator-sell-price").textContent).toContain(
      "$695.00"
    );
    expect(screen.getByTestId("estimator-cost-total").textContent).toMatch(
      /No locked Brian COST/i
    );
    expect(screen.getByTestId("cost-vs-sell")).toBeInTheDocument();
    expect(screen.getByTestId("proposed-sell-display").textContent).toBe(
      "Proposed"
    );
    expect(text).toContain("$695.00");
    expect(text).toContain("$14.00");
    expect(text.toLowerCase()).toMatch(/premium/);
    expect(text).not.toMatch(/starting at \$7/i);
    expect(screen.getByTestId("estimator-sell-locked").textContent).toMatch(
      /Locked: false/i
    );
  });
});

describe("sourced ASAP brand", () => {
  it("keeps FACT vendor COST at $7 / sq ft and $3 / lf", async () => {
    const { FACT_RATES } = await import("@/lib/pricing");
    expect(FACT_RATES.gateStockPerSqft).toBe(7);
    expect(FACT_RATES.linealStockPerLf).toBe(3);
    expect(FACT_RATES.isCustomerPrice).toBe(false);
  });

  it("treats black, bronze, and white as official colors and lime as example custom accent", async () => {
    const { COLOR_SWATCHES, OFFICIAL_ALUMINUM_COLORS, EXAMPLE_CUSTOM_ACCENT } =
      await import("@/lib/copy");
    expect(OFFICIAL_ALUMINUM_COLORS.map((c) => c.id)).toEqual([
      "black",
      "bronze",
      "white",
    ]);
    expect(EXAMPLE_CUSTOM_ACCENT.id).toBe("lime");
    expect(EXAMPLE_CUSTOM_ACCENT.kind).toBe("example-custom-accent");
    expect(COLOR_SWATCHES[3].kind).toBe("example-custom-accent");
  });

  it("shows the ASAP SIGNATURE FENCE wordmark and only the sourced phone", async () => {
    const Navigation = (await import("@/components/Navigation")).default;
    const Footer = (await import("@/components/Footer")).default;
    const { COMPANY } = await import("@/lib/copy");
    const { container } = render(
      <>
        <Navigation />
        <Footer />
      </>
    );
    const text = container.textContent ?? "";
    expect(text).toContain(COMPANY.wordmark);
    expect(text).toContain(COMPANY.phoneDisplay);
    expect(text).toContain(COMPANY.hours);
    expect(text).toContain(COMPANY.tagline);
    expect(text).toContain("4.8");
    expect(text).toContain("460+");
    expect(text).not.toContain("941-229-1789");
    expect(text).not.toContain("941-555-1234");
    expect(text).not.toMatch(/\bCAT\b/);
    expect(text.toLowerCase()).not.toContain("catpowdercoat");
  });

  for (const { name, Page } of publicLandings) {
    it(`${name} stays on-brand and does not co-brand the coating vendor`, () => {
      const { container } = render(<Page />);
      const text = container.textContent ?? "";
      expect(text).not.toMatch(/\bCAT\b/);
      expect(text.toLowerCase()).not.toContain("catpowdercoat");
      expect(text).not.toContain("941-229-1789");
      expect(text).not.toContain("941-555-1234");
      expect(text.toLowerCase()).not.toContain("marine-grade");
      expect(text.toLowerCase()).not.toContain("rust-proof");
      expect(text.toLowerCase()).not.toContain("rustproof");
      expect(text.toLowerCase()).not.toContain("won't rust");
      expect(text).not.toMatch(/\$45\s*[–-]\s*\$75/);
      expect(text.toLowerCase()).not.toContain("we operate a powder plant");
      expect(text.toLowerCase()).not.toContain("our ovens");
      if (name === "home" || name === "quote") {
        expect(text.toLowerCase()).toContain("example custom accent");
        expect(text.toLowerCase()).toContain("black");
        expect(text.toLowerCase()).toContain("bronze");
        expect(text.toLowerCase()).toContain("white");
      }
    });
  }

  it("uses brand dark #171D24 on the home hero", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector(".bg-brand-dark")).not.toBeNull();
  });
});
