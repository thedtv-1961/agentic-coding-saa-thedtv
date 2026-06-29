import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AwardsNav from "@/app/components/awards/awards-nav";

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_cb: IntersectionObserverCallback) {}
}

const NAV_ITEMS = [
  { label: "Top Talent", slug: "top-talent" },
  { label: "Top Project", slug: "top-project" },
  { label: "Top Project Leader", slug: "top-project-leader" },
  { label: "Best Manager", slug: "best-manager" },
  { label: "Signature 2025 - Creator", slug: "signature-2025---creator" },
  { label: "MVP (Most Valuable Person)", slug: "mvp-most-valuable-person" },
];

beforeEach(() => {
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  vi.spyOn(document, "getElementById").mockReturnValue({
    scrollIntoView: vi.fn(),
  } as unknown as HTMLElement);
});

describe("AwardsNav (desktop)", () => {
  it("renders all 6 nav items", () => {
    render(<AwardsNav navItems={NAV_ITEMS} />);
    expect(screen.getByText("Top Talent")).toBeInTheDocument();
    expect(screen.getByText("Top Project")).toBeInTheDocument();
    expect(screen.getByText("Top Project Leader")).toBeInTheDocument();
    expect(screen.getByText("Best Manager")).toBeInTheDocument();
    expect(screen.getByText("Signature 2025 - Creator")).toBeInTheDocument();
    expect(screen.getByText("MVP (Most Valuable Person)")).toBeInTheDocument();
  });

  it("has first item active by default", () => {
    render(<AwardsNav navItems={NAV_ITEMS} />);
    expect(screen.getByText("Top Talent")).toHaveClass("text-[#FFEA9E]");
  });

  it("clicking an item calls scrollIntoView with correct slug", () => {
    render(<AwardsNav navItems={NAV_ITEMS} />);
    fireEvent.click(screen.getByText("Best Manager"));
    expect(document.getElementById).toHaveBeenCalledWith("best-manager");
  });

  it("sets up IntersectionObserver for 6 sections", () => {
    render(<AwardsNav navItems={NAV_ITEMS} />);
    expect(mockObserve).toHaveBeenCalledTimes(6);
  });
});

describe("AwardsNav (mobile)", () => {
  it("renders a select element with 6 options", () => {
    render(<AwardsNav navItems={NAV_ITEMS} mobile />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll("option")).toHaveLength(6);
  });

  it("default selected value is first item slug", () => {
    render(<AwardsNav navItems={NAV_ITEMS} mobile />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("top-talent");
  });

  it("changing select calls scrollIntoView on target section", () => {
    render(<AwardsNav navItems={NAV_ITEMS} mobile />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "mvp-most-valuable-person" } });
    expect(document.getElementById).toHaveBeenCalledWith("mvp-most-valuable-person");
  });
});
