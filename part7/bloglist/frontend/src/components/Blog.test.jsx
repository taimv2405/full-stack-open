import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const ANNA_BLOG = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  user: { username: 'anna', name: 'Anna' },
};

const BOB = { username: 'bob', name: 'Bob' };
const ANNA = { username: 'anna', name: 'Anna' };

describe('Blog', () => {
  test('unauthenticated user sees blog info, no buttons', () => {
    render(<Blog blog={ANNA_BLOG} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'React patterns',
    );
    expect(screen.getByText('by Michael Chan')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: ANNA_BLOG.url }),
    ).toBeInTheDocument();
    expect(screen.getByText('7 likes')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'like' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument();
  });

  test('non-creator sees only like button', () => {
    render(<Blog blog={ANNA_BLOG} user={BOB} />);

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument();
  });

  test('creator sees like and remove buttons', () => {
    render(<Blog blog={ANNA_BLOG} user={ANNA} />);

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument();
  });

  test('like button calls handler twice when clicked twice', async () => {
    const handleLike = vi.fn();
    const user = userEvent.setup();
    render(<Blog blog={ANNA_BLOG} user={BOB} onLike={handleLike} />);

    const likeBtn = screen.getByRole('button', { name: 'like' });
    await user.click(likeBtn);
    await user.click(likeBtn);

    expect(handleLike).toHaveBeenCalledTimes(2);
  });
});
