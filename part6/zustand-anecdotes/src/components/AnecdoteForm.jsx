import { useAnecdoteActions, useNotificationActions } from '../store';

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const { setMessage } = useNotificationActions();

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedAnecdote = event.target.anecdote.value.trim();
    if (!trimmedAnecdote) return;
    add(trimmedAnecdote);
    setMessage(`You created '${trimmedAnecdote}'`);
    setTimeout(() => setMessage(null), 5000);
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
