import express from 'express';
import cors from 'cors';
import { Task } from './models/task.js';
import { createTaskRepository } from './repositories/taskRepository.js';
import { createTaskService, TaskServiceError } from './services/taskService.js';
import { createTaskRoutes } from './routes/taskRoutes.js';

export function createApp({ taskRepository = createTaskRepository(Task) } = {}) {
  const repository = taskRepository;
  const service = createTaskService(repository);
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.use('/api/tasks', createTaskRoutes(service));
  app.use((error, _request, response, _next) => {
    if (error instanceof TaskServiceError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }
    if (error instanceof SyntaxError && 'body' in error) {
      response.status(400).json({ error: 'Request body must be valid JSON.' });
      return;
    }
    console.error(error);
    response.status(500).json({ error: 'An unexpected server error occurred.' });
  });

  return { app };
}
