# EvolveAI Server

Local-first Node + Express + Prisma + Postgres backend for the EvolveAI mobile app (The Void Protocol).

## Stack

- **Express 4** — HTTP routing
- **Prisma 5** — ORM + migrations
- **Postgres 16** — relational store
- **JWT (HS256)** — bearer-token auth, 7-day default lifetime
- **bcryptjs** — password hashing
- **zod** — request validation

## Local Setup

### 1. Postgres

Either install Postgres locally or run via Docker:

```bash
# macOS (Homebrew)
brew install postgresql@16 && brew services start postgresql@16

# Ubuntu/Debian
sudo apt install postgresql-16 && sudo systemctl start postgresql

# Docker (any host)
docker run --name evolveai-pg -e POSTGRES_USER=evolveai \
  -e POSTGRES_PASSWORD=evolveai_dev -e POSTGRES_DB=evolveai \
  -p 5432:5432 -d postgres:16
```

If you installed locally, create the role + database:

```bash
sudo -u postgres psql <<SQL
CREATE ROLE evolveai WITH LOGIN CREATEDB PASSWORD 'evolveai_dev';
CREATE DATABASE evolveai OWNER evolveai;
GRANT ALL PRIVILEGES ON DATABASE evolveai TO evolveai;
SQL
```

> The `CREATEDB` privilege is required for Prisma's shadow database during `migrate dev`.

### 2. Install dependencies

```bash
cd server
npm install
```

### 3. Configure env

```bash
cp .env.example .env
# edit .env if your Postgres URL or JWT secret differs
```

### 4. Run migrations

```bash
npm run db:migrate    # runs `prisma migrate dev`
```

### 5. Boot the server

```bash
npm run dev           # node --watch, restarts on change
# or
npm start
```

The server listens on `http://localhost:4000`. Hit `/health` to confirm.

## Connecting the mobile app

The mobile client reads `extra.apiUrl` from `app.json` (already set to `http://localhost:4000`). For a real device on the same Wi-Fi, change it to your machine's LAN IP (e.g. `http://192.168.1.50:4000`).

Or override at runtime via env:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:4000 npx expo start
```

## API surface

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | — | Create practitioner |
| POST | `/auth/login` | — | Exchange credentials for token |
| POST | `/auth/refresh` | bearer | Reissue token |
| GET | `/auth/me` | bearer | Current practitioner |
| GET | `/practitioner/me` | bearer | Profile + stats |
| PATCH | `/practitioner/me` | bearer | Update name / ki / shadowLevel |
| POST | `/practitioner/me/strike` | bearer | Record strike(s); increments hammerCount |
| POST | `/practitioner/me/anchor` | bearer | Mark Temporal Anchor as completed today |
| GET | `/practitioner/me/leaks` | bearer | Recent ki leaks |
| POST | `/practitioner/me/leaks` | bearer | Record a leak; debits ki |
| POST | `/practitioner/me/seal` | bearer | Seal ki (additive, capped at 100) |
| GET | `/vows` | bearer | List vows |
| POST | `/vows` | bearer | Inscribe vow |
| GET | `/vows/:id` | bearer | Vow with progressions |
| PUT | `/vows/:id` | bearer | Update vow |
| DELETE | `/vows/:id` | bearer | Delete vow |
| GET | `/vows/:vowId/progressions` | bearer | Progression list |
| POST | `/vows/:vowId/progressions` | bearer | Add progression |
| PUT | `/vows/:vowId/progressions/:id` | bearer | Toggle complete / edit |
| DELETE | `/vows/:vowId/progressions/:id` | bearer | Remove progression |
| GET | `/sessions` | bearer | Recent void sessions |
| POST | `/sessions` | bearer | Log session (also strikes if reps > 0) |
| DELETE | `/sessions/:id` | bearer | Delete session |

## Schema (Prisma)

See `prisma/schema.prisma`. Core models:

- **Practitioner** — user + cumulative stats (ki, hammerCount, streak, shadowLevel, anchorCompletedAt)
- **Vow** — major/minor binding contract with resolution date
- **Progression** — milestone within a vow
- **VoidSession** — training log entry (modality, reps, rating, note)
- **KiLeak** — distraction event with cost
- **StrikeEvent** — append-only audit log of strikes

## Useful commands

```bash
npm run db:migrate    # create + apply a new migration
npm run db:reset      # nuke and re-seed (destructive)
npm run db:studio     # open Prisma Studio (GUI at localhost:5555)
npm run db:generate   # regenerate Prisma client without migrating
```

## Security notes

The default `JWT_SECRET` in `.env` is a placeholder. **Replace it before exposing the server to anything beyond localhost.** The app does not currently rate-limit or implement refresh-token rotation — those are intentional simplifications for the local development target.
