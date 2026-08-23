import React from 'react';
import { Calendar, Download, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { generateTaskPDF } from '../services/pdfService';

const TaskCard = ({ task, isDragging = false }) => {
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

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Done';
  };

  const overdue = isOverdue();

  return (
    <div 
      className={`group relative rounded-xl p-4 mb-3 transition-all duration-200 cursor-grab active:cursor-grabbing border ${
        isDragging 
          ? 'bg-slate-800/90 border-indigo-500/50 shadow-2xl scale-[1.02] rotate-1 z-50' 
          : overdue
            ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/50 shadow-lg shadow-rose-950/20'
            : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 shadow-md shadow-slate-950/40 hover:shadow-xl'
      }`}
    >
      {/* Top row: title & download */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-semibold text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
          {task.title}
        </h3>
        <button
          onClick={handleDownloadPDF}
          className="text-slate-400 hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all opacity-80 group-hover:opacity-100"
          title="Export PDF"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-slate-400 text-xs mb-3.5 line-clamp-2 leading-relaxed font-normal">
          {task.description}
        </p>
      )}
      
      {/* Footer tags */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
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
    </div>
  );
};

export default TaskCard;