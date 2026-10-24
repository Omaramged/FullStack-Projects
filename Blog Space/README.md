# BlogSpace — Editorial Full-Stack Blogging Platform

BlogSpace is a modern editorial blogging platform built with a decoupled architecture: a **Next.js (React 19, Tailwind CSS)** frontend and an **Express.js (MongoDB, Mongoose)** REST API backend.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, cors
- **Database**: MongoDB

---

## 📁 Project Structure

```text
Blog Space/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Article.js
│   │   ├── Comment.js
│   │   ├── Like.js
│   │   ├── Bookmark.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── articles.js
│   │   ├── users.js
│   │   └── categories.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── articles/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [slug]/page.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.jsx
│   │   │   │   └── new/page.jsx
│   │   │   ├── login/page.jsx
│   │   │   ├── register/page.jsx
│   │   │   ├── layout.js
│   │   │   └── page.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ArticleCard.jsx
│   │   └── lib/
│   │       └── api.js
│   ├── .env.local
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- Local [MongoDB](https://www.mongodb.com/try/download/community) running on port `27017` or a MongoDB Atlas URI.

---

### 2. Backend Setup

1. Open PowerShell and navigate to `backend/`:
   ```powershell
   npm install
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/blogspace
   JWT_SECRET=supersecretblogspacekey123
   FRONTEND_URL=http://localhost:3000
   ```
   *(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string).*

3. Seed initial categories and editorial demo articles:
   ```powershell
   npm run seed
   ```

4. Start the backend API server:
   ```powershell
   npm run dev
   ```
   The backend server will run at: `http://localhost:5000/api/v1`

---

### 3. Frontend Setup

1. In another PowerShell terminal, navigate to `frontend/`:
   ```powershell
   npm install
   ```

2. Confirm environment variable in `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

3. Start the Next.js development server:
   ```powershell
   npm run dev
   ```
   The application will be accessible at: `http://localhost:3000`

---

## 🔑 Demo Credentials (from Seed)

- **User 1**:
  - Email: `elena@example.com`
  - Password: `password123`
- **User 2**:
  - Email: `marcus@example.com`
  - Password: `password123`
