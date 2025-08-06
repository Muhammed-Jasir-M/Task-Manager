import React from 'react';
import Task from './Task';
import { Droppable } from '@hello-pangea/dnd';

const Column = ({ innerRef, status, tasks, ...props }) => {
    const getColumnColor = () => {
        switch (status) {
            case 'To Do': return 'bg-blue-50';
            case 'In Progress': return 'bg-yellow-50';
            case 'Done': return 'bg-green-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div
            ref={innerRef}
            className={`flex-1 rounded-lg p-4 ${getColumnColor()}`}
            {...props}
        >
            <h2 className="font-bold text-lg mb-4 text-center">{status}</h2>
            <div className="space-y-3">
                {tasks.map((task, index) => (
                    <Task key={task._id} task={task} index={index} />
                ))}
            </div>
            {tasks.length === 0 && (
                <p className="text-gray-500 text-center">No tasks here</p>
            )}
        </div>
    );
};

export default Column;