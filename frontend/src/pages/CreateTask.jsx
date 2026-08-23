import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Sparkles, ArrowLeft } from 'lucide-react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrioritySelect = (priority) => {
    setFormData(prev => ({ ...prev, priority }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setLoading(true);

    try {
      await taskService.createTask(formData);
      toast.success('Task created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40 glow-rose';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40 glow-amber';
      case 'Low':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 glow-emerald';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-3">
            <span>Create New Task</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Fill out task details and track your work effortlessly</p>
        </div>
      </div>

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container */}
        <div className="lg:col-span-7 bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-950/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Design Landing Page UI"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe key requirements, links, or notes..."
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
              />
            </div>

            {/* Interactive Priority Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Low', 'Medium', 'High'].map((p) => {
                  const selected = formData.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePrioritySelect(p)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all duration-200 ${
                        selected 
                          ? getPriorityStyle(p)
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status and Due Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Initial Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                ) : (
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                )}
                <span>{loading ? 'Creating Task...' : 'Create Task'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/30 sticky top-24">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Live Preview</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-bold text-slate-100 text-base leading-snug">
                {formData.title || 'Untitled Task'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityStyle(formData.priority)}`}>
                {formData.priority}
              </span>
            </div>

            <p className="text-slate-400 text-xs mb-4 leading-relaxed line-clamp-3">
              {formData.description || 'Task description will appear here as you type...'}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                {formData.status}
              </span>

              <div className="flex items-center text-slate-400 space-x-1 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {formData.dueDate 
                    ? new Date(formData.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'No date'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateTask;