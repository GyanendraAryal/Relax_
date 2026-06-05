# Relax Station Food and Fun — Restaurant CMS

Production-grade PERN stack CMS for **Relax Station Food and Fun**, a restaurant in Kathmandu, Nepal.

## Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Redux Toolkit, Tailwind CSS v3, Framer Motion, Axios, React Hook Form |
| Backend | Node.js, Express, PostgreSQL, JWT, Cloudinary, Redis (optional), Zod, Pino, Sentry |
| DevOps | Docker (multi-stage), env validation on startup |

## Project Structure

```
/client   → Public website + Admin dashboard
/server   → REST API
```

## Quick Start (Local)

### 1. Start PostgreSQL & Redis

```bash
docker compose up postgres redis -d
```

### 2. Backend

```bash
cd server
cp .env.example .env
npm install
npm run migrate   # if DB is empty (or use docker init script)
npm run seed
npm run dev
```

API: `http://localhost:5000/api`

**Default admin:** `admin@relaxstation.np` / `Admin@12345`

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Site: `http://localhost:5173`

## Docker (Full Stack)

```bash
cp server/.env.example server/.env
# Edit server/.env — set JWT_SECRET (32+ chars), DATABASE_URL, etc.

docker compose up --build
```

- Web: http://localhost:5173  
- API: http://localhost:5000/api  
- Health: http://localhost:5000/api/health  

## API Overview

| Resource | Public | Admin (JWT) |
|----------|--------|-------------|
| Auth | — | POST `/auth/login`, GET `/auth/me` |
| Menu | GET `/menu/public` | CRUD categories & items |
| Gallery | GET `/gallery/public` | CRUD |
| Offers | GET `/offers/public` | CRUD |
| Today Special | GET `/today-specials/public/today` | CRUD |
| Bookings | POST birthday/event (rate limited) | List & update status |
| Settings | GET `/settings/public` | PUT bulk update |
| Dashboard | — | GET `/dashboard` |

## Environment

See `server/.env.example` and `client/.env.example`.

Required server vars: `DATABASE_URL`, `JWT_SECRET` (min 32 chars), `CLIENT_URL`.

Optional: `REDIS_URL`, Cloudinary, `SENTRY_DSN`.

## Security Notes

- Change default admin password after first login
- Use strong `JWT_SECRET` in production
- Configure Cloudinary for image uploads
- HTTPS + secure cookies in production

## License

Private — Relax Station Food and Fun
