# Tester Practical Screening Assignment

This repository contains the Playwright automation suite created for the tester practical screening assignment.

## Run the assignment suite

```powershell
cd playwright
npm ci
npx playwright test tests/saucedemo-assignment.spec.js --config=playwright.local.config.js --reporter=line --timeout=30000
```

The suite covers seven SauceDemo scenarios: valid login, invalid login, product listing validation, adding products to the cart, cart content validation, checkout, and logout.

The local configuration uses an installed Chrome browser and disables video artifacts for a clean local run. The official Sauce Labs sample configuration remains available for Saucectl execution when Sauce credentials are configured.
