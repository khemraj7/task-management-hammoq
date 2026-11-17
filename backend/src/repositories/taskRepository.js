export function createTaskRepository(TaskModel) {
  return {
    async findAll() {
      const tasks = await TaskModel.find().sort({ createdAt: -1 }).lean();
      return tasks.map(toTask);
    },
    async findById(id) {
      return toTask(await TaskModel.findById(id).lean());
    },
    async create(task) {
      const created = await TaskModel.create(task);
      return toTask(created.toObject());
    },
    async update(id, task) {
      const updated = await TaskModel.findByIdAndUpdate(id, task, {
        new: true,
        runValidators: true
      }).lean();
      return toTask(updated);
    },
    async delete(id) {
      const result = await TaskModel.findByIdAndDelete(id);
      return result !== null;
    }
  };
}

function toTask(task) {
  if (!task) return null;
  const { _id, ...fields } = task;
  return { ...fields, id: _id.toString() };
}
