import { create } from 'zustand';
import anecdoteService from './services/anecdoteService';

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
    add: async (content) => {
      const anecdote = await anecdoteService.create({ content, votes: 0 });
      set((state) => ({ anecdotes: [...state.anecdotes, anecdote] }));
    },
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
