# SmartPlate Tests

Automated end-to-end tests for SmartPlate, a full-stack nutrition web app (PHP, MySQL, Bootstrap, JavaScript), written with Playwright.

## What's covered
Login, registration, logout, access control, dashboard, shopping list, and the dietary preferences to meal plan flow. See TEST_PLAN.md for coverage and gaps, and BUG_REPORTS.md for defects found.

## Setup
1. Start SmartPlate locally (AMPPS: Apache and MySQL) at http://localhost/SmartPlateSeniors/
2. Create a test account in SmartPlate.
3. Install dependencies: `npm install`
4. Set credentials (PowerShell):
   $env:TEST_EMAIL="your-test-email"
   $env:TEST_PASSWORD="your-test-password"

## Run the tests
- Everything except AI tests: `npx playwright test --grep-invert "@ai" --project=chromium`
- AI tests only (uses API credits): `npx playwright test --grep "@ai" --project=chromium`
- Visual mode: `npx playwright test --ui`

## Testing approach
Tests were first done manually during development, then the critical user flows were automated.