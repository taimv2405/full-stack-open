import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders title and author but not url and likes by default', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };

  render(<Blog blog={blog} />);

  expect(screen.getByText(/React patterns/i)).toBeInTheDocument();
  expect(screen.getByText(/Michael Chan/i)).toBeInTheDocument();
  expect(
    screen.queryByText(blog.url, { exact: false }),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/likes:?\s*7/i)).not.toBeInTheDocument();
});

test('show URL and number of likes when view details button has been clicked', async () => {
  const user = userEvent.setup();
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };

  render(<Blog blog={blog} />);
  const viewBtn = screen.getByText(/view/i);
  await user.click(viewBtn);

  expect(screen.getByText(blog.url, { exact: false })).toBeInTheDocument();
  expect(screen.getByText(/likes:?\s*7/i)).toBeInTheDocument();
});
