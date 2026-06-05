import { useAnecdotes } from '../hooks/useAnecdotes';
import useNotification from '../hooks/useNotification';

const AnecdoteForm = () => {
  const { notify } = useNotification();
  const { createAnecdote } = useAnecdotes({
    onCreateSuccess: (anecdote) => notify(`anecdote '${anecdote.content}' created`),
    onCreateError: () => notify('too short anecdote, must have length 5 or more'),
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.reset();
    createAnecdote(content);
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
