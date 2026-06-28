import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Homepage — Auth Guard", () => {
  test("unauthenticated user is redirected to /login", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});

test.describe("Homepage — Authenticated", () => {
  test.skip(
    true,
    "Requires Google OAuth credentials configured in Supabase local — run manually after supabase start",
  );

  test("authenticated user sees homepage with all sections", async ({
    page,
  }) => {
    // Auth setup would go here (cookie injection or test helper)
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveURL(`${BASE_URL}/`);

    // Header
    const logo = page.getByAltText("SAA 2025");
    await expect(logo).toBeVisible();

    // Hero section
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "ROOT FURTHER",
    );

    // Countdown timer — 3 digit blocks
    const countdownSection = page.locator("section").first();
    await expect(countdownSection).toBeVisible();

    // Awards section — 6 cards
    const awardLinks = page.locator("section").nth(3).getByRole("link");
    await expect(awardLinks).toHaveCount(6);

    // Kudos section
    await expect(page.getByText("Sun* Kudos")).toBeVisible();

    // Footer
    await expect(page.locator("footer")).toBeVisible();

    // Widget button — fixed bottom-right
    const widgetBtn = page.getByRole("button", { name: "Menu" });
    await expect(widgetBtn).toBeVisible();
  });

  test("header nav links are visible on desktop", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole("link", { name: "About SAA 2025" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Awards Information" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Sun* Kudos" }),
    ).toBeVisible();
  });

  test("footer has copyright text", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(
      page.locator("text=Bản quyền thuộc về Sun* © 2025"),
    ).toBeVisible();
  });
});

test.describe("Homepage — Auth Guard (unauthenticated)", () => {
  test("navigating to / without session redirects to /login", async ({
    page,
  }) => {
    // Clear all cookies/storage to ensure no session
    await page.context().clearCookies();
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveURL(/\/login/);
  });
});
