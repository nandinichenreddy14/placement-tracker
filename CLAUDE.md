# Placement Prep Tracker — Project Plan

A full-stack MVP to track coding problem practice and company applications while learning to build + deploy a full-stack app.

## Stack
- Monorepo: `/server` (Node + Express + Prisma) and `/client` (React + Vite + React Router)
- Database: Neon Postgres (same instance for local dev and production)
- Styling: plain CSS, no UI library
- Deploy: backend → Render, frontend → Vercel

## Workflow rules (how we work through this plan)
1. Tests are run by Claude using PowerShell `Invoke-RestMethod` or `curl`, not Postman — results shown inline.
2. Root `.gitignore` ignores `node_modules` and all `.env` files.
3. After each step's test passes, make a git commit with a clear message.
4. Before each step, give a 2-3 line heads-up on what's being built and why.
5. Stop after each step for review before moving to the next.

## 1. Folder structure

```
placement-tracker/
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── problems.routes.js
│   │   │   ├── companies.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── problems.controller.js
│   │   │   ├── companies.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js      # verifies JWT, attaches req.userId
│   │   ├── lib/
│   │   │   └── prisma.js               # single PrismaClient instance
│   │   └── index.js                    # express app entry
│   ├── .env                            # DATABASE_URL, JWT_SECRET, PORT
│   ├── .env.example
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js               # axios instance + JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProblemForm.jsx
│   │   │   ├── ProblemCard.jsx
│   │   │   ├── CompanyForm.jsx
│   │   │   └── CompanyCard.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProblemsPage.jsx
│   │   │   └── CompaniesPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                            # VITE_API_URL
│   ├── .env.example
│   └── package.json
├── .gitignore
└── CLAUDE.md
```

**Why a monorepo with two independent packages:** Render deploys the server as a Node web service and Vercel deploys the client as a static/Vite build — they need separate `package.json`s and separate deploy configs anyway, so keeping them as sibling folders (not a shared workspace) avoids dealing with workspace tooling for a 2-package MVP.

## 2. Prisma schema

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String     // bcrypt hash
  createdAt DateTime   @default(now())
  problems  Problem[]
  companies Company[]
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum ProblemStatus {
  SOLVED
  REVISIT
}

model Problem {
  id         String        @id @default(uuid())
  title      String
  platform   String        // "LeetCode", "GFG", etc — free text, not enum
  difficulty Difficulty
  topic      String        // "Arrays", "DP", etc — free text
  status     ProblemStatus
  link       String?
  notes      String?
  date       DateTime      @default(now())
  userId     String
  user       User          @relation(fields: [userId], references: [id])

  @@index([userId])
}

enum CompanyStatus {
  WISHLIST
  APPLIED
  OA
  INTERVIEW
  OFFER
  REJECTED
}

