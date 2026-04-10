import React from 'react';

export default function Filter({ filter, setFilter }) {
  return (
    <div className="filter">
      <button className={filter === 'all' ? '' : 'secondary'} onClick={() => setFilter('all')}>All</button>
      <button className={filter === 'completed' ? '' : 'secondary'} onClick={() => setFilter('completed')}>Completed</button>
      <button className={filter === 'incomplete' ? '' : 'secondary'} onClick={() => setFilter('incomplete')}>Incomplete</button>
    </div>
  );
}
