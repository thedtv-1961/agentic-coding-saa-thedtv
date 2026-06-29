import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("FAB Widget", () => {
  test.skip(
    true,
    "Requires authenticated session and Supabase local — run manually after supabase start and login setup",
  );

  test("FAB is visible on homepage", async ({ page }) => {
    // Note: This test requires a logged-in user session
    // Either: 1) Set up auth helper in beforeEach, or 2) Run manually after login
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await expect(fab).toBeVisible();
  });

  test("FAB expands when clicked", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const rulesBtn = page.getByTestId("fab-rules");
    const writeKudosBtn = page.getByTestId("fab-write-kudos");

    await expect(rulesBtn).toBeVisible();
    await expect(writeKudosBtn).toBeVisible();
  });

  test("FAB collapses when cancel button is clicked", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const cancelBtn = page.getByTestId("fab-cancel");
    await cancelBtn.click();

    const rulesBtn = page.getByTestId("fab-rules");
    await expect(rulesBtn).not.toBeVisible();
  });

  test("Thể Lệ drawer opens when rules button is clicked", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const rulesBtn = page.getByTestId("fab-rules");
    await rulesBtn.click();

    const drawer = page.getByTestId("the-le-drawer");
    await expect(drawer).toBeVisible();
  });

  test("Thể Lệ drawer closes when close button is clicked", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const rulesBtn = page.getByTestId("fab-rules");
    await rulesBtn.click();

    const drawer = page.getByTestId("the-le-drawer");
    await expect(drawer).toBeVisible();

    const closeBtn = page.getByTestId("drawer-close-btn");
    await closeBtn.click();

    await expect(drawer).not.toBeVisible();
  });

  test("Thể Lệ drawer closes when Escape is pressed", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const rulesBtn = page.getByTestId("fab-rules");
    await rulesBtn.click();

    const drawer = page.getByTestId("the-le-drawer");
    await expect(drawer).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(drawer).not.toBeVisible();
  });

  test("Viết KUDOS modal opens when button is clicked", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const writeKudosBtn = page.getByTestId("fab-write-kudos");
    await writeKudosBtn.click();

    const modal = page.getByTestId("kudos-modal");
    await expect(modal).toBeVisible();
  });

  test("submit button is disabled when form is empty", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const writeKudosBtn = page.getByTestId("fab-write-kudos");
    await writeKudosBtn.click();

    const submitBtn = page.getByTestId("kudos-submit-btn");
    await expect(submitBtn).toBeDisabled();
  });
});

test.describe("Viết KUDOS Happy Path", () => {
  test.skip(
    true,
    "Requires authenticated session with test users in database — set up manually",
  );

  test("submit kudos form successfully end-to-end", async ({ page }) => {
    // Auth setup required here (session cookie or login helper)
    await page.goto(`${BASE_URL}/`);

    // Step 1: Expand FAB and click Write KUDOS
    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const writeKudosBtn = page.getByTestId("fab-write-kudos");
    await writeKudosBtn.click();

    const modal = page.getByTestId("kudos-modal");
    await expect(modal).toBeVisible();

    // Step 2: Select recipient
    const recipientSearch = page.getByTestId("recipient-search");
    await recipientSearch.fill("Test");
    await page.waitForTimeout(300); // Wait for search results

    const recipientOption = page.locator('[data-testid="recipient-option"]').first();
    await expect(recipientOption).toBeVisible();
    await recipientOption.click();

    // Step 3: Enter content
    const contentEditor = page.getByTestId("kudos-content");
    await contentEditor.click();
    await contentEditor.fill("Cảm ơn bạn đã hỗ trợ tôi rất nhiều!");

    // Step 4: Add hashtag
    const hashtagAddBtn = page.getByTestId("hashtag-add-btn");
    await hashtagAddBtn.click();

    const hashtagOption = page.locator('[data-testid="hashtag-option"]').first();
    await expect(hashtagOption).toBeVisible();
    await hashtagOption.click();

    // Step 5: Submit
    const submitBtn = page.getByTestId("kudos-submit-btn");
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Step 6: Verify success
    await expect(modal).not.toBeVisible();

    const successToast = page.getByTestId("success-toast");
    await expect(successToast).toBeVisible();
  });

  test("show error when recipient is not selected", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const writeKudosBtn = page.getByTestId("fab-write-kudos");
    await writeKudosBtn.click();

    // Try to submit without selecting recipient
    const submitBtn = page.getByTestId("kudos-submit-btn");
    // Button should be disabled, so we check disabled state
    await expect(submitBtn).toBeDisabled();
  });

  test("show error when content is empty", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const writeKudosBtn = page.getByTestId("fab-write-kudos");
    await writeKudosBtn.click();

    // Select recipient
    const recipientSearch = page.getByTestId("recipient-search");
    await recipientSearch.fill("Test");
    await page.waitForTimeout(300);

    const recipientOption = page.locator('[data-testid="recipient-option"]').first();
    await recipientOption.click();

    // Don't fill content — submit button should still be disabled
    const submitBtn = page.getByTestId("kudos-submit-btn");
    await expect(submitBtn).toBeDisabled();
  });

  test("show error when no hashtag is selected", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const writeKudosBtn = page.getByTestId("fab-write-kudos");
    await writeKudosBtn.click();

    // Select recipient
    const recipientSearch = page.getByTestId("recipient-search");
    await recipientSearch.fill("Test");
    await page.waitForTimeout(300);

    const recipientOption = page.locator('[data-testid="recipient-option"]').first();
    await recipientOption.click();

    // Fill content
    const contentEditor = page.getByTestId("kudos-content");
    await contentEditor.fill("Cảm ơn!");

    // Don't add hashtag — submit button should still be disabled
    const submitBtn = page.getByTestId("kudos-submit-btn");
    await expect(submitBtn).toBeDisabled();
  });
});

test.describe("Thể Lệ Drawer Content", () => {
  test.skip(
    true,
    "Requires authenticated session — run manually after login",
  );

  test("drawer displays rules content", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const rulesBtn = page.getByTestId("fab-rules");
    await rulesBtn.click();

    const drawer = page.getByTestId("the-le-drawer");
    // Verify drawer has content (at least one heading or text)
    const content = drawer.locator("text=/.*Thể Lệ.*/i");
    await expect(content).toBeVisible();
  });

  test("drawer has write-kudos button in footer", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const rulesBtn = page.getByTestId("fab-rules");
    await rulesBtn.click();

    const writeKudosFooterBtn = page.getByTestId("drawer-write-kudos-btn");
    await expect(writeKudosFooterBtn).toBeVisible();
  });

  test("clicking drawer write-kudos button opens modal", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    const fab = page.getByTestId("fab-collapsed");
    await fab.click();

    const rulesBtn = page.getByTestId("fab-rules");
    await rulesBtn.click();

    const writeKudosFooterBtn = page.getByTestId("drawer-write-kudos-btn");
    await writeKudosFooterBtn.click();

    const modal = page.getByTestId("kudos-modal");
    await expect(modal).toBeVisible();
  });
});
