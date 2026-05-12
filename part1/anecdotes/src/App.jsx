import { useState } from 'react';

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.',
];

const Anecdote = ({ text, votesCount }) => (
  <>
    <div>{text}</div>
    <div>has {votesCount} votes</div>
  </>
);

const App = () => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const maxVotes = Math.max(...votes);
  const mostVotedIndex = votes.indexOf(maxVotes);

  const handleVoteClick = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const handleNextClick = () => {
    let next = selected;
    while (next === selected)
      next = Math.floor(Math.random() * anecdotes.length);
    setSelected(next);
  };

  return (
    <>
      <h2>Anecdote of the day</h2>
      <Anecdote text={anecdotes[selected]} votesCount={votes[selected]} />
      <button onClick={handleVoteClick}>vote</button>
      <button onClick={handleNextClick}>next anecdote</button>

      <h2>Anecdote with most votes</h2>
      <Anecdote text={anecdotes[mostVotedIndex]} votesCount={maxVotes} />
    </>
  );
};

export default App;
