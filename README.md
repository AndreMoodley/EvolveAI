# EvolveAI · The Void Protocol

A psycho-physical operating system for unrestricted human progression. Mobile client (React Native / Expo) plus a local Node + Prisma + Postgres backend.

## Repo layout

```
.
├── App.js, screens/, components/, store/, util/, constants/, assets/
│   └── React Native / Expo mobile client
└── server/
    └── Node + Express + Prisma + Postgres backend (see server/README.md)
```

## Quick start (full stack)

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run db:migrate
npm run dev          # listens on http://localhost:4000
```

See [`server/README.md`](server/README.md) for Postgres setup options (local install or Docker).

### 2. Mobile client

```bash
# from repo root
npm install
npx expo start
```

The mobile app reads `extra.apiUrl` from `app.json` (defaults to `http://localhost:4000`). For a physical device on the same Wi-Fi, change it to your machine's LAN IP, e.g.:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:4000 npx expo start
```

## The Void Protocol

The app is structured around eight phases:

| # | Phase | Surface |
|---|---|---|
| I | Temporal Anchor | Daily ritual on the Today tab |
| II | Egoless Void | Shadow integration, walls philosophy |
| III | Silence & Ki | Ki integrity bar + leak audit |
| IV | Curse of the Half-Awakened | 1% daily rule on the Ledger |
| V | Seven Realms | Ladder from Foundation to Divine Master |
| VI | 10,000 One-Punch | Neural hammering counter inside vows |
| VII | The Origin Art | Andre's Muscle-Up Technique reference |
| VIII | Blessing of the Strongest | Practitioner profile |

## Information architecture (6 tabs)

- **Today** — Anchor card, daily strikes, Ki integrity, shadow integrator, realm progress, 3-second protocol
- **Realms** — Seven-realm ladder with detail screens
- **Vows** — Major / Minor binding vows with neural hammer counter
- **Ledger** — Calendar with 1% rule, sessions, leaks, vow resolutions
- **Codex** — Phases / Origin Art kinematic rules / Support protocols
- **Self** — Practitioner stats, theme, danger zone

## Architecture notes

- **Auth:** JWT bearer tokens (HS256). Tokens stored in `AsyncStorage`, auto-refreshed when ≤1m to expiry.
- **Persistence model:** Mobile reduces locally first, then syncs to the backend (write-through). Local AsyncStorage acts as offline cache; on auth, the backend is the source of truth and overwrites stats (hammerCount, ki, shadowLevel, leaks).
- **Validation:** All API requests validated by `zod` schemas server-side.
- **Realms:** Computed client-side from cumulative `hammerCount` (see `constants/realms.js`).
