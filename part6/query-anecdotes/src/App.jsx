import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useAnecdotes } from './hooks/useAnecdotes';
import useNotification from './hooks/useNotification';

const App = () => {
  const { notify } = useNotification();
  const { anecdotes, isPending, isError, voteAnecdote } = useAnecdotes({
    onVoteSuccess: (anecdote) => notify(`anecdote '${anecdote.content}' voted`),
  });

  if (isPending) {
    return <div>fetching anecdotes...</div>;
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
