
import React from 'react';
import { CalendarIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDrag } from 'react-dnd';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task._id, currentStatus: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'No due date';
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('Task Details', 20, 30);
      
      // Task information
      doc.setFontSize(12);
      doc.text(`Title: ${task.title}`, 20, 50);
      doc.text(`Description: ${task.description || 'No description'}`, 20, 70);
      doc.text(`Status: ${task.status}`, 20, 90);
      doc.text(`Priority: ${task.priority}`, 20, 110);
      doc.text(`Due Date: ${formatDate(task.dueDate)}`, 20, 130);
      doc.text(`Created: ${formatDate(task.createdAt)}`, 20, 150);
      
      if (task.updatedAt) {
        doc.text(`Updated: ${formatDate(task.updatedAt)}`, 20, 170);
      }
      
      doc.save(`task-${task.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task._id);
        toast.success('Task deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-move transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-1' : 'opacity-100'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {task.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={downloadPDF}
            className="text-blue-500 hover:text-blue-700 transition-colors"
            title="Download PDF"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Delete Task"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        
        <div className="flex items-center text-xs text-gray-500">
          <CalendarIcon className="w-4 h-4 mr-1" />
          {formatDate(task.dueDate)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;