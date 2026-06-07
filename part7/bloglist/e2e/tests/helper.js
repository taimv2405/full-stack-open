const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click();
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('link', { name: 'new blog' }).click();
  await page.getByLabel('title').fill(title);
  await page.getByLabel('author').fill(author);
  await page.getByLabel('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
  await page
    .getByRole('link', {
      name: `${title} by ${author}`,
    })
    .waitFor();
};

const goToBlog = async (page, { title, author }) =>
  await page.getByRole('link', { name: `${title} by ${author}` }).click();

const likeNTimes = async (page, n) => {
  for (let i = 1; i <= n; i++) {
    await page.getByRole('button', { name: 'like' }).click();
    await page.getByText(`${i} likes`).waitFor();
  }
};

const goToHome = async (page) =>
  await page.getByRole('link', { name: 'blogs' }).click();

module.exports = { loginWith, createBlog, goToBlog, likeNTimes, goToHome };
