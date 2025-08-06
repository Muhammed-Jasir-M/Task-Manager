import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

const Task = ({ task, index }) => {
    const getPriorityColor = () => {
        switch (task.priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text(`Task: ${task.title}`, 10, 20);
            doc.setFontSize(12);
            doc.text(`Description: ${task.description || 'None'}`, 10, 30);
            doc.text(`Status: ${task.status}`, 10, 40);
            doc.text(`Priority: ${task.priority}`, 10, 50);
            doc.text(`Due Date: ${new Date(task.dueDate).toLocaleDateString()}`, 10, 60);
            doc.save(`task-${task.title}.pdf`);
            toast.success('PDF downloaded');
        } catch (err) {
            toast.error('Failed to generate PDF');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/tasks/${task._id}`);
            toast.success('Task deleted');
            window.location.reload(); // Simple way to refresh
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()}`}>
                            {task.priority}
                        </span>
                    </div>
                    {task.description && (
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                            <button
                                onClick={downloadPDF}
                                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            >
                                PDF
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Task;