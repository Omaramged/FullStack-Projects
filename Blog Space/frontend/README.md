# BlogSpace — Frontend

Next.js App Router frontend for BlogSpace styled with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **React**
- **Tailwind CSS**
- **Lucide React** (Icons)

---

## 📁 Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── articles/
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   ├── dashboard/
│   │   │   ├── page.jsx
│   │   │   └── new/page.jsx
│   │   ├── login/page.jsx
│   │   ├── register/page.jsx
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ArticleCard.jsx
│   └── lib/
│       └── api.js
├── .env.local
├── .env.example
├── .gitignore
├── next.config.mjs
└── package.json
```

---

## ⚙️ Environment Variables

Create `.env.local` based on `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Start the development server:**
   ```powershell
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for production:**
   ```powershell
   npm run build
   npm run start
   ```
