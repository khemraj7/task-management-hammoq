import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    const saved = await onAdd({ title: title.trim(), description: description.trim() });
    if (!saved) return;
    setTitle('');
    setDescription('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-title">Task name</label>
      <input
        id="task-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to get done?"
        maxLength={200}
        required
      />
      <label htmlFor="task-description">Description <span>Optional</span></label>
      <textarea
        id="task-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Add a few details..."
        rows="3"
        maxLength={2000}
      />
      <button className="primary-button" type="submit">Add task <span aria-hidden="true">+</span></button>
    </form>
  );
}
