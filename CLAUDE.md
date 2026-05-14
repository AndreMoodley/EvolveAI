# CLAUDE.md — EvolveAI · The Void Protocol

A psycho-physical performance OS: a dark-fantasy gamification layer over real training, built around the Void Protocol framework — strike logging, Ki integrity, realm progression, binding vows, an AI coach powered by Claude, and four premium monetization systems (Bloodlines, Domain Expansion, Soul Escrow, Shikigami).

**Stack:** React Native (Expo) · Node/Express · Prisma · PostgreSQL · Anthropic API · Remotion · RevenueCat (IAP) · Stripe (wager settlement)

---

## Monorepo Layout

```
evolveai/                        # React Native / Expo mobile app (root)
├── App.js                       # Auth gate + context providers + navigator
├── screens/                     # One file per screen
├── components/                  # UI primitives + SpiritEntity animated character
├── store/                       # React Context: auth, void state, calendar, theme, character, premium
├── util/                        # API client (util/http.js), auth helpers
├── constants/                   # Realm thresholds, theme tokens, Void Protocol content
├── hooks/                       # useCinematic, useRealmAscensionWatcher
server/                          # Express + Prisma backend
├── src/
│   ├── index.js                 # Entry point — listens on PORT (default 4000)
│   ├── routes/                  # auth, practitioner, vows, progressions, sessions, cinematics, admin, premium
│   ├── middleware/auth.js       # requireAuth, requireAdmin, signToken (JWT HS256)
│   └── seed.js                  # Demo data seeder
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── .env.example
remotion/                        # Video rendering layer (6 cinematic compositions)
├── src/compositions/
├── scripts/render.mjs
└── preview/                     # Vite dev server with live prop editor
```

---

## Running the Project

Three terminals required. Start server first.

### Terminal 1 — Backend

```bash
cd server
cp .env.example .env          # then fill in DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
npm install
npm run db:migrate            # creates tables
npm run db:seed               # loads demo accounts (see Database section)
npm run dev                   # nodemon on http://localhost:4000
```

Verify: `curl http://localhost:4000/health` → `{ "ok": true }`

### Terminal 2 — Mobile App (from repo root)

```bash
npm install
npx expo start
# press `a` for Android emulator, `i` for iOS simulator, scan QR for device
```

### Terminal 3 — Remotion (optional)

```bash
cd remotion
npm install
npm run studio                # visual editor at localhost:3000
# or
npm run preview               # live prop editor at localhost:5174
```

---

## Environment Setup

**`server/.env`** (required before any `npm run` commands work):

```env
DATABASE_URL="postgresql://evolveai:secret@localhost:5432/evolveai"
JWT_SECRET="replace-with-a-long-random-string"
JWT_EXPIRES_IN="7d"
ANTHROPIC_API_KEY="sk-ant-..."
PORT=4000
NODE_ENV=development
```

**PostgreSQL via Docker** (if not installed locally):

```bash
docker run --name evolveai-db \
  -e POSTGRES_USER=evolveai \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=evolveai \
  -p 5432:5432 -d postgres:15
```

**Physical device / real IP override:**

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:4000 npx expo start
```

---

## Database

```bash
cd server
npm run db:migrate     # apply migrations (safe, runs on every deploy)
npm run db:seed        # seed demo accounts (idempotent — safe to re-run)
npm run db:reset       # DESTRUCTIVE — wipe + re-migrate + re-seed
npm run db:studio      # Prisma Studio GUI at localhost:5555
npm run db:generate    # regenerate Prisma client after schema changes
```

### Demo Accounts (after `db:seed`)

All demo accounts use password: **`VoidTest2024!`**

| Email | Name | Realm | hammerCount | ki | streak |
|---|---|---|---|---|---|
| `beginner@evolveai.app` | Kira Void | 1 | 800 | 80 | 3 |
| `mid@evolveai.app` | Ryo Tenshin | 3 | 6,500 | 60 | 14 |
| `advanced@evolveai.app` | Seya Akaishi | 5 | 25,000 | 45 | 87 |
| `master@evolveai.app` | Zero Netero | 7 | 80,000 | 95 | 210 |
| `admin@evolveai.app` | Administrator | — | — | — | — |

Admin password: **`VoidAdmin2024!`** — access Admin Console via profile screen.

Start with `mid@evolveai.app` — best cross-section of all features.

---

## Architecture

### Mobile Auth Flow

`App.js` → `Root` component reads AsyncStorage on mount → calls `authCtx.authenticate()` if valid token found → `Navigation` renders `AuthenticatedStack` (tabs + modals) or `AuthStack` (login/signup) based on `authCtx.isAuthenticated`.

`store/auth-context.js` — holds `authToken`, `authUserId`, `authRole`; exposes `authenticate()`, `logout()`, `isAuthenticated`, `isAdmin`.

`util/http.js` — base API client. URL resolution order:
1. `Constants.expoConfig.extra.apiUrl` (from `app.json`)
2. `process.env.EXPO_PUBLIC_API_URL`
3. Platform default: `http://10.0.2.2:4000` (Android) or `http://localhost:4000` (iOS/web)

