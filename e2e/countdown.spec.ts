import { test, expect } from "@playwright/test";

test.describe("Countdown Page", () => {
  test("hiển thị countdown khi PRELAUNCH_MODE=true", async ({ page }) => {
    await page.goto("/countdown");
    await expect(page.locator("h1")).toContainText("Sự kiện sẽ bắt đầu sau");
    await expect(page.getByText("DAYS")).toBeVisible();
    await expect(page.getByText("HOURS")).toBeVisible();
    await expect(page.getByText("MINUTES")).toBeVisible();
  });

  test("middleware redirect về /countdown khi PRELAUNCH_MODE=true", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/countdown");
  });

  test("digit values là 2 ký tự số", async ({ page }) => {
    await page.goto("/countdown");
    const digits = page.locator('[data-testid="digit"]');
    const count = await digits.count();
    expect(count).toBe(6); // 2 digits × 3 units
    for (let i = 0; i < count; i++) {
      const text = await digits.nth(i).textContent();
      expect(text).toMatch(/^\d$/);
    }
  });
});
