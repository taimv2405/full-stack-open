import {
  useAnecdotes,
  useAnecdoteActions,
  useNotificationActions,
} from '../store';

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote, remove } = useAnecdoteActions();
  const { setMessage } = useNotificationActions();
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes);

  const handleVote = (anecdote) => {
    vote(anecdote.id);
    setMessage(`You voted '${anecdote.content}'`);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleRemove = async (anecdote) => {
    if (confirm(`Are you sure to remove ${anecdote.content}`)) {
      try {
        await remove(anecdote.id);
        setMessage(`You removed '${anecdote.content}'`);
      } catch (error) {
        setMessage(error.message);
      }
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleRemove(anecdote)}>remove</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
