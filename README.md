# ⚡ Momentum

> Gamified productivity. Build streaks. Earn points. Own your day.

**[Live Demo](https://momentum-nu-plum.vercel.app/)** · **[Report Bug](https://github.com/iamkdp/momentum/issues)**

---

## What is Momentum?

Most to-do apps are passive lists. You add tasks, maybe finish them, and feel nothing.

Momentum is different. Every task you complete earns points. Every routine you finish builds a streak. Miss a deadline and you lose points. Skip a day and your streak resets. The pressure is the point — it turns discipline into something that feels like a game you actually want to win.

Built as a serious full-stack portfolio project. Not a tutorial clone.

---

## Features

- **Auth** — Register and login with JWT stored in httpOnly cookies. Access token auto-refreshes silently using a refresh token. No localStorage, no exposure.
- **Tasks** — Add one-off tasks with optional deadlines and importance flags. Complete them to earn points. Miss a deadline and pay a penalty.
- **Daily Routines** — Habits that reset every morning. No cron jobs — lazy evaluation on every request checks if today's routine is done.
- **Streak System** — Complete any task or routine today and your streak grows. Miss a full day and it resets. Hit 7 days and earn a bonus.
- **Scoring** — Normal task: +10 pts. Important task: +25 pts. Routine: +15 pts. Missed deadline: -10 pts. 7-day streak milestone: +50 pts.
- **Analytics** — 14-day activity chart, score history bar chart, completion rates, best streak, and all-time stats.
- **Daily Quote** — A curated productivity quote that rotates by day-of-year. Zero external API dependency.
- **Clean UI** — Dark theme, Sora + DM Sans typography, loading skeletons, toast notifications, responsive mobile layout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| State | Zustand |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (httpOnly cookies, refresh tokens) |
| Deployment | Vercel (client), Render (server), MongoDB Atlas (db) |

---

## Architecture Decisions

**Why lazy evaluation for daily resets?**
Instead of a cron job that runs at midnight, every `GET /routines` request checks `lastCompletedDate` against today. If it's before today, the routine is pending. No background workers, no timing bugs, no infrastructure overhead.

**Why httpOnly cookies instead of localStorage?**
localStorage is accessible via JavaScript — any XSS attack can steal tokens. httpOnly cookies are invisible to JS and sent automatically by the browser. Combined with `sameSite: none` + `secure: true` in production, this is the correct, safe pattern for cross-origin auth.

**Why Zustand instead of Redux?**
Redux is overkill for this scale. Zustand gives you a global store with actions in ~10 lines. No boilerplate, no providers, no reducers.

**Why static JSON for quotes instead of an API?**
External APIs add a failure point. A 365-quote static file rotated by day-of-year is deterministic, fast, and never goes down.

---

## Scoring System

```
Complete a normal task       +10 pts
Complete an important task   +25 pts
Complete a daily routine     +15 pts
Miss a task deadline         -10 pts
7-day streak milestone       +50 pts bonus
```

Penalties are applied once per task on load — a `penaltyApplied` boolean prevents double-penalising.

---

## Streak Logic

```
lastCompletedDate = null          → never done, start fresh
lastCompletedDate = today         → already done, skip
lastCompletedDate = yesterday     → streak continues
lastCompletedDate = before yesterday → streak resets to 0
```

Global user streak increments the first time any task or routine is completed on a given day. `lastActivityDate` guards against double-counting within the same day.

---

## Local Setup

**Prerequisites:** Node.js 18+, MongoDB Atlas account (free tier)

```bash
# Clone the repo
git clone https://github.com/iamkdp/momentum.git
cd momentum
```

**Backend:**
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
# → Server running on port 5000
# → MongoDB connected
```

**Frontend:**
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
# → http://localhost:5173
```

---

## Deployment

| Service | Purpose | Plan |
|---|---|---|
| Vercel | React frontend | Free |
| Render | Express API | Free |
| MongoDB Atlas | Database | M0 Free |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

> **Note:** Render free tier spins down after 15 min of inactivity. First request after sleep takes ~30s. The app sends a warmup ping on load to minimise this.

---

## Project Structure

```
momentum/
├── server/
│   ├── config/         # DB connection
│   ├── controllers/    # Route logic (auth, tasks, routines, analytics, quote)
│   ├── middleware/      # JWT protect middleware
│   ├── models/         # Mongoose schemas (User, Task, Routine, DailyLog)
│   ├── routes/         # Express routers
│   ├── data/           # quotes.json
│   └── server.js
│
└── client/
    └── src/
        ├── api/        # Axios instance with interceptors
        ├── components/ # TaskCard, RoutineCard, Layout, Toast, Skeleton...
        ├── pages/      # Landing, Login, Register, Dashboard, Analytics
        └── store/      # Zustand stores (auth, task, routine, analytics)
```

---

## API Reference

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id/complete
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/routines
POST   /api/routines
PATCH  /api/routines/:id/complete
DELETE /api/routines/:id

GET    /api/analytics
GET    /api/quote
```

---

## What's Next (V2)

- [ ] Password reset via email
- [ ] Edit task titles inline
- [ ] Drag to reorder routines
- [ ] Weekly summary email every Sunday
- [ ] Public leaderboard (opt-in)
- [ ] PWA — install on mobile like a native app
- [ ] Routine categories (health, learning, work)

---

## Author

**K Durga Prasad**
[GitHub](https://github.com/iamkdp) · [LinkedIn](https://linkedin.com/in/iamkdp)

---

## License

MIT — use it, learn from it, build on it.
