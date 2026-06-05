import { useAnecdotes } from '../hooks/useAnecdotes';

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdotes();

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
