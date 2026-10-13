# Linkly Server

Express 4 + Mongoose 8 API for Linkly. ES modules, simple controllers, no service layer.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/linkly
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
PUBLIC_BASE_URL=http://localhost:5000
```

`JWT_SECRET` and `MONGODB_URI` are required at startup. Never commit `.env`.

## Scripts

```bash
npm run dev  # watch mode
npm start    # production
```

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `PATCH /api/auth/me`
- `POST /api/links` (guest + auth), `GET /api/links` (auth, `page/limit/search/sort/status`)
- `GET /api/links/:id`, `PATCH /api/links/:id`, `DELETE /api/links/:id`, `PATCH /api/links/:id/status`, `GET /api/links/:id/analytics?range=`
- `GET /api/analytics/overview?range=`
- `GET /:shortCode` — 302 redirect, records a click

All JSON follows `{ success, message, data }` (errors add no stack traces).

## Notes

- Auth is a JWT in the httpOnly `token` cookie (7 days). `secure` + `sameSite: none` in production, `lax` in development.
- Short codes: 7 random URL-safe chars; custom aliases validated (3–30 chars, `A-Za-z0-9-_`, reserved names blocked).
- Only `http:`/`https:` destination URLs are accepted.
- Expired or deactivated links return 410 and never redirect.
