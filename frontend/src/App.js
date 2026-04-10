import React, { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filter from './components/Filter';

// Use a relative API base so the backend can serve frontend and API from same origin in production.
// If you need to override (e.g., local dev), set REACT_APP_API_URL to a full URL.
const API_BASE = process.env.REACT_APP_API_URL || '';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, incomplete

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const json = await res.json();
      if (json && json.success) {
        setTasks(json.data);
        localStorage.setItem('tasks_backup', JSON.stringify(json.data));
      } else {
        throw new Error(json.error || 'Unexpected response');
      }
    } catch (err) {
      setError('Could not load tasks from server. Falling back to local cache.');
      const backup = localStorage.getItem('tasks_backup');
      if (backup) setTasks(JSON.parse(backup));
    } finally {
      setLoading(false);
    }
  }

  async function addTask(title) {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add task');
      // Use functional update to avoid stale state and persist immediately
      setTasks((prev) => {
        const newTasks = [json.data, ...prev];
        localStorage.setItem('tasks_backup', JSON.stringify(newTasks));
        return newTasks;
      });
      // Return created task for caller to act on if needed
      return json.data;
    } catch (err) {
      setError(err.message || 'Failed to add task');
      // Rethrow so callers (forms) can handle validation errors inline
      throw err;
    }
  }

  async function toggleComplete(id, completed) {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update task');
      setTasks((prev) => {
        const newTasks = prev.map((item) => (item.id === id ? json.data : item));
        localStorage.setItem('tasks_backup', JSON.stringify(newTasks));
        return newTasks;
      });
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  }

  async function deleteTask(id) {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete task');
      setTasks((prev) => {
        const newTasks = prev.filter((item) => item.id !== id);
        localStorage.setItem('tasks_backup', JSON.stringify(newTasks));
        return newTasks;
      });
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  }

  async function editTask(id, title) {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to edit task');
      setTasks((prev) => {
        const newTasks = prev.map((item) => (item.id === id ? json.data : item));
        localStorage.setItem('tasks_backup', JSON.stringify(newTasks));
        return newTasks;
      });
    } catch (err) {
      setError(err.message || 'Failed to edit task');
    }
  }

  const filtered = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return t.completed;
    return !t.completed;
  });

  return (
    <div className="container">
      <div className="header">
        <h1>Task Manager</h1>
      </div>

      <TaskForm onAdd={addTask} />

      <Filter filter={filter} setFilter={setFilter} />

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading small">Loading tasks...</div>
      ) : (
        <TaskList tasks={filtered} onToggle={toggleComplete} onDelete={deleteTask} onEdit={editTask} />
      )}
    </div>
  );
}
