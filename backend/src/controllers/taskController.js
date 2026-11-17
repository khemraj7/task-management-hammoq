export function createTaskController(taskService) {
  return {
    async list(_request, response) {
      response.json(await taskService.listTasks());
    },
    async create(request, response) {
      const task = await taskService.createTask(request.body);
      response.status(201).json(task);
    },
    async update(request, response) {
      const task = await taskService.updateTask(
        request.params.id,
        request.body
      );
      response.json(task);
    },
    async remove(request, response) {
      await taskService.deleteTask(request.params.id);
      response.status(204).end();
    }
  };
}
