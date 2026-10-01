const { test, expect } = require('@playwright/test');

const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

const LOGIN_PAGE = 'PHP/login.php';
const SIGNUP_PAGE = 'PHP/signup.php';
const DASHBOARD_PAGE = 'PHP/dashboard.php'; 

async function logIn(page) {
  await page.goto(LOGIN_PAGE);
  await page.locator('input[name="email"]').fill(EMAIL);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: /sig/i }).click();
  await expect(page).toHaveURL(/dashboard/i);
}

async function logOut(page) {
  // Open the profile menu
  await page.getByRole('button', { name: 'Open profile menu' }).click();
  // Click the logout link inside the dropdown
  await page.locator('#profileDropdown a[href="logout.php"]').click();
}

test.describe('Registration', () => {
  test('signup page shows the form', async ({ page }) => {
    await page.goto(SIGNUP_PAGE);
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirm_password"]')).toBeVisible();
  });

  test('new user can sign up', async ({ page }) => {
    // Unique email each run so repeated runs don't collide
    const uniqueEmail = `qa.user.${Date.now()}@example.com`;

    await page.goto(SIGNUP_PAGE);
    await page.locator('input[name="name"]').fill('QA Tester');
    await page.locator('input[name="email"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill('TestPass123!');
    await page.locator('input[name="confirm_password"]').fill('TestPass123!');
    await page.locator('button[type="submit"], input[type="submit"]').first().click();

    // We should have left the signup page
    await expect(page).not.toHaveURL(/signup\.php/);
  });

  test('mismatched passwords are rejected', async ({ page }) => {
    await page.goto(SIGNUP_PAGE);
    await page.locator('input[name="name"]').fill('QA Tester');
    await page.locator('input[name="email"]').fill(`qa.mismatch.${Date.now()}@example.com`);
    await page.locator('input[name="password"]').fill('TestPass123!');
    await page.locator('input[name="confirm_password"]').fill('DifferentPass456!');
    await page.locator('button[type="submit"], input[type="submit"]').first().click();

    await expect(page).toHaveURL(/signup\.php/);
  });

  test('empty signup form is rejected', async ({ page }) => {
    await page.goto(SIGNUP_PAGE);
    await page.locator('button[type="submit"], input[type="submit"]').first().click();
    await expect(page).toHaveURL(/signup\.php/);
  });

  test('existing email cannot sign up again', async ({ page }) => {
    await page.goto(SIGNUP_PAGE);
    await page.locator('input[name="name"]').fill('QA Tester');
    await page.locator('input[name="email"]').fill(EMAIL);
    await page.locator('input[name="password"]').fill('TestPass123!');
    await page.locator('input[name="confirm_password"]').fill('TestPass123!');
    await page.locator('button[type="submit"], input[type="submit"]').first().click();

    await expect(page).toHaveURL(/signup\.php/);
  });
});

test.describe('Logout and access control', () => {
  test('logout returns the user to the login page', async ({ page }) => {
    await logIn(page);
    await logOut(page);
    await expect(page).toHaveURL(/login\.php/);
  });

  test('dashboard is blocked after logging out', async ({ page }) => {
    await logIn(page);
    await logOut(page);
    await expect(page).toHaveURL(/login\.php/);

    await page.goto(DASHBOARD_PAGE);
    await expect(page).toHaveURL(/login\.php/);
  });

  test('dashboard redirects to login when not logged in', async ({ page }) => {
    await page.goto(DASHBOARD_PAGE);
    await expect(page).toHaveURL(/login\.php/);
  });
});