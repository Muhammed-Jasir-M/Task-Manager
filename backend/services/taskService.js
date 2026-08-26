import { taskDao } from '../dao/taskDao.js';
import { DEFAULT_DEMO_USER_ID } from '../middleware/authMiddleware.js';

export const taskService = {
  async create(data, userId) {
    const { title, description, status, priority, dueDate } = data;

    if (!title) {
      throw new Error('Title is required');
    }

    if (!dueDate) {
      throw new Error('Due date is required');
    }

    const taskData = {
      userId: userId || DEFAULT_DEMO_USER_ID,
      title,
      description: description || '',
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate: new Date(dueDate).toISOString()
    };

    return await taskDao.create(taskData);
  },

  async getAll(userId, queryFilters = {}) {
    const { status, priority } = queryFilters;
    const filter = { userId: userId || DEFAULT_DEMO_USER_ID };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    return await taskDao.findAll(filter);
  },

  async update(id, updateData) {
    const updatedTask = await taskDao.findByIdAndUpdate(id, updateData);
    if (!updatedTask) {
      throw new Error('Task not found');
    }
    return updatedTask;
  },

  async delete(id) {
    const deletedTask = await taskDao.findByIdAndDelete(id);
    if (!deletedTask) {
      throw new Error('Task not found');
    }
    return deletedTask;
  }
};
