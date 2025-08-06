
import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

const Column = ({ title, status, tasks, onTaskMove, onTaskDelete, onTaskUpdate }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.currentStatus !== status) {
        onTaskMove(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'border-gray-300 bg-gray-50';
      case 'In Progress':
        return 'border-blue-300 bg-blue-50';
      case 'Done':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const filteredTasks = tasks.filter(task => task.status === status);

  return (
    <div
      ref={drop}
      className={`flex-1 mx-2 p-4 rounded-lg border-2 transition-all duration-200 ${
        getStatusColor(status)
      } ${isOver ? 'border-blue-400 bg-blue-100' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
          {filteredTasks.length}
        </span>
      </div>
      
      <div className="space-y-3 min-h-[200px]">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={onTaskDelete}
            onUpdate={onTaskUpdate}
          />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No tasks in {title.toLowerCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;