const BASE_URL = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch anecdotes');
  return await response.json();
};

const create = async (anecdote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  };
  const response = await fetch(BASE_URL, options);
  if (!response.ok) throw new Error('Failed to create anecdote');
  return await response.json();
};

const update = async (id, anecdote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  };
  const response = await fetch(`${BASE_URL}/${id}`, options);
  if (!response.ok) throw new Error('Failed to update anecdote');
  return await response.json();
};

const remove = async (id) => {
  const options = { method: 'DELETE' };
  const response = await fetch(`${BASE_URL}/${id}`, options);
  if (!response.ok) throw new Error('Failed to remove anecdote');
  return await response.json();
};

export default { getAll, create, update, remove };
