import { useAnecdotes } from '../hooks/useAnecdotes';
import useNotification from '../hooks/useNotification';

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdotes();
  const { notify } = useNotification();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.reset();
    createAnecdote(content);
    notify(`anecdote '${content}' created`);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
