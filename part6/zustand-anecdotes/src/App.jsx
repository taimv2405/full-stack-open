import { useAnecdotes, useAnecdoteActions } from './store';

const App = () => {
  const anecdotes = useAnecdotes();

  const { vote, add } = useAnecdoteActions();

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedAnecdote = event.target.anecdote.value.trim();
    if (!trimmedAnecdote) return;
    add(trimmedAnecdote);
    event.target.reset();
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
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

export default App;
