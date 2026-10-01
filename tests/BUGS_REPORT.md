# Bug Reports

## BUG-001: Vegetarian users are shown meat and fish in their meal plan
- **Status:** Open (tracked by an expected-failure test)
- **Environment:** Local AMPPS build, Chromium, October 1, 2026
- **Steps:** 1) Sign up with a new account. 2) Open the profile menu and choose Dietary Preferences. 3) Select Mix, 3 main meals, Some cooking, Some structure, and Vegetarian. 4) Save Preferences. 5) Open the Dashboard and look at Today's Meals.
- **Expected:** No meat or fish in the plan.
- **Actual:** Lunch is Grilled Chicken Caesar Salad and Dinner is Baked Salmon with Roasted Vegetables.
- **Severity:** High. A stated dietary restriction is ignored.
- **Notes:** The same four meals appeared for two separate accounts, so the plan may not be regenerating from preferences.

## BUG-002: Shopping list page does not redirect logged-out visitors
- **Status:** Fixed
- **Environment:** Local AMPPS build, Chromium, October 1, 2026
- **Steps:** 1) Open a private window (logged out). 2) Go to /PHP/shopping-list.php.
- **Expected:** Redirect to the login page.
- **Actual:** No redirect. The page showed a PHP warning ("headers already sent") exposing a server file path.
- **Root cause:** The login check ran after header.php had already output HTML, so the redirect failed.
- **Fix:** Moved the login check above the includes in shopping-list.php.
- **Severity:** Medium. No data or API access was exposed, but the page was unprotected and leaked a file path.
- **Found by:** Automated test "page redirects to login when not logged in."