import '@testing-library/jest-dom/vitest';
import { describe, beforeEach, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnecdoteList from './AnecdoteList';
import useAnecdoteStore from '../store';

describe('AnecdoteList', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' });
  });
  it('renders anecdotes sorted by votes', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          id: '47145',
          votes: 5,
        },
        {
          content: 'Premature optimization is the root of all evil.',
          id: '25170',
          votes: 10,
        },
      ],
    });

    render(<AnecdoteList />);

    const renderedItems = screen.getAllByTestId('anecdote-item');

    expect(renderedItems[0]).toHaveTextContent(
      'Premature optimization is the root of all evil.',
    );

    expect(renderedItems[1]).toHaveTextContent('If it hurts, do it more often');
  });
});
