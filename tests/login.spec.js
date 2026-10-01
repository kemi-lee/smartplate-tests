const { test, expect } = require('@playwright/test');

const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;
const LOGIN_PAGE = 'PHP/login.php';

test.describe('Login', () => {
  test('login page shows the form', async ({ page }) => {
    await page.goto(LOGIN_PAGE);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /sig/i })).toBeVisible();
  });

  test('valid credentials redirect to the dashboard', async ({ page }) => {
    await page.goto(LOGIN_PAGE);
    await page.locator('input[name="email"]').fill(EMAIL);
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: /sig/i }).click();

    await expect(page).toHaveURL(/dashboard/i);
  });

  test('wrong password shows an error and stays on login', async ({ page }) => {
    await page.goto(LOGIN_PAGE);
    await page.locator('input[name="email"]').fill(EMAIL);
    await page.locator('input[name="password"]').fill('definitely-the-wrong-password');
    await page.getByRole('button', { name: /sig/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/login\.php/);
  });

  test('empty form does not log the user in', async ({ page }) => {
    await page.goto(LOGIN_PAGE);
    await page.getByRole('button', { name: /sig/i }).click();
    await expect(page).toHaveURL(/login\.php/);
  });
});