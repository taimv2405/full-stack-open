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
    await request.post('/api/users', {
      data: {
        username: 'bob',
        password: '123456',
        name: 'Bob',
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

    describe('and several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'First class tests',
          'Robert C. Martin',
          'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        );
        await createBlog(
          page,
          'Go To Statement Considered Harmful',
          'Edsger W. Dijkstra',
          'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        );
        await createBlog(
          page,
          'Canonical string reduction',
          'Edsger W. Dijkstra',
          'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        );
      });

      test('one of those can be liked', async ({ page }) => {
        const blogSummary = page
          .getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')
          .locator('..');
        await blogSummary.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('likes 1')).toBeVisible();
      });

      test('the user added the blog can delete it', async ({ page }) => {
        const blogSummary = page
          .getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')
          .locator('..');
        await blogSummary.getByRole('button', { name: 'view' }).click();
        page.on('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click();

        await expect(
          page.getByText(
            'Go To Statement Considered Harmful Edsger W. Dijkstra',
          ),
        ).not.toBeVisible();
      });

      test('the blogs are arranged in likes desc order', async ({ page }) => {
        const blogSummary1 = page
          .getByText('First class tests Robert C. Martin')
          .locator('..');
        await blogSummary1.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await page.getByText(`likes 1`).waitFor();
        await page.getByRole('button', { name: 'hide' }).click();

        const blogSummary2 = page
          .getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')
          .locator('..');
        await blogSummary2.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await page.getByText('likes 1').waitFor();
        await page.getByRole('button', { name: 'like' }).click();
        await page.getByText(`likes 2`).waitFor();
        await page.getByRole('button', { name: 'hide' }).click();

        const blogSummary3 = page
          .getByText('Canonical string reduction Edsger W. Dijkstra')
          .locator('..');
        await blogSummary3.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await page.getByText('likes 1').waitFor();
        await page.getByRole('button', { name: 'like' }).click();
        await page.getByText(`likes 2`).waitFor();
        await page.getByRole('button', { name: 'like' }).click();
        await page.getByText(`likes 3`).waitFor();
        await page.getByRole('button', { name: 'hide' }).click();

        const blogSummaries = await page
          .getByRole('button', { name: 'view' })
          .locator('..')
          .all();

        await expect(
          blogSummaries[0].getByText(
            'Canonical string reduction Edsger W. Dijkstra',
          ),
        ).toBeVisible();
        await expect(
          blogSummaries[1].getByText(
            'Go To Statement Considered Harmful Edsger W. Dijkstra',
          ),
        ).toBeVisible();
        await expect(
          blogSummaries[2].getByText('First class tests Robert C. Martin'),
        ).toBeVisible();
      });
    });
  });

  test('only creator can see blog delete button', async ({ page }) => {
    await loginWith(page, 'anna', '123456');
    await createBlog(
      page,
      'Go To Statement Considered Harmful',
      'Edsger W. Dijkstra',
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    );
    await page.getByRole('button', { name: 'log out' }).click();

    await loginWith(page, 'bob', '123456');
    const blogSummary = page
      .getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')
      .locator('..');
    await blogSummary.getByRole('button', { name: 'view' }).click();

    await expect(
      page.getByRole('button', { name: 'remove' }),
    ).not.toBeVisible();
  });
});
