import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const blog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
};

test('renders title and author but not url and likes by default', () => {
  render(<Blog blog={blog} />);

  expect(screen.getByText(/React patterns/i)).toBeInTheDocument();
  expect(screen.getByText(/Michael Chan/i)).toBeInTheDocument();
  expect(screen.queryByText(blog.url, { exact: false })).not.toBeInTheDocument();
  expect(screen.queryByText(/likes.*7/i)).not.toBeInTheDocument();
});

describe('when view button is clicked', () => {
  let user;
  let handleLike;

  beforeEach(async () => {
    handleLike = vi.fn();
    user = userEvent.setup();
    render(<Blog blog={blog} onLike={handleLike} />);
    await user.click(screen.getByText(/view/i));
  });

  test('shows URL and number of likes', () => {
    expect(screen.getByText(blog.url, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/likes.*7/i)).toBeInTheDocument();
  });
});
