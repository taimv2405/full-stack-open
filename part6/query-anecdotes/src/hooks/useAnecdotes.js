import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests';

export const useAnecdotes = ({ onCreateSuccess, onCreateError, onVoteSuccess } = {}) => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const createAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (createdAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      onCreateSuccess?.(createdAnecdote);
    },
    onError: () => {
      onCreateError?.();
    },
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) =>
          anecdote.id === newAnecdote.id
            ? { ...anecdote, votes: newAnecdote.votes }
            : anecdote,
        ),
      );
      onVoteSuccess?.(newAnecdote);
    },
  });

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    createAnecdote: (content) =>
      createAnecdoteMutation.mutate({ content, votes: 0 }),
    voteAnecdote: (anecdote) =>
      updateAnecdoteMutation.mutate({
        ...anecdote,
        votes: anecdote.votes + 1,
      }),
  };
};
