# BlogSpace — Backend API

Express.js REST API with MongoDB and Mongoose for the BlogSpace platform.

---

## 🛠️ Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **bcryptjs** (Password hashing)
- **jsonwebtoken** (JWT authentication)
- **cookie-parser** & **cors**
- **dotenv**

---

## 📁 Structure

```text
backend/
├── models/
│   ├── User.js
│   ├── Article.js
│   ├── Comment.js
│   ├── Like.js
│   ├── Bookmark.js
│   └── Category.js
├── routes/
│   ├── auth.js
│   ├── articles.js
│   ├── users.js
│   └── categories.js
├── middleware/
│   └── auth.js
├── .env
├── .env.example
├── seed.js
├── server.js
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Seed sample data (optional):**
   ```powershell
   npm run seed
   ```

3. **Start the development server:**
   ```powershell
   npm run dev
   ```
   API runs at `http://localhost:5000/api/v1`

---

## 📡 API Endpoints

### Auth (`/api/v1/auth`)
- `POST /register` — Register new user
- `POST /login` — Login user & return token/cookie
- `POST /logout` — Logout user
- `GET /me` — Get authenticated user details
- `PATCH /change-password` — Change password

### Articles (`/api/v1/articles`)
- `GET /` — List published articles (supports `?category=`, `?tag=`, `?search=`, `?sort=`)
- `GET /featured` — Get featured stories
- `GET /me` — Get user's own articles (drafts & published)
- `GET /:slug` — Get single article by slug
- `POST /` — Create article (authenticated)
- `PATCH /:id` — Update article (owner/admin)
- `DELETE /:id` — Delete article (owner/admin)
- `GET /:id/comments` — Get article comments
- `POST /:id/comments` — Add comment
- `PUT /:id/like` — Like article
- `DELETE /:id/like` — Unlike article
- `GET /:id/like-status` — Check like & bookmark status
- `PUT /:id/bookmark` — Bookmark article
- `DELETE /:id/bookmark` — Remove bookmark

### Users (`/api/v1/users`)
- `GET /:username` — Public author profile
- `GET /:username/articles` — Author's published articles
- `PATCH /me` — Update current user's profile
- `GET /me/bookmarks` — Current user's saved reading list
- `GET /me/stats` — Current user's dashboard statistics

### Categories (`/api/v1/categories`)
- `GET /` — Get all categories
- `GET /:slug` — Get category details and articles
