const { test, expect, beforeEach, describe } = require('@playwright/test');
const {
  loginWith,
  createBlog,
  goToBlog,
  likeNTimes,
  goToHome,
} = require('./helper');

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
    await page.getByRole('link', { name: 'login' }).click();
    await expect(page.getByLabel('username')).toBeVisible();
    await expect(page.getByLabel('password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, ANNA.username, ANNA.password);
      await expect(page.getByRole('link', { name: 'login' })).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, ANNA.username, 'wrong');

      await expect(
        page.getByText('invalid username or password'),
      ).toBeVisible();
      await expect(page.getByRole('link', { name: 'login' })).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'logout' }),
      ).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, ANNA.username, ANNA.password);
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, FIRST_CLASS);

      await expect(
        page.getByText(
          `a new blog ${FIRST_CLASS.title} by ${FIRST_CLASS.author}`,
        ),
      ).toBeVisible();
      await expect(
        page.getByRole('link', {
          name: `${FIRST_CLASS.title} by ${FIRST_CLASS.author}`,
        }),
      ).toBeVisible();
    });

    test('only creator can see blog delete button', async ({
      page,
      request,
    }) => {
      await request.post('/api/users', { data: BOB });
      await createBlog(page, GOTO);
      await page.getByRole('button', { name: 'logout' }).click();

      await loginWith(page, BOB.username, BOB.password);
      await goToBlog(page, GOTO);

      await expect(
        page.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible();
    });

    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, FIRST_CLASS);
        await createBlog(page, GOTO);
        await createBlog(page, CANONICAL);
      });

      test('one of those can be liked', async ({ page }) => {
        await goToBlog(page, FIRST_CLASS);
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('1 likes')).toBeVisible();
      });

      test('blog creator can delete the blog', async ({ page }) => {
        await goToBlog(page, GOTO);
        page.on('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click();
        await page.getByRole('heading', { name: 'blogs', level: 1 }).waitFor();
        await expect(
          page.getByRole('link', { name: `${GOTO.title} by ${GOTO.author}` }),
        ).not.toBeVisible();
      });

      test('blogs are arranged in likes desc order', async ({ page }) => {
        await goToBlog(page, FIRST_CLASS);
        await likeNTimes(page, 1);
        await goToHome(page);

        await goToBlog(page, GOTO);
        await likeNTimes(page, 2);
        await goToHome(page);

        await goToBlog(page, CANONICAL);
        await likeNTimes(page, 3);
        await goToHome(page);

        const rows = await page.getByRole('listitem');

        await expect(
          rows.nth(0).getByText(`${CANONICAL.title} by ${CANONICAL.author}`),
        ).toBeVisible();
        await expect(
          rows.nth(1).getByText(`${GOTO.title} by ${GOTO.author}`),
        ).toBeVisible();
        await expect(
          rows
            .nth(2)
            .getByText(`${FIRST_CLASS.title} by ${FIRST_CLASS.author}`),
        ).toBeVisible();
      });
    });
  });
});
