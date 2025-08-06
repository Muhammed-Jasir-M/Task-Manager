import React, { useState } from 'react';
import Board from './components/Board';
import TaskForm from './components/TaskForm';
import Filters from './components/Filters';
import { Toaster } from 'react-hot-toast';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleTaskCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-6">TaskLite</h1>
      <div className="max-w-6xl mx-auto">
        <TaskForm onTaskCreated={handleTaskCreated} />
        <Filters />
        <Board refresh={refresh} />
      </div>
    </div>
  );
}

export default App;
