import { beforeEach, describe, expect, vi, it } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('./services/anecdoteService', () => ({
  default: {
    getAll: vi.fn(),
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
});
