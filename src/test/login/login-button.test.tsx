import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginButton from "@/app/components/login/login-button";

vi.mock("@/app/login/actions", () => ({
  signInWithGoogle: vi.fn(() => new Promise(() => {})), // never resolves — simulates redirect hang
}));

describe("LoginButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders label text", () => {
    render(<LoginButton label="Đăng nhập bằng Google" />);
    expect(screen.getByText("Đăng nhập bằng Google")).toBeInTheDocument();
  });

  it("renders Google icon initially", () => {
    render(<LoginButton label="Đăng nhập bằng Google" />);
    expect(screen.getByAltText("Google")).toBeInTheDocument();
  });

  it("is enabled by default", () => {
    render(<LoginButton label="Đăng nhập bằng Google" />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("shows loading spinner and disables button when clicked", async () => {
    render(<LoginButton label="Đăng nhập bằng Google" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(screen.queryByAltText("Google")).not.toBeInTheDocument();
  });

  it("has cursor-pointer class", () => {
    render(<LoginButton label="Đăng nhập bằng Google" />);
    expect(screen.getByRole("button").className).toContain("cursor-pointer");
  });
});
