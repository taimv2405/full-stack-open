const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        username: 'anna',
        password: '123456',
        name: 'Anna',
      },
    });
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible();
    await expect(page.getByLabel('password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'anna', '123456');
      await expect(page.getByText('Anna logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'anna', 'wrong');

      const errorDiv = page.locator('.error');
      await expect(errorDiv).toContainText('invalid username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
      await expect(page.getByText('Anna logged in')).not.toBeVisible();
    });
  });
});
