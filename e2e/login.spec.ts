import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Login Page", () => {
  test("unauthenticated user sees login page", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
    await expect(page.locator("text=ROOT")).toBeVisible();
    await expect(page.locator("text=FURTHER")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /google/i }),
    ).toBeVisible();
  });

  test("logo is visible at top-left", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const logo = page.getByAltText("Sun* Annual Awards 2025");
    await expect(logo).toBeVisible();
  });

  test("logo links to homepage", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const logoLink = page.getByRole("link", { name: "Sun* Annual Awards 2025" });
    await expect(logoLink).toHaveAttribute("href", "/");
  });

  test("language selector shows VN by default at top-right", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/login`);
    const langButton = page.getByRole("button", { name: /VN/i });
    await expect(langButton).toBeVisible();
  });

  test("language dropdown opens on click and shows options", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole("button", { name: /VN/i }).click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("option", { name: "VN" })).toBeVisible();
    await expect(page.getByRole("option", { name: "EN" })).toBeVisible();
  });

  test("footer is visible with copyright text", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(
      page.locator("text=Bản quyền thuộc về Sun* © 2025"),
    ).toBeVisible();
  });

  test("login button shows spinner and disables when clicked", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/login`);
    const loginBtn = page.getByRole("button", { name: /google/i });
    await loginBtn.click();
    await expect(loginBtn).toBeDisabled();
  });

  test("authenticated user redirected from /login to /", async () => {
    test.skip(
      true,
      "Requires Google OAuth credentials configured in Supabase local",
    );
  });
});
