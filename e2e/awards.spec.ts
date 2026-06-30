import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Awards Page — Auth Guard", () => {
  // Middleware checks countdown_date before auth — unauthenticated users land on
  // /login (post-launch) or /countdown (pre-launch), never on /awards itself.
  test("unauthenticated user cannot access /awards", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    await expect(page).not.toHaveURL(`${BASE_URL}/awards`);
    await expect(page).toHaveURL(/\/(login|countdown)/);
  });

  test("navigating to /awards without session redirects away", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto(`${BASE_URL}/awards`);
    await expect(page).not.toHaveURL(`${BASE_URL}/awards`);
    await expect(page).toHaveURL(/\/(login|countdown)/);
  });
});

test.describe("Awards Page — Authenticated", () => {
  test.skip(
    true,
    "Requires Google OAuth credentials configured in Supabase local — run manually after supabase start",
  );

  test("authenticated user sees awards page", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    await expect(page).toHaveURL(`${BASE_URL}/awards`);
  });

  test("header is visible with SAA logo", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    const logo = page.getByAltText("SAA 2025");
    await expect(logo).toBeVisible();
  });

  test("hero subtitle is visible", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    await expect(page.locator("text=Sun* Annual Award 2025")).toBeVisible();
  });

  test("hero section title is visible", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    await expect(page.locator("text=SAA 2025 Award System")).toBeVisible();
  });

  test("desktop awards nav sidebar is visible", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    const nav = page.getByRole("navigation", {
      name: "Danh mục giải thưởng",
    });
    await expect(nav).toBeVisible();
  });

  test("at least one award detail heading is visible", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    const firstHeading = page.locator("h2").first();
    await expect(firstHeading).toBeVisible();
  });

  test("kudos section is visible", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    await expect(page.getByText("Sun* Kudos")).toBeVisible();
  });

  test("footer is visible", async ({ page }) => {
    await page.goto(`${BASE_URL}/awards`);
    await expect(page.locator("footer")).toBeVisible();
  });
});
