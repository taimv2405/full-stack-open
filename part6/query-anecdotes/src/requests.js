const BASE_URL = 'http://localhost:3001/anecdotes';

export const getAnecdotes = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes');
  }
  return await response.json();
};
