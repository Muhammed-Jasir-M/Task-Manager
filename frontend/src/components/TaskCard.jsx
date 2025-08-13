import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { generateTaskPDF } from '../services/pdfService';

const TaskCard = ({ task, isDragging = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleDownloadPDF = (e) => {
    e.stopPropagation();
    generateTaskPDF(task);
  };

  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Done';
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-3 transition-all duration-200 hover:shadow-lg ${
        isDragging ? 'opacity-50 rotate-2' : ''
      } ${isOverdue() ? 'border-red-300 bg-red-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
          {task.title}
        </h3>
        <button
          onClick={handleDownloadPDF}
          className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100"
          title="Download PDF"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
        
        <div className={`flex items-center text-xs ${isOverdue() ? 'text-red-600' : 'text-gray-500'}`}>
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(task.dueDate)}</span>
          {isOverdue() && <span className="ml-1 text-red-600 font-medium">(Overdue)</span>}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;