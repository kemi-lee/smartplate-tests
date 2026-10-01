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

// Creates a brand-new account (no recipes added) and ends on the dashboard
async function signUpNewUser(page) {
  const email = `qa.shoplist.${Date.now()}@example.com`;
  const password = 'TestPass123!';

  await page.goto('PHP/signup.php');
  await page.locator('input[name="name"]').fill('QA Tester');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirm_password"]').fill(password);
  await page.locator('button[type="submit"], input[type="submit"]').first().click();

  await page.waitForLoadState('networkidle');
  if (/login\.php/.test(page.url())) {
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: /sig/i }).click();
  }
  if (!/dashboard/i.test(page.url())) {
    await page.goto('PHP/dashboard.php');
  }
  await expect(page).toHaveURL(/dashboard/i);
}

test.describe('Shopping list', () => {
  test('page redirects to login when not logged in', async ({ page }) => {
    await page.goto('PHP/shopping-list.php');
    await expect(page).toHaveURL(/login\.php/);
  });

  test('logged-in user can reach it from the dashboard sidebar', async ({ page }) => {
    await logIn(page);
    await page.getByText('Shopping List Generator').first().click();
    await expect(page).toHaveURL(/shopping-list/i);
  });

  test('page loads without PHP errors', async ({ page }) => {
    await logIn(page);
    await page.goto('PHP/shopping-list.php');
    await expect(page).toHaveURL(/shopping-list/i);
    await expect(page.locator('body')).not.toContainText(/fatal error|parse error|warning:|notice:/i);
  });

  test('new user with no recipes sees the empty state', async ({ page }) => {
    await signUpNewUser(page);
    await page.goto('PHP/shopping-list.php');

    await expect(page.getByText(/no recipes added yet/i)).toBeVisible();
    const favoritesLink = page.getByRole('link', { name: 'Go to Favorites' });
    await expect(favoritesLink).toBeVisible();

    // The link actually takes the user to Favorites
    await favoritesLink.click();
    await expect(page).toHaveURL(/favorites/i);
  });
});