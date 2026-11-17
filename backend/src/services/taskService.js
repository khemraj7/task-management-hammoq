export class TaskServiceError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'TaskServiceError';
    this.statusCode = statusCode;
  }
}

function validateId(id) {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    throw new TaskServiceError('Task ID must be a valid MongoDB ObjectId.', 400);
  }
}

export function createTaskService(taskRepository) {
  return {
    async listTasks() {
      return taskRepository.findAll();
    },
    async createTask(input) {
      const title = typeof input?.title === 'string' ? input.title.trim() : '';
      const description =
        typeof input?.description === 'string' ? input.description.trim() : '';

      if (!title) {
        throw new TaskServiceError('Title is required.', 400);
      }
      if (title.length > 200) {
        throw new TaskServiceError('Title must be 200 characters or fewer.', 400);
      }
      if (description.length > 2000) {
        throw new TaskServiceError(
          'Description must be 2000 characters or fewer.',
          400
        );
      }

      return taskRepository.create({ title, description });
    },
    async updateTask(id, input) {
      validateId(id);
      if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new TaskServiceError('Request body must be an object.', 400);
      }

      const task = await taskRepository.findById(id);
      if (!task) {
        throw new TaskServiceError('Task not found.', 404);
      }

      const title =
        input.title === undefined
          ? task.title
          : typeof input.title === 'string'
            ? input.title.trim()
            : '';
      const description =
        input.description === undefined
          ? task.description
          : typeof input.description === 'string'
            ? input.description.trim()
            : '';
      const completed =
        input.completed === undefined ? task.completed : input.completed;

      if (!title) {
        throw new TaskServiceError('Title is required.', 400);
      }
      if (title.length > 200) {
        throw new TaskServiceError('Title must be 200 characters or fewer.', 400);
      }
      if (description.length > 2000) {
        throw new TaskServiceError(
          'Description must be 2000 characters or fewer.',
          400
        );
      }
      if (typeof completed !== 'boolean') {
        throw new TaskServiceError('Completed must be true or false.', 400);
      }

      return taskRepository.update(id, { title, description, completed });
    },
    async deleteTask(id) {
      validateId(id);
      if (!await taskRepository.delete(id)) {
        throw new TaskServiceError('Task not found.', 404);
      }
    }
  };
}
