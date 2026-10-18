# Compiler Code

A browser-based coding workspace. Create projects, write and organize files in a real code
editor, run JavaScript or Python, inspect the output, and come back to your work later.

It is a small full-stack app: a Next.js frontend, an Express API, and MongoDB for storage.

## Features

- Email and password accounts with hashed passwords and JWT sessions.
- Dashboard with project search, star filter, sorting, rename, duplicate and delete.
- Projects in JavaScript or Python, each created with a starter file.
- Monaco editor with syntax highlighting, tabs, folding, search and replace.
- File explorer with files and folders, create, rename and delete.
- Run code and see stdout, stderr, exit code and duration in the console panel.
- Save state indicators (Saved, Unsaved changes, Saving, Save failed) and Ctrl+S / Ctrl+Enter shortcuts.
- Dark and light themes, editor settings (font size, word wrap, minimap, line numbers).
- Responsive layout: the workspace works on smaller screens with a drawer-style explorer.

## Tech stack

| Part     | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | Next.js (App Router), React, Tailwind CSS v4, Monaco, Lucide |
| Backend  | Express, Mongoose, JWT, bcryptjs, CORS, dotenv               |
| Database | MongoDB                                                      |
| Runner   | Web Worker (JavaScript), Pyodide (Python), optional Piston   |

## Project structure

```text
Compiler Code/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/authMiddleware.js
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── app/
│   │   ├── dashboard/page.js
│   │   ├── editor/[id]/page.js
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   ├── lib/
│   │   ├── api.js                # fetch helper for the Express API
│   │   └── runner.js             # starts the browser run worker
│   └── public/runner-worker.js   # Web Worker that runs JavaScript and Python
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

The Run button works with no extra setup. Docker is only needed if you also want to use the
optional server-side runner described below.

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/compiler-code
PORT=5000
JWT_SECRET=some_long_random_string
PISTON_API_URL=https://emkc.org/api/v2/piston
```

Start it:

```bash
npm start
```

The API runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start it:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Code execution

Running code happens in the browser, so it works without any extra service:

- **JavaScript** runs inside a Web Worker created fresh for each run. It stays off the UI
  thread, `console.log` is captured as output, and errors are shown in the console panel.
- **Python** runs with [Pyodide](https://pyodide.org) in the same kind of worker. The runtime
  is loaded from a CDN on the first run, so that first run takes a few seconds longer.
- Each run is stopped after 15 seconds by terminating the worker, which also protects the page
  from endless loops.
- The worker is thrown away after every run, so runs never share state.

The worker lives in `frontend/public/runner-worker.js`.

There is also an optional **server-side runner** using [Piston](https://github.com/engineer-man/piston)
through `POST /api/run`. The public `emkc.org` instance is whitelist only, so it needs your own
instance. The UI does not use this path; it is there if you prefer running code on a server.
To use it:

```bash
docker run -d --name piston -p 2000:2000 --privileged ghcr.io/engineer-man/piston
```

```env
PISTON_API_URL=http://localhost:2000/api/v2
```

Supported languages:

| Language   | How it runs                          |
| ---------- | ------------------------------------ |
| JavaScript | Web Worker (browser)                 |
| Python     | Pyodide Web Worker (browser)         |

## API endpoints

All project, file and run endpoints require an `Authorization: Bearer <token>` header.

| Method | Path                                       | Description                     |
| ------ | ------------------------------------------ | ------------------------------- |
| POST   | `/api/auth/register`                       | Create an account               |
| POST   | `/api/auth/login`                          | Log in                          |
| GET    | `/api/auth/me`                             | Current user                    |
| GET    | `/api/projects`                            | List your projects              |
| POST   | `/api/projects`                            | Create a project                |
| GET    | `/api/projects/:id`                        | Get one project                 |
| PUT    | `/api/projects/:id`                        | Update name/description/star    |
| DELETE | `/api/projects/:id`                        | Delete a project and its files  |
| POST   | `/api/projects/:id/duplicate`              | Duplicate a project             |
| GET    | `/api/projects/:projectId/files`           | List files                      |
| POST   | `/api/projects/:projectId/files`           | Create a file or folder         |
| PUT    | `/api/projects/:projectId/files/:fileId`   | Save file content               |
| PUT    | `/api/projects/:projectId/files/:fileId/rename` | Rename a file or folder    |
| DELETE | `/api/projects/:projectId/files/:fileId`   | Delete a file or folder         |
| POST   | `/api/run`                                 | Run code on the optional server runner |

## Storage and limits

- MongoDB stores users, projects and files. Project files use a unique index on
  `(projectId, folder, name)` so two items cannot share a path.
- Passwords are hashed with bcrypt, never stored in plain text.
- Tokens live in the browser's `localStorage`; every request is checked on the server and
  ownership is verified per project.
- Limits: 50 items per project, 6 folder levels, 64 characters per name, 100KB per file.

## Limitations

- Only JavaScript and Python are supported and listed.
- Code runs in the browser. That keeps setup small, but a browser run is not the same as a
  hardened server sandbox, and Python only has the packages Pyodide ships with.
- The first Python run downloads the Pyodide runtime from a CDN, so it needs internet access
  and takes a few seconds.
- Files are edited as plain text; there is no package installation.
- Execution output is not stored in the database.

## Packages

Backend:

```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken
```

Frontend:

```bash
npm install next react react-dom @monaco-editor/react lucide-react
npm install -D tailwindcss @tailwindcss/postcss postcss
```
