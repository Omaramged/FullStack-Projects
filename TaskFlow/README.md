# TaskFlow

Simple task management web app. Users can register, login, and manage their own tasks.

## Features

- User register, login, logout
- Protected dashboard (only your own tasks)
- Create, view, edit, delete tasks
- Update task status (todo, in_progress, done)
- Set priority (low, medium, high) and optional due date
- Search tasks by title
- Filter by status and priority
- Dashboard stats (total, todo, in progress, done)
- Loading, empty, and error states
- Responsive design (mobile, tablet, desktop)

## Tech used

- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Auth: bcryptjs + JWT in HTTP-only cookie

## How it works

```
Next.js (client) -> Express API (server) -> MongoDB
```

The frontend uses `fetch()` with `credentials: include`.
The backend checks the JWT cookie on every protected route and only returns tasks that belong to the logged-in user.

## Project structure

```
TaskFlow/
  client/
    src/
      app/
        login/page.js
        register/page.js
        dashboard/page.js
        layout.js
        page.js
        globals.css
      components/
        TaskCard.js
        TaskForm.js
        TaskFilters.js
        DashboardStats.js
        Navbar.js
        LoadingState.js
        EmptyState.js
      lib/
        api.js
    .env.local
    package.json
  server/
    server.js
    models/
      User.js
      Task.js
    routes/
      auth.js
      tasks.js
    controllers/
      authController.js
      taskController.js
    middleware/
      auth.js
    .env.example
    package.json
```

## What you need

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm

## Install

```bash
# backend
cd server
npm install

# frontend
cd ../client
npm install
```

## Environment variables

Backend (`server/.env`, see `.env.example`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=change-this-secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Frontend (`client/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Never commit real `.env` files. Only `.env.example` is committed.

## Run locally

```bash
# terminal 1 - backend
cd server
npm start

# terminal 2 - frontend
cd client
npm run dev
```

Open http://localhost:3000

Register a new account, then you will go to `/dashboard`.

## API endpoints

Base URL: `http://localhost:5000`

Health:

```
GET /api/health -> { "status": "ok" }
```

Auth:

```
POST /api/auth/register  { name, email, password }
POST /api/auth/login     { email, password }
POST /api/auth/logout
GET  /api/auth/me        (needs cookie)
```

Tasks (all need cookie):

```
GET    /api/tasks
GET    /api/tasks?search=study
GET    /api/tasks?status=todo
GET    /api/tasks?priority=high
GET    /api/tasks?status=done&priority=medium
GET    /api/tasks/:id
POST   /api/tasks          { title, description, status, priority, dueDate }
PUT    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Response format:

```json
{ "success": true, "data": {} }
{ "success": false, "message": "Error message" }
```

## Testing

Manual testing with Postman or Bruno:

1. Register a user, login, check `/api/auth/me`
2. Try duplicate email register (should give 409)
3. Try wrong password login (should give 401)
4. Open protected route without cookie (should give 401)
5. Create a valid task (should give 201)
6. Create a task with empty title (should give 400)
7. Edit, delete, search, filter tasks
8. Try to read another user's task id (should give 404)
9. Try invalid id and invalid status/priority (should give 400)

Frontend checks:

```bash
cd client
npm run lint
npm run build
```

## Deployment

- Frontend: Vercel (set `NEXT_PUBLIC_API_URL` to your backend URL)
- Backend: Render or any Node host (set `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`)
- Database: MongoDB Atlas (allow network access, create a database user)

In production the cookie uses `Secure` + `SameSite=None`, and CORS only allows your exact `CLIENT_URL`.

## Known limitations

- No password reset or email verification
- No team sharing, only personal tasks
- Search is a simple case-insensitive title match
- No automated tests yet
