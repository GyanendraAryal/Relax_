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

Required server vars: `DATABASE_URL`, `JWT_SECRET` (min 32 chars), `CLIENT_URLS`.

Optional: `REDIS_URL`, Cloudinary, `SENTRY_DSN`.

## Security Notes

- Change default admin password after first login
- Use strong `JWT_SECRET` in production
- Configure Cloudinary for image uploads
- HTTPS + secure cookies in production

---

## Fixing CORS Problems

### What is CORS?

CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks a web page from making requests to a different origin (domain + port + protocol) than the one that served it. The browser sends the request origin in the `Origin` header, and the server must explicitly allow it.

> **Example:** Your frontend on `http://localhost:5173` calls your API on `http://localhost:5000`. These are different origins (different ports), so CORS kicks in.

---

### Symptom — What You'll See

In the **browser console:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 
'http://localhost:5174' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' 
header is present on the requested resource.
```

In the **server logs** (this project):
```json
{ "origin": "http://localhost:5174", "statusCode": 403 }
```

Or the server starts crashing with:
```
Invalid environment variables: { CLIENT_URLS: [ 'Required' ] }
```

---

### Root Causes & Fixes

#### 1. Wrong / missing origin in `CLIENT_URLS`

**Problem:** `CLIENT_URLS` in `.env` doesn't include the port your frontend is running on.  
Vite defaults to `5173` but auto-increments to `5174`, `5175`, etc. when the port is already in use.

**Fix:** Add all allowed dev origins, comma-separated:

```env
# server/.env
CLIENT_URLS=http://localhost:5173,http://localhost:5174
```

> You can add as many origins as needed. No spaces around commas.

---

#### 2. Renamed env variable not picked up after `node --watch` hot-reload

**Problem:** `node --watch` only watches `.js` files. When `env.js` changes it restarts,  
but it may not re-read the updated `.env` in time, causing a validation crash.

**Fix:** Do a **full manual restart** of the server after changing `.env`:

```bash
# In the server directory
killall node        # or Ctrl+C in the terminal running the server
npm run dev
```

---

#### 3. Credentials mode mismatch

**Problem:** The frontend sends `withCredentials: true` (for cookies) but the server responds  
with `Access-Control-Allow-Origin: *`. Wildcard `*` is not allowed with credentials.

**Fix:** Always specify exact origins — never use `*` — when `credentials: true`:

```js
// server/src/app.js
app.use(cors({
  origin: env.CLIENT_URLS,   // array of exact origins, not '*'
  credentials: true,
}));
```

```js
// client — Axios instance
axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,       // must match credentials: true on server
});
```

---

#### 4. Preflight (`OPTIONS`) request not handled

**Problem:** For non-simple requests (e.g. `PUT`, `DELETE`, custom headers), the browser  
first sends an `OPTIONS` preflight. If it gets no `204` back, the actual request is blocked.

**Fix:** The `cors()` middleware handles this automatically **only if it is registered before your routes:**

```js
app.use(cors({ ... }));   // ← must come BEFORE
app.use('/api', routes);  // ← your routes
```

---

#### 5. Production deployment

In production, replace local URLs with your real domain:

```env
# server/.env  (production)
CLIENT_URLS=https://relaxstation.np,https://www.relaxstation.np
```

> Never leave `localhost` origins in a production `.env`.

---

### Quick Checklist

| ✅ Check | What to verify |
|---------|---------------|
| `CLIENT_URLS` in `.env` | Contains every origin the frontend runs on |
| Server restarted | Full restart after `.env` changes (not just hot-reload) |
| `credentials: true` | Set on **both** server (`cors()`) and client (`Axios`) |
| `cors()` placement | Registered **before** route middleware in `app.js` |
| Production URLs | Use real `https://` domains, not `localhost` |

---

### How This Project Configures CORS

**`server/.env`**
```env
CLIENT_URLS=http://localhost:5173,http://localhost:5174
```

**`server/src/config/env.js`** — parses comma-separated string into an array:
```js
CLIENT_URLS: z
  .string()
  .min(1)
  .transform((v) => v.split(',').map((u) => u.trim()).filter(Boolean)),
```

**`server/src/app.js`** — passes the array to `cors()`:
```js
app.use(cors({
  origin: env.CLIENT_URLS,
  credentials: true,
}));
```

The `cors` npm package natively accepts a string array and will dynamically reflect the matched origin back in the `Access-Control-Allow-Origin` response header.

---

## License

Private — Relax Station Food and Fun
