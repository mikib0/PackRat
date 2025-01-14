import { test, expect } from '@playwright/test';

test('invalid login with empty email shows error message', async ({ page }) => {
  await page.goto('https://packrat.pages.dev/');
  await page.getByRole('link', { name: 'Get Started' }).click();

  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill("");
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill('12345678');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Verify the error message for invalid email format
const emailErrorMessage = page.locator('text=Email is required');
await expect(emailErrorMessage).toBeVisible({ timeout: 50000 }); // Adjust the timeout as needed
});
