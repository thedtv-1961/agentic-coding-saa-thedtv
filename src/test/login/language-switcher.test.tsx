import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-intl", () => ({
  useLocale: () => "vi",
}));

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
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

  it("shows both VN and EN options when open", () => {
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
});