model Company {
  id              String        @id @default(uuid())
  name            String
  role            String
  status          CompanyStatus
  interviewDate   DateTime?
  notes           String?
  userId          String
  user            User          @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

**Why `platform`/`topic` are free-text, not enums:** You'll want to add platforms/topics without a migration. Difficulty and status *are* enums because that's a small, truly fixed set — gives you DB-level validation for free.

## 3. API routes

| Method | Path | Auth? | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create user (hash password with bcrypt), return JWT |
| POST | `/api/auth/login` | No | Verify credentials, return JWT |
| GET | `/api/auth/me` | Yes | Return current user's id/email (for session restore on refresh) |
| GET | `/api/problems` | Yes | List current user's problems (optional query params: `topic`, `difficulty`, `status`) |
| POST | `/api/problems` | Yes | Create a problem for current user |
| GET | `/api/problems/:id` | Yes | Get one problem (must belong to current user) |
| PUT | `/api/problems/:id` | Yes | Update a problem |
| DELETE | `/api/problems/:id` | Yes | Delete a problem |
| GET | `/api/companies` | Yes | List current user's companies (optional query param: `status`) |
| POST | `/api/companies` | Yes | Create a company entry |
| GET | `/api/companies/:id` | Yes | Get one company |
| PUT | `/api/companies/:id` | Yes | Update a company |
| DELETE | `/api/companies/:id` | Yes | Delete a company |
| GET | `/api/dashboard` | Yes | Aggregated counts: problems by difficulty, problems by topic, companies by status |

**Why ownership checks live in the controller, not just `WHERE userId`:** Every query filters by `req.userId` (from the JWT) so a user literally cannot fetch/edit/delete another user's row — not even by guessing an id.

**Why `/dashboard` is a dedicated endpoint instead of computed client-side:** Aggregation (`GROUP BY` via Prisma's `groupBy`) is cheap in Postgres and keeps the client dumb — it just renders numbers it's given.

## 4. Frontend pages & components

**Pages:** `SignupPage`, `LoginPage`, `DashboardPage`, `ProblemsPage`, `CompaniesPage`

**Components:** `Navbar`, `ProtectedRoute`, `ProblemForm`, `ProblemCard`, `CompanyForm`, `CompanyCard`

**State/data:**
- `AuthContext` — holds `user`, `token`, `login()`, `logout()`; reads/writes JWT in `localStorage`
- `api/client.js` — axios instance with `baseURL: VITE_API_URL`, interceptor attaches `Authorization: Bearer <token>`

**Why JWT in `localStorage` instead of an httpOnly cookie:** An httpOnly cookie is more secure against XSS, but requires same-site/cross-domain cookie config between Vercel and Render (different domains). `localStorage` + `Authorization` header is simpler for the MVP; worth revisiting as a hardening step later.

## 5. Environment variables

**server/.env**
```
DATABASE_URL=postgresql://<neon-connection-string>
JWT_SECRET=<long-random-string>
PORT=4000
CLIENT_URL=http://localhost:5173   # used for CORS allow-list; becomes Vercel URL in prod
```

**client/.env**
```
VITE_API_URL=http://localhost:4000/api   # becomes Render URL in prod
```

**Why `CLIENT_URL` on the server:** Express `cors()` needs an explicit allowed origin once client and server are on different domains in production.

## 6. Build order (small, independently testable chunks)

1. **Scaffold repo** — folders, root `.gitignore`. *Test: structure exists.*
2. **Server skeleton** — Express app, `GET /api/health`. *Test: `Invoke-RestMethod`/`curl` returns 200.*
3. **Prisma + Neon connection** — `prisma init`, `User` model only, migrate. *Test: migration succeeds, table visible in Neon.*
4. **Auth: signup + login** — bcrypt hash, JWT sign, auth middleware. *Test: signup, login, hit protected dummy route with token.*
5. **Prisma: Problem model** — add + migrate. *Test: migration succeeds.*
6. **Problems CRUD routes** — scoped to `req.userId`. *Test: user A's problems invisible to user B's token.*
7. **Prisma: Company model** — add + migrate. *Test: migration succeeds.*
8. **Companies CRUD routes** — same ownership pattern. *Test: same cross-user check.*
9. **Dashboard route** — `groupBy` aggregations. *Test: counts match created data.*
10. **Client scaffold** — Vite + React Router, blank pages. *Test: click through routes in browser.*
11. **Client auth** — `AuthContext`, `api/client.js`, Login/Signup wired to real backend. *Test: signup → login → redirect.*
12. **Client: ProtectedRoute + Navbar** — lock routes, logout. *Test: logged-out redirect; logout clears token.*
13. **Client: Problems page** — list + form CRUD, basic CSS. *Test: full CRUD in browser.*
14. **Client: Companies page** — same pattern. *Test: full CRUD in browser.*
15. **Client: Dashboard page** — fetch + render `/api/dashboard`. *Test: numbers match.*
16. **Deploy backend to Render** — env vars, migrations run against Neon. *Test: hit live `/api/health`.*
17. **Deploy frontend to Vercel** — `VITE_API_URL` set, server `CLIENT_URL`/CORS updated. *Test: full flow live.*

**Why this order:** Backend-first, one model at a time, tested before any UI exists — isolates backend bugs from frontend bugs. Deploy is last so we're not debugging infra and app logic simultaneously.
