import { useEffect, useState } from 'react';
import anecdoteService from '../services/anecdotes';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => setValue('');

  return { inputProps: { type, value, onChange }, reset };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService
      .getAll()
      .then((returnedAnecdotes) => setAnecdotes(returnedAnecdotes));
  }, []);

  const addAnecdote = (anecdote) => {
    anecdoteService
      .createNew(anecdote)
      .then((createdAnecdote) =>
        setAnecdotes((prev) => [...prev, createdAnecdote]),
      );
  };

  return { anecdotes, addAnecdote };
};
