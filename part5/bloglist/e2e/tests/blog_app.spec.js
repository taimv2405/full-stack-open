const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog, getBlogRow, likeNTimes } = require('./helper');

const ANNA = { username: 'anna', password: '123456', name: 'Anna' };
const BOB = { username: 'bob', password: '123456', name: 'Bob' };

const FIRST_CLASS = {
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
};
const GOTO = {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
};
const CANONICAL = {
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
};

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', { data: ANNA });
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible();
    await expect(page.getByLabel('password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, ANNA.username, ANNA.password);
      await expect(page.getByText('Anna logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, ANNA.username, 'wrong');

      const errorDiv = page.locator('.error');
      await expect(errorDiv).toContainText('invalid username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
      await expect(page.getByText('Anna logged in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, ANNA.username, ANNA.password);
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, FIRST_CLASS);

      await expect(
        page.getByText(`a new blog ${FIRST_CLASS.title} by ${FIRST_CLASS.author}`),
      ).toBeVisible();
      await expect(
        page.getByText(`${FIRST_CLASS.title} ${FIRST_CLASS.author}`),
      ).toBeVisible();
    });

    test('only creator can see blog delete button', async ({ page, request }) => {
      await request.post('/api/users', { data: BOB });
      await createBlog(page, GOTO);
      await page.getByRole('button', { name: 'log out' }).click();

      await loginWith(page, BOB.username, BOB.password);
      await getBlogRow(page, GOTO).getByRole('button', { name: 'view' }).click();

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
    });

    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, FIRST_CLASS);
        await createBlog(page, GOTO);
        await createBlog(page, CANONICAL);
      });

      test('one of those can be liked', async ({ page }) => {
        await getBlogRow(page, GOTO).getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('likes 1')).toBeVisible();
      });

      test('blog creator can delete the blog', async ({ page }) => {
        await getBlogRow(page, GOTO).getByRole('button', { name: 'view' }).click();
        page.on('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click();

        await expect(
          page.getByText(`${GOTO.title} ${GOTO.author}`),
        ).not.toBeVisible();
      });

      test('blogs are arranged in likes desc order', async ({ page }) => {
        await likeNTimes(page, getBlogRow(page, FIRST_CLASS), 1);
        await likeNTimes(page, getBlogRow(page, GOTO), 2);
        await likeNTimes(page, getBlogRow(page, CANONICAL), 3);

        const rows = await page
          .getByRole('button', { name: 'view' })
          .locator('..')
          .all();

        await expect(rows[0].getByText(`${CANONICAL.title} ${CANONICAL.author}`)).toBeVisible();
        await expect(rows[1].getByText(`${GOTO.title} ${GOTO.author}`)).toBeVisible();
        await expect(rows[2].getByText(`${FIRST_CLASS.title} ${FIRST_CLASS.author}`)).toBeVisible();
      });
    });
  });
});
