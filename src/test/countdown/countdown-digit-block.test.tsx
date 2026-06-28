import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CountdownDigitBlock from "@/app/components/countdown/countdown-digit-block";

describe("CountdownDigitBlock", () => {
  it("zero-pad single digit — hiển thị '0' và '5'", () => {
    render(<CountdownDigitBlock value={5} label="HOURS" />);
    const digits = screen.getAllByTestId("digit");
    expect(digits).toHaveLength(2);
    expect(digits[0]).toHaveTextContent("0");
    expect(digits[1]).toHaveTextContent("5");
    expect(screen.getByText("HOURS")).toBeInTheDocument();
  });

  it("hiển thị đúng 2 chữ số khi value >= 10", () => {
    render(<CountdownDigitBlock value={23} label="DAYS" />);
    const digits = screen.getAllByTestId("digit");
    expect(digits).toHaveLength(2);
    expect(digits[0]).toHaveTextContent("2");
    expect(digits[1]).toHaveTextContent("3");
  });

  it("hiển thị 00 khi value = 0", () => {
    render(<CountdownDigitBlock value={0} label="MINUTES" />);
    const digits = screen.getAllByTestId("digit");
    expect(digits[0]).toHaveTextContent("0");
    expect(digits[1]).toHaveTextContent("0");
  });

  it("aria-label đúng format", () => {
    render(<CountdownDigitBlock value={5} label="HOURS" />);
    expect(screen.getByRole("generic", { name: "05 hours" })).toBeInTheDocument();
  });
});
