import {
  useAnecdotes,
  useAnecdoteActions,
  useNotificationActions,
} from '../store';

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote } = useAnecdoteActions();
  const { setMessage } = useNotificationActions();
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes);

  const handleVote = (anecdote) => {
    vote(anecdote.id);
    setMessage(`You voted '${anecdote.content}'`);
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
