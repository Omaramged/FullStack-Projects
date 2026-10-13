# Linkly Client

Next.js 16 (App Router) frontend for Linkly. Plain React with `useState`/`useEffect`, Tailwind CSS 4, and simple `fetch()` calls — no state library, no chart library.

## Pages

- `/` — landing with working guest shorten form, features, how-it-works, footer.
- `/login`, `/register` — auth forms.
- `/dashboard` — totals, click chart, top links, recent activity.
- `/dashboard/links` — search, sort, status filter, pagination, copy/open/stats/edit/activate/delete.
- `/dashboard/links/new` — create form.
- `/dashboard/links/[id]/edit` — edit form.
- `/dashboard/links/[id]/analytics` — per-link chart + recent clicks.
- `/dashboard/settings` — account info + update display name.
- `/privacy`, `/terms` — static policy pages.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The API base must point at the Express backend. All requests use `credentials: "include"` so the auth cookie is sent.

## Scripts

```bash
npm run dev    # dev server on http://localhost:3000
npm run build  # production build
npm run start  # serve production build
npm run lint   # eslint
```

## Notes

- `lib/api.js` is the shared fetch helper.
- `components/Navbar.jsx` loads the current user from `GET /auth/me`.
- Short URLs shown in the UI are built by the backend (`PUBLIC_BASE_URL`) and open the Express redirect route.
