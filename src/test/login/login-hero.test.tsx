import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginHero from "@/app/components/login/login-hero";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    <img alt={alt} {...props} />
  ),
}));

vi.mock("@/app/components/login/login-button", () => ({
  default: ({ label }: { label: string }) => <button>{label}</button>,
}));

describe("LoginHero", () => {
  it("renders ROOT FURTHER heading", async () => {
    const jsx = await LoginHero({});
    render(jsx);
    expect(screen.getByRole("heading")).toHaveTextContent(/ROOT/);
    expect(screen.getByRole("heading")).toHaveTextContent(/FURTHER/);
  });

  it("renders welcome_line1 and welcome_line2 via i18n", async () => {
    const jsx = await LoginHero({});
    render(jsx);
    expect(screen.getByText("welcome_line1")).toBeInTheDocument();
    expect(screen.getByText("welcome_line2")).toBeInTheDocument();
  });

  it("renders LoginButton", async () => {
    const jsx = await LoginHero({});
    render(jsx);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders error message when errorMessage prop provided", async () => {
    const jsx = await LoginHero({ errorMessage: "oauth_error" });
    render(jsx);
    expect(screen.getByText("error_message")).toBeInTheDocument();
  });

  it("does not render error message when errorMessage is undefined", async () => {
    const jsx = await LoginHero({});
    render(jsx);
    expect(screen.queryByText("error_message")).not.toBeInTheDocument();
  });
});
