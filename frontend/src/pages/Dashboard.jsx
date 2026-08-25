import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskColumn from '../components/TaskColumn';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';
import { Clock, CheckCircle2, AlertTriangle, Layers, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState('ALL'); // 'ALL' | 'To Do' | 'In Progress' | 'Done'

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleQuickStatusChange = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      await taskService.updateTask(taskId, { status: newStatus });
      toast.success(`Task moved to ${newStatus}`);
    } catch (error) {
      setTasks(previousTasks);
      toast.error('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Optimistic update
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const previousTasks = [...tasks];
    const draggedTask = tasks.find(t => t._id === draggableId);
    if (!draggedTask) return;

    const updatedTask = { ...draggedTask, status: destStatus };

    if (sourceStatus === destStatus) {
      // Reordering within same column
      const columnTasks = tasks.filter(t => t.status === sourceStatus);
      const reorderedColumn = Array.from(columnTasks);
      reorderedColumn.splice(source.index, 1);
      reorderedColumn.splice(destination.index, 0, updatedTask);

      let columnIndex = 0;
      const newTasks = tasks.map(t => {
        if (t.status === sourceStatus) {
          const item = reorderedColumn[columnIndex];
          columnIndex++;
          return item;
        }
        return t;
      });
      setTasks(newTasks);
    } else {
      // Moving across different columns
      const sourceColumnTasks = tasks.filter(t => t.status === sourceStatus);
      const destColumnTasks = tasks.filter(t => t.status === destStatus);

      sourceColumnTasks.splice(source.index, 1);
      destColumnTasks.splice(destination.index, 0, updatedTask);

      const otherTasks = tasks.filter(t => t.status !== sourceStatus && t.status !== destStatus);
      setTasks([...otherTasks, ...sourceColumnTasks, ...destColumnTasks]);

      try {
        await taskService.updateTask(draggableId, { status: destStatus });
        toast.success(`Task moved to ${destStatus}`);
      } catch (error) {
        setTasks(previousTasks);
        toast.error('Failed to update task status');
        console.error('Error updating task:', error);
      }
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getStats = () => {
    const todoTasks = tasks.filter(t => t.status === 'To Do');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const doneTasks = tasks.filter(t => t.status === 'Done');
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today && task.status !== 'Done';
    });

    const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

    return {
      todo: todoTasks.length,
      inProgress: inProgressTasks.length,
      done: doneTasks.length,
      overdue: overdueTasks.length,
      total: tasks.length,
      rate: completionRate
    };
  };

  const stats = getStats();

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-indigo-400" />
        </div>
        <p className="mt-4 text-sm text-slate-400 font-medium">Loading workspace tasks...</p>
      </div>
    );
  }

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Organize, drag, and track your daily tasks in real-time</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/create"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Tasks Card */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
              <p className="text-3xl font-black text-slate-100 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Layers className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-xs text-indigo-300 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{stats.rate}% Completion Rate</span>
          </div>
        </div>

        {/* To Do Card */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To Do</p>
              <p className="text-3xl font-black text-amber-400 mt-1">{stats.todo}</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Pending action items
          </div>
        </div>

        {/* In Progress Card */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
              <p className="text-3xl font-black text-indigo-400 mt-1">{stats.inProgress}</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Active work items
          </div>
        </div>

        {/* Completed Card */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{stats.done}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Successfully finished
          </div>
        </div>

        {/* Overdue Card */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue</p>
              <p className="text-3xl font-black text-rose-400 mt-1">{stats.overdue}</p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Requires immediate attention
          </div>
        </div>

      </div>

      {/* Mobile Column View Segmented Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/80 border border-slate-800/80 rounded-2xl md:hidden text-center text-xs">
        <button
          onClick={() => setActiveMobileTab('ALL')}
          className={`py-2 rounded-xl text-[11px] font-bold transition-all ${
            activeMobileTab === 'ALL'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All
        </button>
        {columns.map((colStatus) => {
          const count = getTasksByStatus(colStatus).length;
          const shortLabel = colStatus === 'In Progress' ? 'Progress' : colStatus;
          return (
            <button
              key={colStatus}
              onClick={() => setActiveMobileTab(colStatus)}
              className={`py-2 rounded-xl text-[11px] font-bold transition-all truncate px-1 ${
                activeMobileTab === colStatus
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {shortLabel} ({count})
            </button>
          );
        })}
      </div>

      {/* KanBan Board Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((status) => {
            const isVisibleOnMobile = activeMobileTab === 'ALL' || activeMobileTab === status;
            if (!isVisibleOnMobile) return null;
            return (
              <TaskColumn
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                onStatusChange={handleQuickStatusChange}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;