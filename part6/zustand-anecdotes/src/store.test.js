import { beforeEach, describe, expect, vi, it } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('./services/anecdoteService', () => ({
  default: {
    getAll: vi.fn(),
    update: vi.fn(),
  },
}));

import anecdoteService from './services/anecdoteService';
import useAnecdoteStore, { useAnecdoteActions, useAnecdotes } from './store';
import { act } from 'react';

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' });
  vi.resetAllMocks();
});

describe('useAnecdoteActions', () => {
  it('initialize the anecdotes returned by the backend.', async () => {
    const mockAnecdotes = [
      { content: 'If it hurts, do it more often', id: '47145', votes: 0 },
    ];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const { result } = renderHook(() => ({
      anecdotes: useAnecdotes(),
      actions: useAnecdoteActions(),
    }));

    await act(async () => await result.current.actions.initialize());

    expect(result.current.anecdotes).toEqual(mockAnecdotes);
  });
  it('voting increases the number of votes for an anecdote.', async () => {
    const anecdotes = [
      { content: 'If it hurts, do it more often', id: '47145', votes: 0 },
    ];
    useAnecdoteStore.setState({ anecdotes });

    anecdoteService.update.mockResolvedValue({ ...anecdotes[0], votes: 1 });

    const { result } = renderHook(() => ({
      anecdotes: useAnecdotes(),
      actions: useAnecdoteActions(),
    }));

    await act(async () => await result.current.actions.vote('47145'));

    expect(result.current.anecdotes[0].votes).toBe(1);
  });
});

describe('useAnecdotes', () => {
  it('returns a properly filtered list of anecdotes.', async () => {
    const anecdotes = [
      {
        content: 'If it hurts, do it more often',
        id: '47145',
        votes: 0,
      },
      {
        content: 'Adding manpower to a late software project makes it later!',
        id: '21149',
        votes: 0,
      },
      {
        content: 'Premature optimization is the root of all evil.',
        id: '25170',
        votes: 0,
      },
    ];

    useAnecdoteStore.setState({ anecdotes, filter: 'it' });

    const { result } = renderHook(() => useAnecdotes());

    expect(result.current).toHaveLength(2);
    expect(result.current).toContainEqual(anecdotes[0]);
    expect(result.current).toContainEqual(anecdotes[1]);
    expect(result.current).not.toContainEqual(anecdotes[2]);
  });
});
