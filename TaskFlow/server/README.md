# TaskFlow Server

Express API for TaskFlow. Handles auth and task CRUD with MongoDB.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill it in:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=change-this-secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Run

```bash
npm start
```

Health check: `GET http://localhost:5000/api/health`

## Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/tasks
GET  /api/tasks/:id
POST /api/tasks
PUT  /api/tasks/:id
PATCH /api/tasks/:id
DELETE /api/tasks/:id
```

All `/api/tasks` routes need the login cookie.
