// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskColumn from '../components/TaskColumn';
import Filter from '../components/Filter';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';
import { BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
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

    const newStatus = destination.droppableId;
    
    try {
      await taskService.updateTask(draggableId, { status: newStatus });
      
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === draggableId ? { ...task, status: newStatus } : task
        )
      );
      
      toast.success(`Task moved to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getStats = () => {
    const todoTasks = getTasksByStatus('To Do');
    const inProgressTasks = getTasksByStatus('In Progress');
    const doneTasks = getTasksByStatus('Done');
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== 'Done';
    });

    return {
      todo: todoTasks.length,
      inProgress: inProgressTasks.length,
      done: doneTasks.length,
      overdue: overdueTasks.length,
      total: tasks.length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your tasks and productivity</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-orange-600">{stats.todo}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.done}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <Filter 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TaskColumn
            status="To Do"
            tasks={getTasksByStatus('To Do')}
          />
          <TaskColumn
            status="In Progress"
            tasks={getTasksByStatus('In Progress')}
          />
          <TaskColumn
            status="Done"
            tasks={getTasksByStatus('Done')}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;