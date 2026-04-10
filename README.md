
# Task Manager — Minimal Full-Stack Example

This repository contains a compact Task Manager application demonstrating a clear separation between a Node.js + Express backend and a React frontend. The implementation is intentionally minimal, focused on readability and easy local setup.

## Project Overview

The app supports creating, listing, editing, completing, and deleting tasks. The backend exposes a small REST API backed by an in-memory store; the frontend is a lightweight React app that consumes the API and provides a simple UI with filtering and inline validation.

## Features

- Create tasks with validation (non-empty, trimmed title)
- Edit task titles
- Mark tasks completed / incomplete
- Delete tasks
- Filter: All / Completed / Incomplete
- Loading and error states on the frontend
- Frontend fallback to `localStorage` cache when the API is unreachable

## Tech Stack

- Frontend: React (functional components, hooks)
- Backend: Node.js + Express
- Storage: In-memory array (no external database)

## Setup Instructions (step-by-step)

Prerequisites: Node.js (v16+ recommended) and npm.

1. Clone the repository and open a terminal in the project root.

2. Start the backend:

```bash
cd backend
npm install
npm start
```

The backend will listen on `http://localhost:4000` by default.

3. Start the frontend in a separate terminal:

```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` by default.

To override the backend URL for the frontend, set `REACT_APP_API_URL` before starting the frontend.

Example (PowerShell):

```powershell
$env:REACT_APP_API_URL = 'http://localhost:4000'
npm start
```

## How to Run

- Backend: run `npm start` inside the `backend` directory.
- Frontend: run `npm start` inside the `frontend` directory.

Open the frontend URL in your browser (usually `http://localhost:3000`) and use the UI to interact with tasks.

## API Endpoints

Base URL: `http://localhost:4000`

- GET /tasks
	- Returns all tasks.
	- Response: `200` `{ success: true, data: Task[] }`

- POST /tasks
	- Create a new task.
	- Request body: `{ "title": "Task title" }` (required, string)
	- Success: `201` `{ success: true, data: Task }`
	- Validation failure: `400` `{ success: false, error: "..." }`

- PATCH /tasks/:id
	- Update task `title` and/or `completed` status.
	- Request body examples: `{ "title": "New title" }`, `{ "completed": true }`.
	- Success: `200` `{ success: true, data: Task }`
	- Not found: `404` `{ success: false, error: "Task not found" }`

- DELETE /tasks/:id
	- Delete a task.
	- Success: `200` `{ success: true, data: Task }`

Task model:

```json
{
	"id": "<uuid>",
	"title": "string",
	"completed": false,
	"createdAt": "ISO timestamp"
}
```

## Assumptions & Trade-offs

- In-memory storage: chosen for simplicity and to keep this project small; data is lost on server restart. For production use, replace with a persistent database.
- No authentication: the app is a small demo and does not include user accounts.
- Minimal dependencies: to make setup fast and the code easy to review.

## Notes

- Server validates input and returns consistent JSON responses (`{ success, data }` or `{ success: false, error }`).
- Frontend provides inline validation feedback and stores a local backup in `localStorage` to improve resilience during backend downtime.

---


