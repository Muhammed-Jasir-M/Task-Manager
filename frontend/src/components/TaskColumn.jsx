import React from 'react';
import ReactDOM from 'react-dom';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Clock, PlayCircle, CheckCircle2, Inbox } from 'lucide-react';

const TaskColumn = ({ status, tasks, onStatusChange }) => {
  const getColumnConfig = (status) => {
    switch (status) {
      case 'To Do':
        return {
          icon: <Clock className="h-4 w-4 text-amber-400" />,
          badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          borderColor: 'border-slate-800/80 hover:border-amber-500/30',
          topLine: 'bg-gradient-to-r from-amber-500 to-amber-600',
        };
      case 'In Progress':
        return {
          icon: <PlayCircle className="h-4 w-4 text-indigo-400" />,
          badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
          borderColor: 'border-slate-800/80 hover:border-indigo-500/30',
          topLine: 'bg-gradient-to-r from-indigo-500 to-violet-600',
        };
      case 'Done':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
          badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          borderColor: 'border-slate-800/80 hover:border-emerald-500/30',
          topLine: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-slate-400" />,
          badgeBg: 'bg-slate-700/30 text-slate-300 border-slate-700',
          borderColor: 'border-slate-800',
          topLine: 'bg-slate-600',
        };
    }
  };

  const config = getColumnConfig(status);

  return (
    <div className={`flex-1 min-h-[420px] rounded-2xl bg-slate-900/60 border ${config.borderColor} p-4 flex flex-col relative backdrop-blur-md transition-all duration-300 shadow-xl shadow-slate-950/20`}>
      {/* Top Accent Stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${config.topLine}`}></div>

      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
            {config.icon}
          </div>
          <h2 className="text-base font-bold text-slate-100 tracking-tight">{status}</h2>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badgeBg}`}>
          {tasks.length}
        </span>
      </div>
      
      {/* Droppable Container */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-xl p-1.5 pb-8 transition-colors duration-200 min-h-[220px] ${
              snapshot.isDraggingOver 
                ? 'bg-indigo-950/30 ring-2 ring-indigo-500/40 border-dashed border-indigo-500/50' 
                : 'bg-transparent'
            }`}
          >
            {tasks.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800/80 rounded-xl p-4 my-2">
                <Inbox className="h-6 w-6 text-slate-600 mb-2 opacity-60" />
                <span>No tasks in {status.toLowerCase()}</span>
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable 
                  key={task._id} 
                  draggableId={task._id} 
                  index={index}
                >
                  {(provided, snapshot) => {
                    const child = (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <TaskCard 
                          task={task} 
                          isDragging={snapshot.isDragging}
                          dragHandleProps={provided.dragHandleProps}
                          onStatusChange={onStatusChange}
                        />
                      </div>
                    );

                    // Render Portal to document.body when dragging to break out of transformed parent stacking contexts
                    if (snapshot.isDragging) {
                      return ReactDOM.createPortal(child, document.body);
                    }
                    return child;
                  }}
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