import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Edit2, Trash2, Download, Calendar, AlertTriangle, Plus, X, FileText } from 'lucide-react';
import { taskService } from '../services/taskService';
import { generateTaskPDF } from '../services/pdfService';
import Filter from '../components/Filter';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  
  // Modals state
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: ''
  });
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(filters);
      setTasks(data || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setDateFilter('all');
    setSortBy('default');
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
      setDeleteTaskId(null);
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      status: task.status || 'To Do',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
  };

  const handleUpdateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const updatedTask = await taskService.updateTask(editingTask._id, editFormData);
      setTasks(prev => prev.map(task => 
        task._id === editingTask._id ? updatedTask : task
      ));
      toast.success('Task updated successfully');
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleInlineStatusChange = async (task, newStatus) => {
    try {
      const updatedTask = await taskService.updateTask(task._id, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === task._id ? updatedTask : t));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Done';
  };

  // Filter and Sort calculation
  const processedTasks = useMemo(() => {
    let result = tasks.filter(task =>
      (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply Date Filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
          return taskDate.getTime() === today.getTime();
        } else if (dateFilter === 'overdue') {
          return taskDate < today && task.status !== 'Done';
        } else if (dateFilter === 'this_week') {
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return taskDate >= today && taskDate <= nextWeek;
        }
        return true;
      });
    }

    // Apply Sorting
    if (sortBy === 'date_asc') {
      result.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
    } else if (sortBy === 'date_desc') {
      result.sort((a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0));
    } else if (sortBy === 'priority_desc') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    }

    return result;
  }, [tasks, searchTerm, dateFilter, sortBy]);

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'To Do':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'In Progress':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Done':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
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
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400 font-medium">Loading management directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Task Management</h1>
          <p className="text-slate-400 text-sm mt-1">Search, inspect, edit, or export your full task list</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/create"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto w-full relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by task title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Compact Inline Filter Component */}
      <Filter 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        showStatus={true}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Grid Content */}
      {processedTasks.length === 0 ? (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center">
          <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-300">No Tasks Found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {searchTerm || dateFilter !== 'all' ? 'Try adjusting your search keywords or active filters.' : 'Your task list is empty. Get started by creating a task!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedTasks.map((task) => {
            const overdue = isOverdue(task);
            return (
              <div 
                key={task._id} 
                className={`bg-slate-900/70 backdrop-blur-xl rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 hover:border-indigo-500/40 shadow-lg ${
                  overdue ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Title & Priority Header */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-bold text-slate-100 text-base leading-snug">
                      {task.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${getPriorityBadge(task.priority)}`}>
                      {task.priority || 'Medium'}
                    </span>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-slate-400 text-xs mb-4 line-clamp-3 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Card Footer: Due Date, Status Selector & Actions */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  
                  {/* Due Date Display */}
                  <div className={`flex items-center justify-between text-xs font-medium ${overdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                    <div className="flex items-center space-x-1.5">
                      {overdue ? (
                        <AlertTriangle className="h-4 w-4 text-rose-400 animate-pulse" />
                      ) : (
                        <Calendar className="h-4 w-4 text-indigo-400" />
                      )}
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                    {overdue && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] uppercase font-bold">
                        Overdue
                      </span>
                    )}
                  </div>

                  {/* Status Dropdown & Action Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={task.status}
                      onChange={(e) => handleInlineStatusChange(task, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border bg-slate-950 focus:outline-none cursor-pointer ${getStatusBadge(task.status)}`}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => generateTaskPDF(task)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-colors"
                        title="Export PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTaskId(task._id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Edit2 className="h-5 w-5 text-indigo-400" />
                <span>Edit Task Details</span>
              </h3>
              <button 
                onClick={() => setEditingTask(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={editFormData.dueDate}
                  onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTaskId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirm Task Deletion</span>
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to permanently delete this task? This action cannot be reverted.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTaskId(null)}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(deleteTaskId)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-600/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;