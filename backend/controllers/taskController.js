import { taskService } from '../services/taskService.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_DEMO_USER_ID } from '../middleware/authMiddleware.js';

export async function createTask(req, res) {
  const userId = req.userId || DEFAULT_DEMO_USER_ID;
  logger.info(`Incoming POST /api/v1/tasks`, { userId, body: req.body });

  try {
    const task = await taskService.create(req.body, userId);
    logger.success(`POST /api/v1/tasks [201 Created]`, { taskId: task._id, title: task.title });
    return res.status(201).json(task);
  } catch (err) {
    logger.error(`POST /api/v1/tasks [400 Bad Request]`, err);
    return res.status(400).json({ error: err.message });
  }
}

export async function getAllTasks(req, res) {
  const userId = req.userId || DEFAULT_DEMO_USER_ID;
  logger.info(`Incoming GET /api/v1/tasks`, { userId, query: req.query });

  try {
    const tasks = await taskService.getAll(userId, req.query);
    logger.success(`GET /api/v1/tasks [200 OK]`, { count: tasks.length });
    return res.json(tasks);
  } catch (err) {
    logger.error(`GET /api/v1/tasks [500 Internal Server Error]`, err);
    return res.status(500).json({ error: err.message });
  }
}

export async function updateTask(req, res) {
  logger.info(`Incoming PUT /api/v1/tasks/${req.params.id}`, { body: req.body });

  try {
    const task = await taskService.update(req.params.id, req.body);
    logger.success(`PUT /api/v1/tasks/${req.params.id} [200 OK]`, { taskId: task._id });
    return res.json(task);
  } catch (err) {
    const statusCode = err.message === 'Task not found' ? 404 : 400;
    logger.error(`PUT /api/v1/tasks/${req.params.id} [${statusCode}]`, err);
    return res.status(statusCode).json({ error: err.message });
  }
}

export async function deleteTask(req, res) {
  logger.info(`Incoming DELETE /api/v1/tasks/${req.params.id}`);

  try {
    await taskService.delete(req.params.id);
    logger.success(`DELETE /api/v1/tasks/${req.params.id} [200 OK]`);
    return res.json({ message: 'Task deleted' });
  } catch (err) {
    const statusCode = err.message === 'Task not found' ? 404 : 400;
    logger.error(`DELETE /api/v1/tasks/${req.params.id} [${statusCode}]`, err);
    return res.status(statusCode).json({ error: err.message });
  }
}
