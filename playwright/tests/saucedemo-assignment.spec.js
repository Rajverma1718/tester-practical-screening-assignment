// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com/';
const VALID_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page, username = VALID_USER, password = PASSWORD) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('SauceDemo screening assignment', () => {
  test('valid login reaches the product listing', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('[data-test="inventory-list"] .inventory_item')).toHaveCount(6);
  });

  test('invalid login shows a clear error and does not enter the store', async ({ page }) => {
    await login(page, VALID_USER, 'wrong_password');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(/Username and password do not match any user/i)).toBeVisible();
  });

  test('product listing exposes name and price for every product', async ({ page }) => {
    await login(page);
    const products = page.locator('[data-test="inventory-item"]');
    await expect(products).toHaveCount(6);
    for (const product of await products.all()) {
      await expect(product.locator('[data-test="inventory-item-name"]')).not.toBeEmpty();
      await expect(product.locator('[data-test="inventory-item-price"]')).toHaveText(/\$\d+\.\d{2}/);
    }
  });

  test('adding two products updates cart quantity and buttons', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
  });

  test('cart contains exactly the products that were selected', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toBeVisible();
  });

  test('checkout happy path completes with valid customer data', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('QA');
    await page.getByPlaceholder('Last Name').fill('Screening');
    await page.getByPlaceholder('Zip/Postal Code').fill('560001');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
  });

  test('logout returns the user to the login screen', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByText('Logout', { exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });
});
