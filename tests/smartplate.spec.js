const { test, expect } = require('@playwright/test');

test('SmartPlate home page loads', async ({ page }) => {
  const response = await page.goto('');
  expect(response.status()).toBe(200);
});