### VoidContext (`store/void-context.js`)

Central state machine for all practitioner stats. Key fields:

| Field | Type | Description |
|---|---|---|
| `hammerCount` | Int | Cumulative lifetime strikes — drives realm |
| `todayHammerCount` | Int | Strikes today (resets daily) |
| `ki` | 0–100 | Energy reserve — leaks decrement, seal restores |
| `shadowLevel` | 1–5 | Intensity state — drives SpiritEntity arm spread |
| `streak` | Int | Consecutive days logged |
| `sessions` | Array | Local session log |
| `leaks` | Array | Ki leak events |
| `anchorCompletedAt` | ISO string | Last Temporal Anchor completion |
| `originArtMastery` | 0–100 | Mastery % = hammerCount × 0.001 |

Key actions: `STRIKE(amount)`, `LEAK(cost, leak)`, `SEAL_KI(amount)`, `LOG_DAY(entry)`, `SHADOW(level)`, `COMPLETE_ANCHOR()`, `SYNC_SERVER(payload)`, `RESET()`.

### Server

`server/src/index.js` mounts routes at:
- `/auth` → auth.js
- `/vows` → vows.js
- `/vows/:vowId/progressions` → progressions.js
- `/sessions` → sessions.js
- `/practitioner` → practitioner.js
- `/cinematics` → cinematics.js
- `/admin` → admin.js
- `/premium` → premium.js

All protected routes use `requireAuth` middleware (reads `Authorization: Bearer <token>` header, verifies with `JWT_SECRET`, sets `req.userId`).

Request bodies validated by `zod` schemas inline with each route. Invalid shape → `400 { error: "..." }`.

---

## Domain Concepts

**Realm system** — computed client-side from `hammerCount` using `constants/realms.js`. Never stored in DB.

| Level | Name | hammerCount threshold |
|---|---|---|
| 1 | Foundation Realm | 0 |
| 2 | Ki Accumulation | 1,500 |
| 3 | Ki Establishment | 4,000 |
| 4 | True Ki Awakening | 9,000 |
| 5 | Transcendence (The Void) | 18,000 |
| 6 | Evolutionary Realm | 36,500 |
| 7 | Divine Master | 73,000 |

**Ki** (0–100) — energy integrity metric. Displayed as a bar on the Home screen. Depleted by `KiLeak` events (category: social/food/media/argument/validation/doubt), restored by "Seal Ki" action.

**SpiritEntity** (`components/Character/SpiritEntity.js`) — animated void character built entirely with React Native's `Animated` API. Reflects realm (form/scale), ki (eye colour), shadowLevel (arm spread), streak ≥7 (bonus orbit particle), and aura key (colour signature). No SVG, no external animation library; all transforms run on native thread.

**Sessions** — 6 modalities: `origin`, `pull`, `push`, `core`, `cardio`, `recovery`. Logging a session with `reps > 0` also creates a `StrikeEvent` and increments `hammerCount`.

**Vows** — `major` or `minor`. Each has a `resolutionDate` deadline and ordered `Progression` sub-tasks. A special subtype `heavenly_restriction` carries `wagerAmount` and `wagerStatus` fields for Soul Escrow vows.

**Premium Systems** — Four monetization layers, all implemented server-side for integrity:

- **Bloodlines** — extend `SpiritEntity.js` via a `bloodlineKey` prop that remaps the per-realm `STAGE` config, particle curves, and `AURA_COLORS`. Entitlement tracked via RevenueCat; active lineage stored in `store/premium-context.js`.
- **Domain Packs** — extend `constants/styles.js`'s `getTheme()` with a `domainConfig` key (particle specs, material maps, animation curves, audio bundle). Active domain loaded from `store/premium-context.js` and injected into the theme provider.
- **Soul Escrow** — `heavenly_restriction` vow subtype. Stripe creates a `payment_intent` with `capture_method: manual` on activation; webhook on `resolutionDate` captures (forfeit) or cancels (success). Managed by `server/src/routes/premium.js`.
- **Shikigami / Gacha** — familiar summons are resolved server-side only (`server/src/routes/premium.js`). Client sends `scrollType`, receives result. Pity counter computed from `FamiliarSummon.pullIndex` history — never client-computed.
- **Void Crystals** — premium currency. Earned via daily tasks and milestone events; purchasable via IAP. Drives Ki Multiplier wagers (weekly `WagerEvent` records). Balance held in `store/premium-context.js` + synced server-side.

