# Compiler Code — Backend

Express + MongoDB API for the Compiler Code workspace.

## Scripts

```bash
npm install   # install dependencies
npm start     # start the server (also used for development)
```

## Environment variables

Create a `.env` file in this folder (there is an `.env.example` to copy from).

```env
MONGODB_URI=mongodb://127.0.0.1:27017/compiler-code
PORT=5000
JWT_SECRET=some_long_random_string
PISTON_API_URL=https://emkc.org/api/v2/piston
```

| Variable        | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `MONGODB_URI`   | MongoDB connection string (local or Atlas)                          |
| `PORT`          | Port the Express server listens on (default `5000`)                 |
| `JWT_SECRET`    | Secret used to sign login tokens, use a long random value           |
| `PISTON_API_URL`| Base URL of the Piston runner used by `POST /api/run`               |

## Folder layout

```text
backend/
├── config/db.js                  # Mongoose connection
├── controllers/
│   ├── authController.js         # register, login, me
│   ├── projectController.js      # project CRUD + duplicate
│   ├── fileController.js         # files and folders
│   └── runController.js          # code execution
├── middleware/authMiddleware.js  # reads the Bearer token
├── models/
│   ├── User.js
│   ├── Project.js
│   └── ProjectFile.js
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── fileRoutes.js
│   └── runRoutes.js
└── server.js
```

## Endpoints

Authentication (public):

- `POST /api/auth/register` — body `{ name, email, password }`
- `POST /api/auth/login` — body `{ email, password }`

Everything below needs `Authorization: Bearer <token>`:

- `GET /api/auth/me`
- `GET /api/projects` · `POST /api/projects`
- `GET /api/projects/:id` · `PUT /api/projects/:id` · `DELETE /api/projects/:id`
- `POST /api/projects/:id/duplicate`
- `GET|POST /api/projects/:projectId/files`
- `PUT /api/projects/:projectId/files/:fileId`
- `PUT /api/projects/:projectId/files/:fileId/rename`
- `DELETE /api/projects/:projectId/files/:fileId`
- `POST /api/run` — optional server runner, body `{ language, code }`

## Rules the API enforces

- Every project and file request checks that the item belongs to the logged-in user.
- File and folder names allow letters, numbers, dots, dashes and underscores.
- Maximums: 50 items per project, 6 folder levels, 64 characters per name, 100KB per file.
- Project files have a unique index on `(projectId, folder, name)`.
- Invalid or unknown project ids return `404`.

## Code execution

The workspace runs code in the browser, so `POST /api/run` is optional and not used by the UI.
It sends the code to a Piston instance. The public `emkc.org` instance is whitelist only, so set
`PISTON_API_URL` to your own instance, for example:

```bash
docker run -d --name piston -p 2000:2000 --privileged ghcr.io/engineer-man/piston
```

```env
PISTON_API_URL=http://localhost:2000/api/v2
```

Requests time out after 15 seconds. When the runner cannot be reached, the API returns a clear
error message instead of a fake result.
