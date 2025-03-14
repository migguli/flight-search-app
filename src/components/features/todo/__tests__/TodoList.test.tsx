import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoList } from '../TodoList';

describe('TodoList', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders the todo list', () => {
    render(<TodoList />);
    expect(screen.getByText('My Todo List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
  });

  it('adds a new todo', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add todo' });

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  it('toggles todo completion', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add todo' });

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox', { name: 'Mark "Test todo" as complete' }) as HTMLInputElement;
    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
    const todoText = screen.getByText('Test todo');
    expect(todoText).toHaveClass('line-through');
  });

  it('deletes a todo', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add todo' });

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(addButton);

    const deleteButton = screen.getByRole('button', { name: 'Delete "Test todo"' });
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Test todo')).not.toBeInTheDocument();
  });

  it('persists todos in localStorage', () => {
    const { rerender } = render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add todo' });

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(addButton);

    // Re-render the component to simulate a page refresh
    rerender(<TodoList />);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });
}); 