---

## Prisma Schema (`server/prisma/schema.prisma`)

### Core Models

| Model | Key fields |
|---|---|
| `Practitioner` | id, email, passwordHash, name, role (USER/ADMIN), ki, shadowLevel, hammerCount, streak, lastLogDate, anchorCompletedAt |
| `Vow` | id, practitionerId, title, description, type (major/minor), vowSubtype (heavenly_restriction), startDate, resolutionDate, wagerAmount, wagerStatus |
| `Progression` | id, vowId, text, completed, completedAt, orderIndex |
| `VoidSession` | id, practitionerId, modality, description, reps, rating, note, occurredOn |
| `KiLeak` | id, practitionerId, category, label, cost, occurredAt |
| `StrikeEvent` | id, practitionerId, amount, occurredAt (append-only audit log) |

### Premium Models

| Model | Key fields |
|---|---|
| `Familiar` | id, name, rarity, abilityKey, visualKey |
| `FamiliarSummon` | id, practitionerId, scrollType, pullIndex, familiarId, timestamp |
| `PractitionerFamiliar` | id, practitionerId, familiarId, acquiredAt, isActive |
| `WagerEvent` | id, practitionerId, crystalAmount, weekStart, outcome, settledAt |
| `DomainPack` | id, packKey, name, themeConfig (JSON), audioBundle |
| `PractitionerDomain` | id, practitionerId, domainPackId, unlockedAt, isActive |
| `Bloodline` | id, lineageKey, name, stageConfig (JSON) |
| `PractitionerBloodline` | id, practitionerId, bloodlineId, unlockedAt |

---

## API Surface

All routes are relative to `http://localhost:4000`. No `/api/` prefix.

### Auth
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/signup` | — | `{ email, password }` → `{ token, userId, role }` |
| POST | `/auth/login` | — | Same response shape |
| POST | `/auth/refresh` | bearer | Returns new token |
| GET | `/auth/me` | bearer | Current practitioner (no passwordHash) |

### Practitioner
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/practitioner/me` | bearer | Full profile + stats |
| PATCH | `/practitioner/me` | bearer | Update name, ki, shadowLevel |
| POST | `/practitioner/me/strike` | bearer | `{ amount }` → increments hammerCount |
| POST | `/practitioner/me/anchor` | bearer | Marks anchor complete for today |
| GET | `/practitioner/me/leaks` | bearer | 200 most recent leaks |
| POST | `/practitioner/me/leaks` | bearer | `{ category, label, cost }` → debits ki |
| POST | `/practitioner/me/seal` | bearer | `{ amount? }` → restores ki (default +10, capped at 100) |

### Vows
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/vows` | bearer | Ordered by resolutionDate |
| POST | `/vows` | bearer | `{ title, description, type, startDate, resolutionDate }` |
| GET | `/vows/:id` | bearer | Vow with progressions (ordered by orderIndex) |
| PUT | `/vows/:id` | bearer | Update vow fields |
| DELETE | `/vows/:id` | bearer | Cascades progressions |

### Progressions
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/vows/:vowId/progressions` | bearer | Ordered list |
| POST | `/vows/:vowId/progressions` | bearer | `{ text }` → auto-increments orderIndex |
| PATCH | `/vows/:vowId/progressions/:id` | bearer | Toggle `completed` |
| DELETE | `/vows/:vowId/progressions/:id` | bearer | |

### Sessions
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/sessions` | bearer | 200 most recent, desc |
| POST | `/sessions` | bearer | `{ modality, description, reps, rating, note?, occurredOn? }` — also creates StrikeEvent if reps > 0 |
| DELETE | `/sessions/:id` | bearer | |

### Admin
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/admin/stats` | bearer + admin | Aggregate totals |
| GET | `/admin/practitioners` | bearer + admin | Paginated list |
| GET | `/admin/practitioners/:id` | bearer + admin | Detail |
| PATCH | `/admin/practitioners/:id` | bearer + admin | Edit any field |
| DELETE | `/admin/practitioners/:id` | bearer + admin | Hard delete |

### Cinematics
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/cinematics` | bearer | `{ compositionId, inputProps }` → renders MP4, returns `{ url }` |
| GET | `/cinematics/file/:filename` | bearer | Stream rendered MP4 |
| GET | `/cinematics/compositions` | bearer | List available compositions |

### Premium
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/premium/summon` | bearer | `{ scrollType }` → server-side RNG pull, returns familiar |
| GET | `/premium/inventory` | bearer | Unlocked bloodlines, domains, familiars, crystal balance |
| POST | `/premium/wager` | bearer | `{ crystalAmount, weekTarget }` → opens wager event |
| POST | `/premium/webhook/revenuecat` | — | RevenueCat entitlement events (IAP validation) |
| POST | `/premium/webhook/stripe` | — | Soul Escrow wager settlement (capture or cancel hold) |

