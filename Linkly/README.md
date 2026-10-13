# Linkly — URL Shortener

Linkly turns long URLs into short links, manages them per user, redirects visitors, and shows real click analytics.

## Features

- Shorten any `http`/`https` URL without signup (guest links).
- Optional custom alias, title, and expiration date.
- User accounts: register, login, logout, current user.
- Dashboard: total links, total clicks, active links, expired links, click chart, top links, recent activity.
- Link management: search, sort, status filter, pagination, copy, open, edit, activate/deactivate, delete (with confirm), per-link analytics.
- Click tracking on every redirect: browser, OS, device type, referrer, timestamp.
- Account settings: update display name.
- Date ranges: last 7 / 30 / 90 days, all time.
- Light design with Tailwind, responsive on mobile, tablet, desktop.

## Technology Stack

- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS 4, plain `fetch()`.
- Backend: Node.js, Express 4, Mongoose 8, MongoDB.
- Auth: JWT in httpOnly cookie, bcryptjs password hashing.
- Other: `cors`, `cookie-parser`, `helmet`, `express-rate-limit`, `dotenv`.
- No TypeScript, no component library, no global state library, no chart library (charts are plain divs).

## Project Structure

```text
Linkly/
├── client/                  # Next.js frontend
│   ├── app/
│   │   ├── page.js          # landing + guest shorten form
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── privacy/page.js
│   │   ├── terms/page.js
│   │   ├── dashboard/page.js
│   │   ├── dashboard/links/page.js
│   │   ├── dashboard/links/new/page.js
│   │   ├── dashboard/links/[id]/edit/page.js
│   │   ├── dashboard/links/[id]/analytics/page.js
│   │   └── dashboard/settings/page.js
│   ├── components/Navbar.jsx
│   └── lib/api.js           # fetch helper
├── server/                  # Express backend
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/db.js
│       ├── middleware/auth.js
│       ├── middleware/optionalAuth.js
│       ├── models/User.js
│       ├── models/Link.js
│       ├── models/Click.js
│       ├── routes/auth.js
│       ├── routes/links.js
│       ├── routes/analytics.js
│       ├── routes/redirect.js
│       └── utils/shortCode.js
├── package.json             # root helper scripts
├── PLAN.md                  # phases and acceptance criteria
├── README.md
└── Linkly.md                # original full spec
```

## Prerequisites

- Node.js 20+ and npm.
- MongoDB running locally or a MongoDB Atlas URI.

## Installation

```bash
# backend
cd server
npm install

# frontend (second terminal)
cd client
npm install
```

## MongoDB Setup

Local option:

1. Install and start MongoDB.
2. Use `MONGODB_URI=mongodb://127.0.0.1:27017/linkly`.

Atlas option:

1. Create a cluster at MongoDB Atlas.
2. Allow your IP and create a database user.
3. Use the connection string as `MONGODB_URI`.

## Environment Configuration

