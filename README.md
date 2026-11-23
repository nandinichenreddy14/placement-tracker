# Placement Prep Tracker

A full-stack web app for tracking coding-interview prep: the problems you've solved, the companies you're targeting, and how it's all adding up — in one dashboard.

**Live demo:** https://placement-tracker-bvr2t7ask-nandinichenreddy14-7377.vercel.app

## Features

- **Auth** — email/password signup and login, JWT-based sessions, bcrypt-hashed passwords
- **Problems tracker** — full CRUD for coding problems: title, platform, difficulty, topic, status (Solved/Revisit), link, notes, and date; searchable and filterable by difficulty, status, and topic
- **Companies tracker** — full CRUD for target companies, organized Kanban-style by status (Wishlist → Applied → OA → Interview → Offer / Rejected), with role and interview date
- **Dashboard** — stat cards, a difficulty breakdown donut chart, a problems-by-topic bar chart, a company status pipeline, and a recent-activity feed
- **Per-user data isolation** — every user only ever sees their own problems and companies, enforced at the database query level

## Tech stack

**Frontend**
- React + Vite
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) components (Radix primitives under the hood)
- React Router
- Recharts for charts, Framer Motion for transitions, Sonner for toasts
- Deployed on **Vercel**

**Backend**
- Node.js + Express
- Prisma ORM
- **Neon** (serverless Postgres)
- JWT auth with bcrypt password hashing
- Deployed on **Render**

## Running locally

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) Postgres database (free tier works fine) — used for both local dev and production

### 1. Clone and install

```bash
git clone https://github.com/nandinichenreddy14/placement-tracker.git
cd placement-tracker
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env` (see `server/.env.example`):

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
PORT=4000
JWT_SECRET="a-long-random-string"
CLIENT_URL=http://localhost:5173
```

Run the database migrations, then start the server:

```bash
npx prisma migrate dev
npm start
```

The API runs at `http://localhost:4000`.

### 3. Frontend setup

In a separate terminal:

```bash
cd client
npm install
```

Create `client/.env` (see `client/.env.example`):

```
VITE_API_URL=http://localhost:4000/api
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`. Open it in your browser, sign up, and start tracking.

## Project structure

```
placement-tracker/
├── server/   # Express API + Prisma schema
└── client/   # React + Vite frontend
```

See `CLAUDE.md` for the detailed build plan, API route list, and data model.
