import React, { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setLoading(true);
    setError(null);
    try {
      await onAdd(t);
      // only clear input on success
      setTitle('');
    } catch (err) {
      setError(err?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-row">
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </form>
  );
}
