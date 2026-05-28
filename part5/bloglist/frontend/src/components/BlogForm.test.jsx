import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('when a new blog is created', () => {
  let user;
  let handleCreate;

  beforeEach(async () => {
    handleCreate = vi.fn();
    user = userEvent.setup();

    render(<BlogForm onCreate={handleCreate} />);
    await user.type(screen.getByLabelText(/title/i), 'React patterns');
    await user.type(screen.getByLabelText(/author/i), 'Michael Chan');
    await user.type(
      screen.getByLabelText(/url/i),
      'https://reactpatterns.com/',
    );
    await user.click(screen.getByRole('button', { name: /create/i }));
  });

  test('calls the onCreate event handler with the right details', () => {
    expect(handleCreate.mock.calls).toHaveLength(1);
    expect(handleCreate.mock.calls[0][0].title).toBe('React patterns');
    expect(handleCreate.mock.calls[0][0].author).toBe('Michael Chan');
    expect(handleCreate.mock.calls[0][0].url).toBe(
      'https://reactpatterns.com/',
    );
  });
});
