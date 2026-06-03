import { create } from 'zustand';
import anecdoteService from './services/anecdoteService';

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: (id) =>
      set((state) => ({
        anecdotes: state.anecdotes.map((anecdote) =>
          anecdote.id === id
            ? { ...anecdote, votes: anecdote.votes + 1 }
            : anecdote,
        ),
      })),
    add: (anecdote) =>
      set((state) => ({ anecdotes: [...state.anecdotes, asObject(anecdote)] })),
    setFilter: (newFilter) => set(() => ({ filter: newFilter })),
    initialize: async () => {
      try {
        const returnedAnecdotes = await anecdoteService.getAll();
        set(() => ({ anecdotes: returnedAnecdotes }));
      } catch (error) {
        console.error(error.message);
      }
    },
  },
}));

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter);
  return anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase()),
  );
};
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
