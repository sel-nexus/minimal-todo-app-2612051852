import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.jsx';

afterEach(() => {
  cleanup();
});

describe('Todo App task lifecycle', () => {
  it('renders the heading, empty state, and persistent list skeleton', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Todo App' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');
    expect(screen.getByTestId('todo-list').tagName).toBe('UL');
  });

  it('adds trimmed tasks by button with sequential IDs and clears the input', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Add a task' });

    await user.type(input, '  First task  ');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-title-1')).toHaveTextContent('First task');
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();

    await user.type(input, 'Second task');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    const items = within(screen.getByTestId('todo-list')).getAllByRole('listitem');
    expect(items.map((item) => item.getAttribute('data-testid'))).toEqual([
      'todo-item-1',
      'todo-item-2',
    ]);
  });

  it('adds a task with Enter and ignores blank or whitespace-only submissions', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Add a task' });
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.click(addButton);
    await user.type(input, '   ');
    await user.keyboard('{Enter}');

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');

    await user.clear(input);
    await user.type(input, 'Keyboard task{Enter}');

    expect(screen.getByTestId('todo-title-1')).toHaveTextContent('Keyboard task');
    expect(input).toHaveValue('');
  });

  it('toggles only the selected task and updates its title decoration', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Add a task' });

    await user.type(input, 'First');
    await user.keyboard('{Enter}');
    await user.type(input, 'Second');
    await user.keyboard('{Enter}');

    const firstCheckbox = screen.getByTestId('todo-checkbox-1');
    const secondCheckbox = screen.getByTestId('todo-checkbox-2');
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'none' });

    await user.click(firstCheckbox);

    expect(firstCheckbox).toBeChecked();
    expect(secondCheckbox).not.toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'line-through' });
    expect(screen.getByTestId('todo-title-2')).toHaveStyle({ textDecoration: 'none' });

    await user.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'none' });
  });

  it('deletes only the selected task and restores the empty state after the last deletion', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Add a task' });

    await user.type(input, 'Keep');
    await user.keyboard('{Enter}');
    await user.type(input, 'Remove');
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: 'Delete Remove' }));

    expect(screen.queryByTestId('todo-item-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('todo-title-1')).toHaveTextContent('Keep');
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete Keep' }));

    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
  });
});
