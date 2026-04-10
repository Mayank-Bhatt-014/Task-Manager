import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  if (!tasks.length) return <div className="small">No tasks yet.</div>;

  return (
    <div style={{ marginTop: 12 }}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
