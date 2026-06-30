import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileDropdown from "@/app/components/shared/profile-dropdown";

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const t: Record<string, string> = {
      account_label: "Account",
      dropdown_profile: "Profile",
      dropdown_dashboard: "Dashboard",
      dropdown_logout: "Logout",
    };
    return t[key] ?? key;
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

vi.mock("@/app/actions/auth/logout", () => ({
  logout: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe("ProfileDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders avatar button with fallback icon when no avatarUrl", () => {
    render(<ProfileDropdown isAdmin={false} />);
    const btn = screen.getByRole("button", { name: "Account" });
    expect(btn).toBeTruthy();
  });

  it("renders avatar image when avatarUrl is provided", () => {
    render(<ProfileDropdown isAdmin={false} userAvatarUrl="https://example.com/avatar.jpg" />);
    const img = screen.getByAltText("Avatar");
    expect(img).toBeTruthy();
  });

  it("dropdown is hidden initially", () => {
    render(<ProfileDropdown isAdmin={false} />);
    expect(screen.queryByText("Profile")).toBeNull();
    expect(screen.queryByText("Logout")).toBeNull();
  });

  it("opens dropdown on avatar click", () => {
    render(<ProfileDropdown isAdmin={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Logout")).toBeTruthy();
  });

  it("closes dropdown on second avatar click", () => {
    render(<ProfileDropdown isAdmin={false} />);
    const btn = screen.getByRole("button", { name: "Account" });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.queryByText("Profile")).toBeNull();
  });

  it("shows only Profile and Logout for regular user (no Dashboard)", () => {
    render(<ProfileDropdown isAdmin={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Logout")).toBeTruthy();
    expect(screen.queryByText("Dashboard")).toBeNull();
  });

  it("shows Profile, Dashboard, and Logout for admin", () => {
    render(<ProfileDropdown isAdmin={true} />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Dashboard")).toBeTruthy();
    expect(screen.getByText("Logout")).toBeTruthy();
  });

  it("closes dropdown when Profile is clicked (no navigation)", () => {
    render(<ProfileDropdown isAdmin={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    fireEvent.click(screen.getByText("Profile"));
    expect(screen.queryByText("Logout")).toBeNull();
  });

  it("calls logout action when Logout is clicked", async () => {
    const { logout } = await import("@/app/actions/auth/logout");
    render(<ProfileDropdown isAdmin={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    fireEvent.click(screen.getByText("Logout"));
    await waitFor(() => {
      expect(logout).toHaveBeenCalledOnce();
    });
  });

  it("closes dropdown when clicked outside", async () => {
    render(
      <div>
        <ProfileDropdown isAdmin={false} />
        <div data-testid="outside">outside</div>
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(screen.getByText("Logout")).toBeTruthy();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    await waitFor(() => {
      expect(screen.queryByText("Logout")).toBeNull();
    });
  });
});
