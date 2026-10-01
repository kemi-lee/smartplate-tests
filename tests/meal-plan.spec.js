const { test, expect } = require('@playwright/test');

// Signs up a new user and saves dietary preferences with "Vegetarian" selected
async function signUpAndSavePreferences(page) {
  const email = `qa.mealplan.${Date.now()}@example.com`;
  const password = 'TestPass123!';

  // Sign up
  await page.goto('PHP/signup.php');
  await page.locator('input[name="name"]').fill('QA Tester');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirm_password"]').fill(password);
  await page.locator('button[type="submit"], input[type="submit"]').first().click();

  // If signup sends the user to login, log in with the new account
  await page.waitForLoadState('networkidle');
  if (/login\.php/.test(page.url())) {
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: /sig/i }).click();
  }

  // Make sure we are on the dashboard
  if (!/dashboard/i.test(page.url())) {
    await page.goto('PHP/dashboard.php');
  }
  await expect(page).toHaveURL(/dashboard/i);

  // Open the profile menu and go to the survey
  await page.getByRole('button', { name: 'Open profile menu' }).click();
  await page.locator('#profileDropdown').getByText('Dietary Preferences').click();

  // Fill out the survey
  const saveButton = page.getByRole('button', { name: /save preferences/i });
  await expect(saveButton).toBeVisible({ timeout: 30000 });
  await page.getByText('Mix', { exact: true }).click();
  await page.getByText('3 main meals', { exact: true }).click();
  await page.getByText('Some cooking', { exact: true }).click();
  await page.getByText('Some structure', { exact: true }).click();
  await page.getByText('Vegetarian', { exact: true }).click();

  // Save and confirm the site shows the saved banner
  await saveButton.click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(/preferences have been saved/i)).toBeVisible();
}

test('new user saves dietary preferences and sees a meal plan @ai', async ({ page }) => {
  test.setTimeout(120000);

  await signUpAndSavePreferences(page);

  await page.goto('PHP/dashboard.php');
  await expect(page.getByText("Today's Meals").first()).toBeVisible({ timeout: 30000 });

  // Meal slots are displayed
  for (const slot of ['Breakfast', 'Lunch', 'Dinner']) {
    await expect(page.getByText(slot, { exact: true }).first()).toBeVisible({ timeout: 30000 });
  }

  // No error messages on the page
  await expect(page.locator('body')).not.toContainText(/fatal error|warning:|something went wrong|failed to generate/i);

  await page.screenshot({ path: 'test-results/dashboard-after-save.png', fullPage: true });
});

test('vegetarian preference keeps meat and fish out of the meal plan @ai', async ({ page }) => {
  test.setTimeout(120000);

  // Known bug (BUG-001): vegetarian users are still given chicken and salmon.
  // test.fail() lets this test pass while the bug exists, and it will report
  // an unexpected pass once the bug is fixed, so the line can then be removed.
  test.fail();

  await signUpAndSavePreferences(page);

  await page.goto('PHP/dashboard.php');
  await expect(page.getByText('Breakfast', { exact: true }).first()).toBeVisible({ timeout: 30000 });

  const pageText = await page.locator('body').innerText();
  expect(pageText).not.toMatch(/chicken|beef|pork|turkey|bacon|ham\b|salmon|tuna|shrimp|fish|lamb/i);
});