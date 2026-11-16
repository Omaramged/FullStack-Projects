# Evently — Event Management & RSVP Platform

Evently is a full-stack web application where users can discover events, book tickets, and manage reservations. Organizers can create events and manage attendees; admins moderate the platform.

## Tech Stack

**Frontend**
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- React Hook Form + Zod

**Backend**
- Node.js + Express (TypeScript)
- MongoDB + Mongoose
- JWT Authentication (HttpOnly cookies)
- bcrypt

**External Services**
- Supabase Storage (event images)
- Resend (emails)
- QR code generation (`qrcode`)

Frontend and backend are separate applications. Express handles all backend logic and database operations.

## Project Structure

```
Evently/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── bookings/
│   │   │   └── events/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── services/
    │   └── ...
    ├── .env.example
    └── package.json
```

## User Roles

- **Attendee** — browse events, book tickets, view/manage bookings, access digital tickets.
- **Organizer** — create/manage events, create ticket types, view attendees, check in tickets.
- **Admin** — view users/events, remove users or events.

## Features

- Public event discovery with search, category, and date filters + pagination.
- Event details with ticket types (General, VIP, Early Bird), free & paid.
- Booking flow with availability checks and quantity limits.
- QR code tickets + check-in (camera/manual lookup).
- Attendee dashboard (upcoming/previous bookings, tickets).
- Organizer dashboard (stats, my events, create/edit/cancel, attendees).
- Admin dashboard (users, events, removal).
- JWT auth with role-based access control.

**Note:** No real payment gateway is integrated. Paid tickets are represented as reservations.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### Backend

```bash
cd backend
npm install
cp .env.example .env.local
# fill in MONGODB_URI, JWT secrets, etc.
npm run dev
```

Backend runs on `http://localhost:5001` (default).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:5001/api
npm run dev
```

Frontend runs on `http://localhost:3001` (default).

## Environment Variables

**Backend** (`.env.local`):
```
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/evently
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
CLIENT_URL=http://localhost:3001
SUPABASE_URL=
SUPABASE_SECRET_KEY=
SUPABASE_STORAGE_BUCKET=event-images
RESEND_API_KEY=
EMAIL_FROM=Evently <no-reply@evently.local>
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Never commit real credentials. `.env`/`.env.local` are gitignored.

## API Endpoints (examples)

**Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`

**Events:** `GET /api/events`, `GET /api/events/:id`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`

**Bookings:** `POST /api/bookings`, `GET /api/bookings/my-bookings`, `GET /api/bookings/:id`, `PUT /api/bookings/:id/cancel`

**Organizer:** `GET /api/events/organizer/mine`, `GET /api/organizer/events/:id/attendees`, `POST /api/organizer/check-in`

**Admin:** `GET /api/admin/users`, `GET /api/admin/events`, `DELETE /api/admin/users/:id`, `DELETE /api/admin/events/:id`

## Verification

- Backend: `npm run typecheck` and `npm run build` pass.
- Frontend: `npm run build` passes (20 routes).

## License

MIT