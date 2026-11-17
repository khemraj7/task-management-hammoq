import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

vi.mock('./services/taskApi.js', () => ({
  taskApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}));

import { taskApi } from './services/taskApi.js';

describe('Task Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows tasks loaded from the API', async () => {
    taskApi.list.mockResolvedValue([
      { id: 1, title: 'Prepare notes', description: 'Review chapter one', completed: false }
    ]);

    render(<App />);

    expect(await screen.findByText('Prepare notes')).toBeInTheDocument();
    expect(screen.getByText('Review chapter one')).toBeInTheDocument();
  });

  it('creates a task and clears the form', async () => {
    taskApi.list.mockResolvedValue([]);
    taskApi.create.mockResolvedValue({
      id: 2, title: 'New task', description: '', completed: false
    });

    render(<App />);
    const titleInput = screen.getByLabelText('Task name');
    fireEvent.change(titleInput, { target: { value: 'New task' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(await screen.findByText('New task')).toBeInTheDocument();
    expect(taskApi.create).toHaveBeenCalledWith({ title: 'New task', description: '' });
    await waitFor(() => expect(titleInput).toHaveValue(''));
  });

  it('displays an API error', async () => {
    taskApi.list.mockRejectedValue(new Error('Could not load tasks.'));

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load tasks.');
  });
});
