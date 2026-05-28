import { render, screen } from '@testing-library/react';
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
