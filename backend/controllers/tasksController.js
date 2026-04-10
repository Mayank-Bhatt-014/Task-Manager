const { v4: uuidv4 } = require('uuid');

// In-memory storage for tasks. This keeps the project small and DB-less
// Note: data will reset when the server restarts.
const tasks = [];

// Helper to find task index by id
function findTaskIndex(id) {
  return tasks.findIndex((t) => t.id === id);
}

/**
 * GET /tasks
 * Return all tasks
 */
exports.getTasks = (req, res) => {
  try {
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve tasks' });
  }
};

/**
 * POST /tasks
 * Create a new task. Expects { title }
 */
exports.createTask = (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required and must be a non-empty string' });
    }

    const task = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Add new task to the beginning (most-recent-first)
    tasks.unshift(task);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
};

/**
 * PATCH /tasks/:id
 * Update task title and/or completion status
 */
exports.updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const idx = findTaskIndex(id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Task not found' });

    const { completed, title } = req.body;

    if (typeof completed !== 'undefined') {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ success: false, error: 'Completed must be a boolean' });
      }
      tasks[idx].completed = completed;
    }

    if (typeof title !== 'undefined') {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ success: false, error: 'Title must be a non-empty string' });
      }
      tasks[idx].title = title.trim();
    }

    res.json({ success: true, data: tasks[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
};

/**
 * DELETE /tasks/:id
 * Remove a task
 */
exports.deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const idx = findTaskIndex(id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Task not found' });

    const removed = tasks.splice(idx, 1)[0];
    res.json({ success: true, data: removed });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
};
