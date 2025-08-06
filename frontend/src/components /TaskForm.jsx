import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const TaskForm = ({ onTaskCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/', formData);
            onTaskCreated();
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                dueDate: new Date().toISOString().split('T')[0]
            });
            toast.success('Task created successfully');
        } catch (err) {
            toast.error('Failed to create task');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="3"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-2 border rounded"
                />
            </div>
            <button
                type="submit"
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;