import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import TaskList from './pages/TaskList';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </Router>
    </div>
  );
}

export default App;