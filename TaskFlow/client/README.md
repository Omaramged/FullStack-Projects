# TaskFlow Client

Next.js frontend for TaskFlow. Simple pages for home, login, register, and dashboard.

## Pages

- `/` - landing page
- `/login` - login form
- `/register` - register form
- `/dashboard` - protected task list (redirects to login if not logged in)

## Setup

```bash
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Run

```bash
npm run dev
```

Open http://localhost:3000

## Other commands

```bash
npm run build
npm run start
npm run lint
```

## Notes

- API calls are in `src/lib/api.js` using `fetch()` with `credentials: include`
- Auth state comes from `GET /api/auth/me`
- The backend must be running for login and tasks to work
