import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginFooter from "@/app/components/login/login-footer";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(() => (key: string) => key),
}));

describe("LoginFooter", () => {
  it("renders footer element", async () => {
    const jsx = await LoginFooter();
    const { container } = render(jsx);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });

  it("renders footer text via i18n", async () => {
    const jsx = await LoginFooter();
    render(jsx);
    expect(screen.getByText("footer")).toBeInTheDocument();
  });
});