Backend (`server/.env`, copy from `server/.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/linkly
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
PUBLIC_BASE_URL=http://localhost:5000
```

Frontend (`client/.env.local`, see `client/.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Rules:

- Never commit real `.env` files (they are gitignored).
- Never put secrets in `NEXT_PUBLIC_` variables.
- `PUBLIC_BASE_URL` is the base used to build short URLs. It points to the backend because redirects are served by Express (`GET /:shortCode`).
- In production set `NODE_ENV=production` (cookies become `secure` + `sameSite: none`, so the site must run on HTTPS).

## Running the Frontend

```bash
cd client
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```

## Running the Backend

```bash
cd server
npm run dev     # watch mode, http://localhost:5000
npm start       # production
```

Health check: `GET /api/health` returns service status and DB state (`connected` / `disconnected`).

## Running Tests

No automated test suite exists yet. Manual checks used so far:

- `npm run build` in `client/` passes.
- `GET /api/health` returns success.
- Manual flows: guest shorten, register/login, create/edit/delete link, redirect, dashboard numbers.

## URL-Shortening Behavior

- `POST /api/links` accepts `{ originalUrl, title?, customAlias?, expiresAt? }`.
- Guests (no login) can create links; they get the short URL immediately but cannot manage it later — management requires an account.
- Authenticated creations are linked to the user (`user` field).
- `clickCount` and `lastClickedAt` are never accepted from the client.
- Reserved codes can never be used as aliases, so short URLs never shadow app/API routes.

## Custom Alias Rules

- 3–30 characters.
- Only letters, numbers, `-`, `_`.
- Must be unique (taken aliases return 400).
- Reserved names: `api`, `login`, `register`, `dashboard`, `settings`, `about`, `health`, `links`, `analytics`, `privacy`, `terms`.

## Authentication

- `POST /api/auth/register` — name, username, email, password. Emails lowercased, passwords hashed with bcrypt, duplicates rejected.
- `POST /api/auth/login` — generic "Invalid email or password" error, sets httpOnly cookie `token` (7 days).
- `POST /api/auth/logout` — clears the cookie.
- `GET /api/auth/me` — current user (protected).
- Frontend sends `credentials: "include"` on every API call.
- Users can only access their own links/analytics; ownership comes from the verified JWT, never from client input.

## Click-Counting Methodology

On each valid redirect:

1. A `Click` document is created (referrer, device type, browser, OS).
2. `link.clickCount` is incremented by 1 and `lastClickedAt` updated.
3. The visitor is 302-redirected to the stored `originalUrl`.

If the click write fails, the redirect still happens (logged server-side). Counts are raw totals, not unique visitors.

## Analytics Limitations

- No IP addresses or locations are stored, so there is no geographic data.
- Bots, link-preview crawlers, and repeated visits inflate raw click counts.
- Total clicks do not equal unique human visitors.
- Device/browser/OS come from the `User-Agent` header and are rough classifications.

## Security Considerations

- bcrypt password hashing, JWT expiry (7d), httpOnly cookies.
- CORS restricted to `CLIENT_URL` with credentials.
- Helmet headers, JSON body limit (100kb), rate limiting on `/api/auth` and `/api/links`.
- Server-side validation of URLs, aliases, dates, ObjectIds.
- Ownership checks on every private route.
- Only `http:`/`https:` destinations allowed; `javascript:`, `data:`, `file:` rejected.
- Backend never fetches destination URLs (no SSRF surface).
- Redirects only go through stored link records, never raw query params.

## API Endpoints

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/api/health` | no | service + DB status |
| POST | `/api/auth/register` | no | create account |
| POST | `/api/auth/login` | no | login, set cookie |
| POST | `/api/auth/logout` | no | clear cookie |
| GET | `/api/auth/me` | yes | current user |
| PATCH | `/api/auth/me` | yes | update display name |
| POST | `/api/links` | no | create short link (guest or user) |
| GET | `/api/links?page&limit&search&sort&status` | yes | own links |
| GET | `/api/links/:id` | yes | one link |
| PATCH | `/api/links/:id` | yes | update URL/title/expiry |
| DELETE | `/api/links/:id` | yes | delete link + its clicks |
| PATCH | `/api/links/:id/status` | yes | activate/deactivate |
| GET | `/api/links/:id/analytics?range=` | yes | per-link stats |
| GET | `/api/analytics/overview?range=` | yes | dashboard stats |
| GET | `/:shortCode` | no | redirect (302); browsers get a friendly HTML page for missing/deactivated/expired links |

Range values: `7d`, `30d`, `90d`, `all`. Success format: `{ success, message, data }`.

## Deployment Instructions

1. Deploy frontend on a Next.js host (e.g. Vercel), backend on a Node host, database on MongoDB Atlas.
2. Set all backend env vars with production values (`NODE_ENV=production`, Atlas `MONGODB_URI`, long `JWT_SECRET`, real `CLIENT_URL`, public `PUBLIC_BASE_URL` over HTTPS).
3. Set frontend `NEXT_PUBLIC_API_URL` to the deployed API URL.
4. Verify CORS (backend `CLIENT_URL` must exactly match the frontend origin), login across domains, short-URL redirects, and indexes (unique on `users.email`, `users.username`, `links.shortCode` are created automatically by the schemas).

## Known Limitations

- No automated tests yet.
- No password reset / email verification.
- Guest links cannot be claimed later by registering.
- Rate limiting is in-memory (resets on restart, not shared across instances).
- No scheduled cleanup of expired links (expiry is checked on every redirect, so correctness does not depend on it).
- Charts are simple bar divs, not a chart library.

## Future Improvements

- Add Jest/Vitest + Supertest coverage for validation, auth, links, redirects.
- Password reset and change-password flows.
- QR codes for short links.
- Unique-visitor counting with privacy-safe hashing.
- Shared rate-limit store (e.g. Redis) for multi-instance deploys.
