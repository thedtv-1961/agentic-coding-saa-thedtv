import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginHeader from "@/app/components/login/login-header";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    <img alt={alt} {...props} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/app/components/login/language-switcher", () => ({
  default: () => <div data-testid="language-switcher" />,
}));

describe("LoginHeader", () => {
  it("renders logo image with alt text from i18n", async () => {
    const jsx = await LoginHeader();
    render(jsx);
    expect(screen.getByAltText("logo_alt")).toBeInTheDocument();
  });

  it("wraps logo in Link with href='/'", async () => {
    const jsx = await LoginHeader();
    const { container } = render(jsx);
    const link = container.querySelector("a[href='/']");
    expect(link).toBeInTheDocument();
    expect(link?.querySelector("img")).toBeInTheDocument();
  });

  it("renders LanguageSwitcher", async () => {
    const jsx = await LoginHeader();
    render(jsx);
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });
});
