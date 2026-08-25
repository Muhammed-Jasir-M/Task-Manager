import React from 'react';
import { Calendar, Download, AlertTriangle, GripVertical, ArrowRightLeft } from 'lucide-react';
import { generateTaskPDF } from '../services/pdfService';

const TaskCard = ({ task, isDragging = false, dragHandleProps = null, onStatusChange = null }) => {
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20 glow-rose';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 glow-amber';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleDownloadPDF = (e) => {
    e.stopPropagation();
    generateTaskPDF(task);
  };

  const handleStatusSelect = (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (onStatusChange && newStatus !== task.status) {
      onStatusChange(task._id, newStatus);
    }
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Done';
  };

  const overdue = isOverdue();
  const statuses = ['To Do', 'In Progress', 'Done'];

  return (
    <div 
      className={`group relative rounded-xl p-3.5 mb-3 transition-all duration-150 border ${
        isDragging 
          ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/60 shadow-2xl shadow-indigo-950/90 max-w-[340px] w-full z-[9999] opacity-95 scale-[1.03]' 
          : overdue
            ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/50 shadow-lg shadow-rose-950/20'
            : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 shadow-md shadow-slate-950/40 hover:shadow-xl'
      }`}
    >
      {/* Top row: Drag Handle, Title & Export PDF */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          {/* Touch Drag Handle */}
          <div 
            {...dragHandleProps} 
            className="p-1 -ml-1 text-slate-500 hover:text-slate-300 active:text-indigo-400 cursor-grab active:cursor-grabbing rounded hover:bg-slate-800/80 transition-colors touch-none flex-shrink-0 mt-0.5"
            title="Drag to move"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <h3 className="font-semibold text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
            {task.title}
          </h3>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="text-slate-400 hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all opacity-80 group-hover:opacity-100 flex-shrink-0"
          title="Export PDF"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed font-normal pl-6">
          {task.description}
        </p>
      )}
      
      {/* Middle row: Priority & Due Date */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs mb-2.5">
        <span 
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getPriorityBadge(task.priority)}`}
        >
          {task.priority || 'Medium'}
        </span>
        
        <div className={`flex items-center space-x-1 font-medium ${overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
          {overdue ? (
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
          ) : (
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
          )}
          <span className="text-[11px]">{formatDate(task.dueDate)}</span>
          {overdue && <span className="text-[10px] uppercase font-bold text-rose-400 ml-0.5">Overdue</span>}
        </div>
      </div>

      {/* Quick Status Selector dropdown */}
      {onStatusChange && (
        <div className="flex items-center justify-end pt-2 border-t border-slate-800/40 text-[11px]">
          <select
            value={task.status}
            onChange={handleStatusSelect}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800/80 hover:bg-slate-800 text-indigo-300 text-[11px] font-semibold rounded-lg px-2.5 py-1 border border-indigo-500/20 hover:border-indigo-500/50 focus:border-indigo-500 focus:outline-none cursor-pointer transition-colors"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-slate-200">
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskCard;