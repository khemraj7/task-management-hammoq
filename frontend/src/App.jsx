import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import { taskApi } from './services/taskApi.js';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    taskApi.list()
      .then(setTasks)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function addTask(task) {
    try {
      const created = await taskApi.create(task);
      setTasks((current) => [created, ...current]);
      setError('');
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  }

  async function updateTask(id, changes) {
    try {
      const updated = await taskApi.update(id, changes);
      setTasks((current) => current.map((task) => task.id === id ? updated : task));
      setError('');
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  }

  async function deleteTask(id) {
    try {
      await taskApi.remove(id);
      setTasks((current) => current.filter((task) => task.id !== id));
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="page-shell">
      <section className="manager">
        <header className="page-header">
          <div className="brand-mark" aria-hidden="true">✓</div>
          <p className="eyebrow">YOUR SPACE, YOUR PACE</p>
          <h1>Task Manager</h1>
          <p className="subtitle">Keep track of what matters, one task at a time.</p>
        </header>

        <section className="panel" aria-labelledby="create-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">GET STARTED</p>
              <h2 id="create-heading">Add a task</h2>
            </div>
          </div>
          <TaskForm onAdd={addTask} />
        </section>

        <section className="tasks-section" aria-labelledby="tasks-heading">
          <div className="list-heading">
            <div>
              <p className="eyebrow">YOUR DAY, ORGANIZED</p>
              <h2 id="tasks-heading">Your tasks</h2>
            </div>
            <span className="task-count">
              {completedCount} of {tasks.length} done
            </span>
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          {loading
            ? <p className="loading-message">Loading tasks...</p>
            : <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />}
        </section>
      </section>
      <footer>Small steps make progress.</footer>
    </main>
  );
}
