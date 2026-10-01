# SmartPlate Test Plan

## Scope
End-to-end tests for SmartPlate's core user flows, written with Playwright (JavaScript).
Tests run against a local environment (AMPPS: Apache, PHP, MySQL) in Chromium.

## Covered
| Area | What is tested |
|------|----------------|
| Home page | Site responds with HTTP 200 |
| Login | Form renders; valid credentials reach the dashboard; wrong password shows an error and stays on login; empty form is rejected |
| Registration | Form renders; new user can sign up; mismatched passwords rejected; empty form rejected; duplicate email rejected |
| Logout | Profile menu logout returns the user to login |
| Access control | Dashboard and shopping list redirect to login when logged out |
| Dashboard | Welcome message, Today's Nutrition and Today's Meals sections, sidebar features |
| Shopping list | Reachable from the sidebar; loads without PHP errors; empty state and "Go to Favorites" link for a new user |
| Dietary preferences and meal plan (AI) | New user saves preferences, sees the saved banner, and sees Breakfast, Lunch, and Dinner on the dashboard |

## Known bugs
See BUG_REPORTS.md. One open bug is tracked by an expected-failure test (`test.fail()`), so the suite stays green and flags itself once the bug is fixed.

## Not yet covered
- PlateBot chatbot
- Shopping list generation from saved recipes and PDF export
- Regenerate button on the shopping list
- Nutrition Log, Explore, Favorites, and Edit Profile pages
- Other dietary restrictions (Vegan, Halal, Kosher, Gluten-Free, Dairy-Free)
- Other browsers and mobile viewports

## Approach and risks
- AI output changes every run, so AI tests check structure (meal slots appear, no errors) and not exact wording.
- AI tests call a paid API, so they carry an `@ai` tag and are run on purpose: `npx playwright test --grep "@ai"`.
- Tests that register users create a new account each run with a unique email.
- Test credentials come from environment variables and are never committed.

## Environment
Local base URL: http://localhost/SmartPlateSeniors/