import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuoteForm from "@/components/QuoteForm";
import { submitQuote } from "@/app/quote/actions";

vi.mock("@/app/quote/actions", () => ({
  submitQuote: vi.fn(),
}));

const submitQuoteMock = vi.mocked(submitQuote);

function fillValid() {
  fireEvent.change(screen.getByTestId("quote-name"), {
    target: { value: "Ada" },
  });
  fireEvent.change(screen.getByTestId("quote-phone"), {
    target: { value: "9414178992" },
  });
  fireEvent.change(screen.getByTestId("quote-email"), {
    target: { value: "ada@example.com" },
  });
  fireEvent.change(screen.getByTestId("quote-address"), {
    target: { value: "2219 63rd Avenue East" },
  });
  fireEvent.change(screen.getByTestId("quote-sku"), {
    target: { value: "handle" },
  });
  fireEvent.change(screen.getByTestId("quote-color"), {
    target: { value: "official-black" },
  });
  fireEvent.change(screen.getByTestId("quote-quantity"), {
    target: { value: "2" },
  });
}

describe("QuoteForm persist honesty", () => {
  it("includes a hidden honeypot field", () => {
    render(<QuoteForm />);
    const pot = screen.getByTestId("quote-honeypot");
    expect(pot).toHaveAttribute("name", "website");
    expect(pot).toHaveAttribute("tabindex", "-1");
  });

  it("shows a visible failure when submitQuote throws", async () => {
    submitQuoteMock.mockRejectedValue(new Error("network"));
    render(<QuoteForm />);
    fillValid();
    fireEvent.submit(screen.getByTestId("quote-form"));
    expect(await screen.findByTestId("quote-error")).toHaveTextContent(
      /could not store/i
    );
    expect(screen.queryByTestId("quote-success")).toBeNull();
  });

  it("does not claim follow-up when persist returns ok:false", async () => {
    submitQuoteMock.mockResolvedValue({
      ok: false,
      error: "We could not store this request. Please call us instead.",
    });
    render(<QuoteForm />);
    fillValid();
    fireEvent.submit(screen.getByTestId("quote-form"));
    expect(await screen.findByTestId("quote-error")).toBeInTheDocument();
    expect(screen.queryByTestId("quote-success")).toBeNull();
    expect(screen.queryByText(/will follow up/i)).toBeNull();
  });

  it("claims follow-up only after persist succeeds", async () => {
    submitQuoteMock.mockResolvedValue({ ok: true });
    render(<QuoteForm />);
    fillValid();
    fireEvent.submit(screen.getByTestId("quote-form"));
    await waitFor(() => {
      expect(screen.getByTestId("quote-success")).toBeInTheDocument();
    });
    expect(screen.getByText(/will follow up/i)).toBeInTheDocument();
    expect(screen.queryByTestId("quote-reference")).toBeNull();
  });

  it("shows Reference only when the live API returned an id", async () => {
    submitQuoteMock.mockResolvedValue({ ok: true, id: "lead-real-99" });
    render(<QuoteForm />);
    fillValid();
    fireEvent.submit(screen.getByTestId("quote-form"));
    expect(await screen.findByTestId("quote-reference")).toHaveTextContent(
      "Reference lead-real-99"
    );
  });
});
