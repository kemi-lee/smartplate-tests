const { test, expect } = require('@playwright/test');

const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

async function logIn(page) {
  await page.goto('PHP/login.php');
  await page.locator('input[name="email"]').fill(EMAIL);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: /sig/i }).click();
  await expect(page).toHaveURL(/dashboard/i);
}

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
  });

  test('shows the welcome message and main sections', async ({ page }) => {
    await expect(page.getByText(/welcome back/i).first()).toBeVisible();
    await expect(page.getByText("Today's Nutrition").first()).toBeVisible();
    await expect(page.getByText("Today's Meals").first()).toBeVisible();
  });

  test('sidebar shows the main features', async ({ page }) => {
    await expect(page.getByText('PlateBot').first()).toBeVisible();
    await expect(page.getByText('Nutrition Log').first()).toBeVisible();
    await expect(page.getByText('Shopping List Generator').first()).toBeVisible();
  });
});