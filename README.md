# FullStack Projects

A collection of full-stack web applications built with modern JavaScript/TypeScript stacks. Each project lives in its own folder with a separate frontend and backend.

## Projects

### 1. Blog Space — Editorial Blogging Platform
- **Stack:** Next.js (React 19, Tailwind) + Express (MongoDB, Mongoose, JWT)
- **Features:** Articles, comments, likes, bookmarks, categories, author dashboard.
- **Folder:** `Blog Space/`

### 2. Compiler Code — Browser-Based Coding Workspace
- **Stack:** Next.js (Monaco editor) + Express (MongoDB)
- **Features:** Projects, file explorer, run JavaScript/Python in-browser (Web Worker + Pyodide), save state, themes.
- **Folder:** `Compiler Code/`

### 3. HireHub — Job Recruitment Platform
- **Stack:** Next.js (TypeScript, Tailwind, shadcn/ui) + Express (TypeScript, MongoDB, Mongoose)
- **Features:** Candidate/employer/admin roles, job listings, applications, ATS pipeline, saved jobs, notifications, Supabase storage, Resend emails.
- **Folder:** `HireHub/`

### 4. Linkly — URL Shortener
- **Stack:** Next.js 16 + Express (MongoDB)
- **Features:** Short links, custom aliases, click analytics (browser/OS/device/referrer), dashboard, rate limiting, helmet.
- **Folder:** `Linkly/`

### 5. TaskFlow — Task Management App
- **Stack:** Next.js (App Router) + Express (MongoDB, Mongoose, JWT cookies)
- **Features:** Register/login, task CRUD, status/priority, search, filters, dashboard stats.
- **Folder:** `TaskFlow/`

### 6. To Do List — Simple Full-Stack To-Do
- **Stack:** Next.js (App Router, Tailwind) + Express (MongoDB, Mongoose)
- **Features:** Auth + todo CRUD.
- **Folder:** `To Do List/`

### 7. Evently — Event Management & RSVP Platform
- **Stack:** Next.js 16 (TypeScript, Tailwind, shadcn/ui) + Express (TypeScript, MongoDB, Mongoose)
- **Features:** Discover events, ticket types, booking with QR tickets, check-in (scan + manual), organizer & attendee & admin dashboards, notifications.
- **Folder:** `Evently/`

## General Setup

Each project has its own `frontend/` and `backend/` (or `client/`/`server/`) folders with separate `package.json` files.

Typical workflow per project:

```bash
# backend
cd <project>/backend   # or server
npm install
cp .env.example .env.local   # or .env
npm run dev

# frontend (in another terminal)
cd <project>/frontend   # or client
npm install
cp .env.example .env.local
npm run dev
```

## Requirements

- Node.js 18+
- npm
- MongoDB (local or MongoDB Atlas)

## Notes

- Real `.env` / `.env.local` files are gitignored. Use the provided `.env.example` files as templates.
- Never commit secrets, API keys, or database credentials.
- Each project is independent; dependencies are installed per project.

## License

MIT