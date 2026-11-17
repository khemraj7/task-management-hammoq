import { useState } from 'react';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  async function saveTask(event) {
    event.preventDefault();
    const saved = await onUpdate(task.id, { title: title.trim(), description: description.trim() });
    if (saved) setEditing(false);
  }

  if (editing) {
    return (
      <form className="task-card edit-form" onSubmit={saveTask}>
        <input
          aria-label="Edit task name"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          required
        />
        <textarea
          aria-label="Edit task description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows="2"
          maxLength={2000}
        />
        <div className="task-actions">
          <button className="text-button" type="submit">Save</button>
          <button className="text-button muted" type="button" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <article className={`task-card${task.completed ? ' is-complete' : ''}`}>
      <button
        className="check-button"
        type="button"
        aria-label={task.completed ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
        onClick={() => onUpdate(task.id, { completed: !task.completed })}
      >
        {task.completed ? '✓' : ''}
      </button>
      <div className="task-copy">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>
      <div className="task-actions">
        <button className="text-button" type="button" onClick={() => setEditing(true)}>Edit</button>
        <button className="text-button delete-button" type="button" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </article>
  );
}
