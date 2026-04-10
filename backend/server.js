const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
// Limit JSON size to avoid large payloads
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/tasks', tasksRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Task Manager backend listening on port ${PORT}`);
});
