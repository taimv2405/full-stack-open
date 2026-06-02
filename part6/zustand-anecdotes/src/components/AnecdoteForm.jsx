import { useAnecdoteActions } from '../store';

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedAnecdote = event.target.anecdote.value.trim();
    if (!trimmedAnecdote) return;
    add(trimmedAnecdote);
    event.target.reset();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
