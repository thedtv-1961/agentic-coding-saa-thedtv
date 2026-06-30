import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-intl", () => ({
  useLocale: () => "vi",
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}));

import LanguageSwitcher from "@/app/components/login/language-switcher";

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows VN as default locale label", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("VN")).toBeInTheDocument();
  });

  it("shows Vietnam flag image", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByAltText("VN")).toBeInTheDocument();
  });

  it("dropdown is closed initially", () => {
    render(<LanguageSwitcher />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens dropdown on button click", () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("shows both language code options when open", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveTextContent("VN");
    expect(options[1]).toHaveTextContent("EN");
  });

  it("has cursor-pointer class on button", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button").className).toContain("cursor-pointer");
  });

  it("closes dropdown after selecting a locale", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    const enOption = screen.getAllByRole("option")[1];
    fireEvent.click(enOption);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown without reload when clicking current locale", () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    const vnOption = screen.getAllByRole("option")[0];
    fireEvent.click(vnOption);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it("marks current locale option as selected", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("does not render chevron arrow", () => {
    const { container } = render(<LanguageSwitcher />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(0);
  });
});
