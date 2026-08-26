import Task from '../models/taskModel.js';

export const taskDao = {
  async create(taskData) {
    const task = new Task(taskData);
    return await task.save();
  },

  async findAll(filter = {}) {
    return await Task.find(filter).sort({ createdAt: -1 });
  },

  async findById(id) {
    return await Task.findById(id);
  },

  async findByIdAndUpdate(id, updateData) {
    return await Task.findByIdAndUpdate(id, updateData, { new: true });
  },

  async findByIdAndDelete(id) {
    return await Task.findByIdAndDelete(id);
  },

  async deleteMany(filter = {}) {
    return await Task.deleteMany(filter);
  },

  async insertMany(tasks) {
    return await Task.insertMany(tasks);
  }
};
