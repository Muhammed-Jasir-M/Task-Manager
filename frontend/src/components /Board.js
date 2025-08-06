import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Board = ({ refresh }) => {
  const [tasks, setTasks] = useState([]);
  const statuses = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (err) {
        toast.error('Failed to load tasks');
      }
    };
    fetchTasks();
  }, [refresh]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    try {
      const updatedTask = await api.put(`/tasks/${draggableId}`, {
        status: destination.droppableId
      });

      setTasks(tasks.map(task =>
        task._id === draggableId ? updatedTask.data : task
      ));
      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row justify-around gap-4 p-4">
        {statuses.map(status => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <Column
                innerRef={provided.innerRef}
                {...provided.droppableProps}
                status={status}
                tasks={tasks.filter(task => task.status === status)}
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;