import Task from '../models/taskModel.js';

export async function createTask(req, res) {
    try {
        const { title, description, status, priority, dueDate } = req.body;
    
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
    
        if (!dueDate) {
            return res.status(400).json({ error: 'Due date is required' });
        }

        const task = new Task({
            title,
            description: description || '',
            status: status || 'todo',
            priority: priority || 'medium',
            dueDate: new Date(dueDate),
        });

       
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getAllTasks(req, res) {
    try {
        const { status, priority } = req.query;
        let filter = {};
    
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
    
        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateTask(req, res) {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


export async function deleteTask(req, res) {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
