import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AwardsNav from "@/app/components/awards/awards-nav";

// IntersectionObserver is not available in jsdom — provide a class-based mock
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_cb: IntersectionObserverCallback) {}
}

beforeEach(() => {
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  // Mock getElementById + scrollIntoView
  vi.spyOn(document, "getElementById").mockReturnValue({
    scrollIntoView: vi.fn(),
  } as unknown as HTMLElement);
});

describe("AwardsNav (desktop)", () => {
  it("renders all 6 nav items", () => {
    render(<AwardsNav />);
    expect(screen.getByText("Top Talent")).toBeInTheDocument();
    expect(screen.getByText("Top Project")).toBeInTheDocument();
    expect(screen.getByText("Top Project Leader")).toBeInTheDocument();
    expect(screen.getByText("Best Manager")).toBeInTheDocument();
    expect(screen.getByText("Signature 2025")).toBeInTheDocument();
    expect(screen.getByText("MVP")).toBeInTheDocument();
  });

  it("has Top Talent active by default", () => {
    render(<AwardsNav />);
    const firstButton = screen.getByText("Top Talent");
    expect(firstButton).toHaveClass("text-[#FFEA9E]");
  });

  it("clicking an item calls scrollIntoView", () => {
    render(<AwardsNav />);
    fireEvent.click(screen.getByText("Best Manager"));
    expect(document.getElementById).toHaveBeenCalledWith("best-manager");
  });

  it("sets up IntersectionObserver for 6 sections", () => {
    render(<AwardsNav />);
    expect(mockObserve).toHaveBeenCalledTimes(6);
  });
});

describe("AwardsNav (mobile)", () => {
  it("renders a select element with 6 options", () => {
    render(<AwardsNav mobile />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll("option")).toHaveLength(6);
  });

  it("default selected value is top-talent", () => {
    render(<AwardsNav mobile />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("top-talent");
  });

  it("changing select calls scrollIntoView on target section", () => {
    render(<AwardsNav mobile />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "mvp" } });
    expect(document.getElementById).toHaveBeenCalledWith("mvp");
  });
});
