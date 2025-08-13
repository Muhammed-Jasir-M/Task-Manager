import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Clock, CheckCircle, PlayCircle } from 'lucide-react';

const TaskColumn = ({ status, tasks, onTaskUpdate }) => {
  const getColumnIcon = (status) => {
    switch (status) {
      case 'To Do':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'In Progress':
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'Done':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getColumnColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'border-orange-200 bg-orange-50';
      case 'In Progress':
        return 'border-blue-200 bg-blue-50';
      case 'Done':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`flex-1 min-h-96 rounded-lg border-2 border-dashed ${getColumnColor(status)} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getColumnIcon(status)}
          <h2 className="text-lg font-semibold text-gray-800">{status}</h2>
        </div>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600 border">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-64 transition-colors ${
              snapshot.isDraggingOver ? 'bg-white bg-opacity-50' : ''
            }`}
          >
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                No tasks in {status.toLowerCase()}
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable 
                  key={task._id} 
                  draggableId={task._id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard 
                        task={task} 
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;