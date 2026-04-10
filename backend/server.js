const express = require('express');
const cors = require('cors');
const fs = require('fs');
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

// Serve static frontend build when deployed. For a single-service deployment
// (backend serving frontend) the React build should be placed at `backend/build`.
const buildPath = path.join(__dirname, 'build');

if (process.env.NODE_ENV === 'production') {
  if (fs.existsSync(buildPath)) {
    console.log('Serving static files from', buildPath);
    app.use(express.static(buildPath));

    // Catch-all: serve React app for client-side routing (must come after API routes)
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  } else {
    console.warn('Production build folder not found at', buildPath);
    console.warn('Make sure the React app is built into backend/build before starting the server.');
  }
}

// Error handler (last)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ success: false, error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Task Manager backend listening on port ${PORT}`);
});
