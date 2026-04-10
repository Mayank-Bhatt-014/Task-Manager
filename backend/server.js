const express = require('express');
const cors = require('cors');
const path = require('path');
const tasksRouter = require('./routes/tasks');

const app = express();
// Use PORT from environment (Render sets this) or fallback to 3001
const PORT = process.env.PORT || 3001;

// Middlewares
// Enable CORS only in development to allow the React dev server to talk to API
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

// Limit JSON size to avoid large payloads
app.use(express.json({ limit: '10kb' }));

// API routes
app.use('/tasks', tasksRouter);

// Serve static frontend build when deployed
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(buildPath));

// Catch-all: serve React app for client-side routing (must come after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Error handler (last)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ success: false, error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Task Manager backend listening on port ${PORT}`);
});
