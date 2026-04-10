import React, { useState, useEffect } from 'react';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  async function handleToggle(e) {
    // Disable interactions while the toggle is applied
    setToggling(true);
    try {
      await onToggle(task.id, e.target.checked);
    } finally {
      setToggling(false);
    }
  }

  async function handleSave() {
    const t = title.trim();
    if (!t) return;
    setSaving(true);
    try {
      await onEdit(task.id, t);
      setEditing(false);
    } catch (err) {
      // Show basic inline error; App will also set global error
      // Keep editing mode so user can correct input
      // We could set a local error state here if desired
    } finally {
      setSaving(false);
    }
  }

  // If the `task` prop changes (updated from server), keep local title in sync
  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  return (
    <div className="task">
      <div className="left">
        <input type="checkbox" checked={task.completed} onChange={handleToggle} disabled={toggling} />
        {editing ? (
          <input className="edit-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        ) : (
          <div className={`title ${task.completed ? 'completed' : ''}`}>{task.title}</div>
        )}
      </div>
      <div className="controls">
        {editing ? (
          <>
            <button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="secondary" onClick={() => { setEditing(false); setTitle(task.title); }}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button className="secondary" onClick={() => onDelete(task.id)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
