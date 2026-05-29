const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click();
  await page.getByLabel('title').fill(title);
  await page.getByLabel('author').fill(author);
  await page.getByLabel('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
  await page.getByText(`${title} ${author}`).waitFor();
};

const getBlogRow = (page, { title, author }) =>
  page.getByText(`${title} ${author}`).locator('..');

const likeNTimes = async (page, blogRow, n) => {
  await blogRow.getByRole('button', { name: 'view' }).click();
  for (let i = 1; i <= n; i++) {
    await page.getByRole('button', { name: 'like' }).click();
    await page.getByText(`likes ${i}`).waitFor();
  }
  await blogRow.getByRole('button', { name: 'hide' }).click();
};

module.exports = { loginWith, createBlog, getBlogRow, likeNTimes };
