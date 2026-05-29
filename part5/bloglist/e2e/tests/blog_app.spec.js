const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'anna', '123456');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'First class tests',
        'Robert C. Martin',
        'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      );

      await expect(
        page.getByText('a new blog First class tests by Robert C. Martin'),
      ).toBeVisible();
      await expect(
        page.getByText('First class tests Robert C. Martin'),
      ).toBeVisible();
    });
  });
});
