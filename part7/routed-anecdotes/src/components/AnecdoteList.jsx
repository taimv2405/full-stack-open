const AnecdoteList = ({ anecdotes, removeAnecdote }) => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            {anecdote.content}{' '}
            <button onClick={() => removeAnecdote(anecdote.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnecdoteList;
