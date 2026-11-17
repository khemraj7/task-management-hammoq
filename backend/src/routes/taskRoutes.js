import { Router } from 'express';
import { createTaskController } from '../controllers/taskController.js';

export function createTaskRoutes(taskService) {
  const router = Router();
  const controller = createTaskController(taskService);

  router.get('/', controller.list);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