---

## Remotion Cinematics (`remotion/`)

6 parameterized compositions in `remotion/src/compositions/`:

| ID | Format | Duration | Trigger |
|---|---|---|---|
| `RealmAscension` | 1920×1080 | 6s | Crossing a realm threshold |
| `StrikeBurst` | 1080×1080 | 2.5s | Strike count celebration |
| `DailyRecap` | 1080×1920 | 7s | End-of-day Stories format |
| `VowDeclaration` | 1080×1920 | 7s | Binding vow ceremony |
| `VoidEntityShowcase` | 1080×1080 | 10s | Entity hero loop |
| `StreakMilestone` | 1080×1080 | 4s | 7/30/100/365-day streak |

**In-app integration:**
- `hooks/useRealmAscensionWatcher.js` — auto-triggers `RealmAscension` when `hammerCount` crosses a threshold; wired in `screens/Home.js`
- `hooks/useCinematic.js` — generic hook for any composition
- `components/Cinematic/CinematicShareButton.js` — share via native share sheet

**CLI render:**
```bash
cd remotion
npm run render -- StrikeBurst '{"reps":312,"modality":"origin","rating":10,"auraKey":"crimson"}'
```

---

## Key Files

| File | Purpose |
|---|---|
| [App.js](App.js) | Root navigator, auth gate, all context providers |
| [store/auth-context.js](store/auth-context.js) | JWT state, authenticate(), logout() |
| [store/void-context.js](store/void-context.js) | All practitioner stats + reducer actions |
| [util/http.js](util/http.js) | Axios client, platform-aware API URL, all endpoint helpers |
| [util/auth.js](util/auth.js) | login(), createUser(), refreshToken() |
| [constants/realms.js](constants/realms.js) | Realm threshold breakpoints |
| [constants/styles.js](constants/styles.js) | Theme tokens (Tokens, getTheme) |
| [components/Character/SpiritEntity.js](components/Character/SpiritEntity.js) | Animated void entity |
| [server/src/index.js](server/src/index.js) | Express entry, route mounts |
| [server/src/middleware/auth.js](server/src/middleware/auth.js) | requireAuth, requireAdmin, signToken |
| [server/src/seed.js](server/src/seed.js) | Demo data seeder (4 practitioners + vows/sessions/leaks) |
| [server/prisma/schema.prisma](server/prisma/schema.prisma) | Database schema |
| [remotion/src/Root.jsx](remotion/src/Root.jsx) | Composition registry |
| [store/premium-context.js](store/premium-context.js) | activeBloodline, activeDomain, activeFamiliar, unlockedArtifacts, voidCrystalBalance |
| [server/src/routes/premium.js](server/src/routes/premium.js) | Gacha RNG, wager logic, RevenueCat + Stripe webhook handlers |

---

## Gotchas

**Android emulator → use 10.0.2.2, not localhost**
`localhost` inside the Android Emulator refers to the emulator itself. The host machine is `10.0.2.2`. `util/http.js` handles this automatically (Platform.OS check). Do NOT hardcode `localhost` in `app.json`'s `extra.apiUrl` — it would override the platform-aware default.

**JWT_SECRET must be set before server starts**
`signToken` and `requireAuth` both read `process.env.JWT_SECRET`. If it's missing, all auth calls throw → 500s → login fails silently.

**Realm is never stored in the DB**
Only `hammerCount` persists. Realm is always computed from `constants/realms.js` thresholds. Do not add a `realm` column.

**Double initialization of auth state**
Both `store/auth-context.js` (useEffect) and `App.js > Root` (useEffect) independently read AsyncStorage on mount. They are somewhat redundant. If touching auth startup logic, be aware both run concurrently. Root's version takes precedence for the splash screen gate (`isTryingLogin` state).

**Token expiry vs logout**
Tokens default to `7d`. Root's useEffect schedules `setTimeout(authCtx.logout, remaining)` for tokens that are still valid. If the JWT_SECRET changes, existing tokens become invalid — user must log out and back in.

**Sessions with reps=0 do NOT create StrikeEvents**
Only `reps > 0` triggers a StrikeEvent and increments `hammerCount`. Recovery sessions (`modality: "recovery"`) typically have `reps: 0`.

**Gacha RNG must be server-side only**
Never move the familiar pull RNG to the client. The pity counter is computed from `FamiliarSummon.pullIndex` history server-side. The client sends `scrollType`, receives the result — no randomness on device.

**Soul Escrow wagers are Stripe payment holds, not charges**
On Heavenly Restriction activation, Stripe creates a `payment_intent` with `capture_method: manual`. The webhook on `resolutionDate` either captures the hold (forfeit on failure) or cancels it (refund on success). Do not use immediate charges.
