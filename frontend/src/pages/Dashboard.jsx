
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'react-hot-toast';
import Column from '../components/Column';
import Loading from '../components/Loading';
import Filters from '../components/Filters';
import { taskService } from '../services/taskService';

const Dashboard = () => {
      const [tasks, setTasks] = useState([]);
      const [loading, setLoading] = useState(true);
      const [filters, setFilters] = useState({});

      const columns = [
            { title: 'To Do', status: 'To Do' },
            { title: 'In Progress', status: 'In Progress' },
            { title: 'Done', status: 'Done' },
      ];

      useEffect(() => {
            fetchTasks();
      }, [filters]);

      const fetchTasks = async () => {
            try {
                  setLoading(true);
                  const data = await taskService.getAllTasks(filters);
                  setTasks(data);
            } catch (error) {
                  toast.error('Failed to fetch tasks');
                  console.error('Error fetching tasks:', error);
            } finally {
                  setLoading(false);
            }
      };

      const handleTaskMove = async (taskId, newStatus) => {
            try {
                  // Optimistically update the UI
                  setTasks(prevTasks =>
                        prevTasks.map(task =>
                              task._id === taskId ? { ...task, status: newStatus } : task
                        )
                  );

                  // Update on server
                  await taskService.updateTask(taskId, { status: newStatus });
                  toast.success(`Task moved to ${newStatus}`);
            } catch (error) {
                  // Revert the optimistic update
                  fetchTasks();
                  toast.error('Failed to move task');
            }
      };

      const handleTaskDelete = async (taskId) => {
            try {
                  await taskService.deleteTask(taskId);
                  setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            } catch (error) {
                  toast.error('Failed to delete task');
            }
      };

      const handleTaskUpdate = async (taskId, updatedData) => {
            try {
                  const updatedTask = await taskService.updateTask(taskId, updatedData);
                  setTasks(prevTasks =>
                        prevTasks.map(task =>
                              task._id === taskId ? updatedTask : task
                        )
                  );
                  toast.success('Task updated successfully!');
            } catch (error) {
                  toast.error('Failed to update task');
            }
      };

      const handleFilterChange = (newFilters) => {
            setFilters(newFilters);
      };

      const handleClearFilters = () => {
            setFilters({});
      };

      const getTaskStats = () => {
            return {
                  total: tasks.length,
                  todo: tasks.filter(task => task.status === 'To Do').length,
                  inProgress: tasks.filter(task => task.status === 'In Progress').length,
                  done: tasks.filter(task => task.status === 'Done').length,
            };
      };

      if (loading) {
            return <Loading />;
      }

      const stats = getTaskStats();

      return (
            <div className="container mx-auto px-4 py-8">
                  <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
                        <p className="text-gray-600">Manage your tasks with drag and drop</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                              <div className="text-sm text-gray-500">Total Tasks</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                              <div className="text-2xl font-bold text-gray-600">{stats.todo}</div>
                              <div className="text-sm text-gray-500">To Do</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                              <div className="text-sm text-gray-500">In Progress</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                              <div className="text-2xl font-bold text-green-600">{stats.done}</div>
                              <div className="text-sm text-gray-500">Done</div>
                        </div>
                  </div>

                  {/* Filters */}
                  <Filters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                  />

                  {/* Kanban Board */}
                  <DndProvider backend={HTML5Backend}>
                        <div className="flex flex-col lg:flex-row gap-4">
                              {columns.map((column) => (
                                    <Column
                                          key={column.status}
                                          title={column.title}
                                          status={column.status}
                                          tasks={tasks}
                                          onTaskMove={handleTaskMove}
                                          onTaskDelete={handleTaskDelete}
                                          onTaskUpdate={handleTaskUpdate}
                                    />
                              ))}
                        </div>
                  </DndProvider>

                  {tasks.length === 0 && (
                        <div className="text-center py-12">
                              <div className="text-gray-500 text-lg mb-4">No tasks found</div>
                              <p className="text-gray-400 mb-6">Create your first task to get started!</p>
                              <a
                                    href="/create-task"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                    Create Task
                              </a>
                        </div>
                  )}
            </div>
      );
};

export default Dashboard;