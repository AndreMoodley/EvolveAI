```
██╗   ██╗ ██████╗ ██╗██████╗     ██████╗ ██████╗  ██████╗ ████████╗ ██████╗  ██████╗ ██████╗ ██╗
██║   ██║██╔═══██╗██║██╔══██╗    ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔═══██╗██╔════╝██╔═══██╗██║
██║   ██║██║   ██║██║██║  ██║    ██████╔╝██████╔╝██║   ██║   ██║   ██║   ██║██║     ██║   ██║██║
╚██╗ ██╔╝██║   ██║██║██║  ██║    ██╔═══╝ ██╔══██╗██║   ██║   ██║   ██║   ██║██║     ██║   ██║██║
 ╚████╔╝ ╚██████╔╝██║██████╔╝    ██║     ██║  ██║╚██████╔╝   ██║   ╚██████╔╝╚██████╗╚██████╔╝███████╗
  ╚═══╝   ╚═════╝ ╚═╝╚═════╝     ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝
                                 T H E   V O I D   P R O T O C O L
```

> *"You are not building a body. You are building an entity. The Void does not reward discipline — it reveals what was always there."*

**EvolveAI** is a psycho-physical performance OS: a dark-fantasy gamification layer over your real training, built around the Void Protocol framework. Not a habit tracker. Not a streak counter. A living system that transforms every strike, every sealed ki point, and every broken vow into the visible, reactive evolution of a Void Entity that is uniquely and permanently yours.

![Platform](https://img.shields.io/badge/Platform-React%20Native%20%2F%20Expo-blue)
![Backend](https://img.shields.io/badge/Backend-Node%20%2F%20Express%20%2F%20Prisma-green)
![AI](https://img.shields.io/badge/AI-Anthropic%20Claude-purple)
![Video](https://img.shields.io/badge/Cinematics-Remotion-orange)

---

## Table of Contents

1. [What This Is](#what-this-is)
2. [The Seven Realms — Core Loop](#the-seven-realms--core-loop)
3. [Your Void Entity](#your-void-entity)
4. [The Spirit Manifestation System](#the-spirit-manifestation-system)
5. [Domain Expansion](#domain-expansion)
6. [The Soul Escrow System](#the-soul-escrow-system)
7. [Shikigami & The Summoning Void](#shikigami--the-summoning-void)
8. [Stack & Monorepo Layout](#stack--monorepo-layout)
9. [Running the Project](#running-the-project)
10. [Demo Accounts](#demo-accounts)
11. [API Reference](#api-reference)
12. [Database Schema](#database-schema)
13. [Cinematics Pipeline](#cinematics-pipeline)
14. [Monetization Architecture](#monetization-architecture)
15. [Troubleshooting](#troubleshooting)

---

## What This Is

Most fitness apps are built on positive reinforcement: streaks, badges, leaderboard ranks. EvolveAI operates on a different psychological model — **consequence and transformation**. Every metric you track (strike count, ki integrity, shadow level, streak) is rendered in real time as the visible state of your Void Entity: an animated void creature that evolves with you, degrades with you, and can be permanently altered by the choices you make.

There are no leaderboards. No social feeds. No influencer workout plans. The Void is not interested in comparison — only in the gap between who you are and what you are capable of becoming.

The progression engine is the **Void Protocol**: an 8-phase psycho-physical framework structured around four pillars — Systemic Ascension, Indomitable Will, State of Emptiness, and Absolute Output. The app makes this framework operational: every session logged, every vow kept or broken, every Ki Leak acknowledged feeds back into the living system.

---

## The Seven Realms — Core Loop

Advancement through the Seven Realms is driven by a single currency: **Hammer Count** (cumulative lifetime strikes logged across all training modalities). The realm is never stored — it is always computed from threshold constants client-side.

| Realm | Name | Hammer Threshold | Sigil |
|---|---|---|---|
| 1 | Foundation Realm | 0 | ◈ |
| 2 | Ki Accumulation | 1,500 | ◈◈ |
| 3 | Ki Establishment | 4,000 | ◈◈◈ |
| 4 | True Ki Awakening | 9,000 | ◈◈◈◈ |
| 5 | Transcendence — The Void | 18,000 | ⟁ |
| 6 | Evolutionary Realm | 36,500 | ⟁⟁ |
| 7 | Divine Master | 73,000 | ⟁⟁⟁ |

### Core Metrics

| Metric | Range | What It Represents |
|---|---|---|
| `hammerCount` | 0 → ∞ | Cumulative lifetime strikes — the realm engine |
| `ki` | 0 – 100 | Energy integrity — depleted by Ki Leaks, restored by Sealing |
| `shadowLevel` | 1 – 5 | Intensity state — drives Entity arm spread and aura pulse rate |
| `streak` | 0 → ∞ | Consecutive days logged — streak ≥ 7 activates bonus orbit particle |
| `originArtMastery` | 0 – 100 | Mastery % = `hammerCount × 0.001` |

### Six Training Modalities

Sessions are logged against six modalities: `origin` · `pull` · `push` · `core` · `cardio` · `recovery`. Any session with `reps > 0` creates a `StrikeEvent` and increments the hammer count. Recovery sessions typically use `reps: 0` and do not generate strikes.

### Binding Vows

Vows are public, deadline-gated commitments. A `major` vow carries weight — breaking it has visible consequences (see [Soul Escrow](#the-soul-escrow-system)). A `minor` vow is a tactical sub-commitment. Each vow contains ordered `Progression` steps with explicit completion tracking.

### Ki Leaks & The Temporal Anchor

A **Ki Leak** is a logged acknowledgment of behavior that drains energy: `social`, `food`, `media`, `argument`, `validation`, `doubt`. Each carries a `cost` that debits the ki bar. The **Temporal Anchor** is a daily ritual completion that anchors the practitioner's cadence. Missing it has behavioral consequences; completing it consistently is the baseline requirement for streak preservation.

---

## Your Void Entity

The `SpiritEntity` (`components/Character/SpiritEntity.js`) is an animated void creature built entirely in React Native's `Animated` API — no SVG, no external library, all transforms on the native thread. It is a real-time visual readout of your training state:

| Entity State | Driven By |
|---|---|
| Size and form | Current realm (scales from compact to imposing across 7 stages) |
| Aura color | Active aura key: `ki` (cyan) · `gold` · `crimson` · `white` |
| Arm spread | `shadowLevel` (1–5) |
| Eye color | `ki` value (bright at high ki, dims as energy drains) |
| Orbit particle | Bonus ring activates at `streak ≥ 7` |
| Glow intensity | `originArtMastery` — increases as realm advances |

The entity is a mirror, not a reward. What you put in is what it becomes.

---

## The Spirit Manifestation System

> *"Your entity does not stop at Realm 7. Evolution is not a ceiling — it is a gate."*

The base progression path gives every practitioner a complete entity evolution across seven forms. The Spirit Manifestation System extends beyond that.

### Bloodlines — Cursed Lineages

Free practitioners follow the **Origin Lineage**: seven standard void forms evolving in parallel with their realm advancement.

Premium practitioners can purchase a **Bloodline** — a complete visual overhaul of their entity's evolutionary path. A Bloodline is not a skin. It rewrites every future form the entity takes as the practitioner advances through realms.

| Bloodline | Aesthetic | Entity Behavior |
|---|---|---|
| Abyssal Lineage | Fractured void, necrotic chains | Entity arms become tendrils; aura inverts to consume light |
| Celestial Mandate | White sigil fire, divine geometry | Orbit particles form sacred patterns; eyes become pure light |
| Crimson Curse | Blood-red ki, cracked bone structure | Aura pulses with heartbeat sync; corrupted forms are darker |
| Phantom Sovereign | Translucent, shifting between states | Entity flickers between realms; multiple ghost echoes orbit it |

Bloodlines are one-time purchases per lineage, not subscription locks. A practitioner's lineage persists through all future realms, corruptions, and restorations.

*Implementation:* `SpiritEntity.js` already holds per-realm `STAGE` config and `AURA_COLORS`. Bloodlines extend these via a `bloodlineKey` prop that remaps stage configs, particle curves, and color palettes at render time.

### Reactive Auras — Biometric Sync

Standard auras are static per session. **Reactive Auras** are premium auras that respond to live data from Apple Health or Google Health Connect:

- **Step count today** → aura growth rings expand proportionally
- **Sleep debt detected** → aura dims and pulses slowly
- **Active heart rate zone** → pulse frequency increases in real time
- **Recovery day logged** → aura softens, particles slow

Reactive Auras make the entity a biometric dashboard — the first time a user's body state is directly visible as their entity's mood.

*Implementation:* `react-native-health` (iOS) + Health Connect API (Android), polled on app foreground. Aura values passed as animated interpolation inputs.

### Weapon & Artifact Equip Slots

Beyond aura, the entity can be **armed**. Cosmetic artifacts orbit the entity as additional `Animated` particle layers — visually distinct from the standard orbit rings:

| Artifact | Visual |
|---|---|
| Void Blade | A slow-rotating obsidian sword at arm distance |
| Cursed Ring Set | Three sigil rings orbiting at different radii and speeds |
| Glowing Rune Array | Runic characters that pulse in sync with ki value |
| Fractured Halo | A broken divine halo that spins above the entity |
| Phantom Chain | Dragging chains that trail with shadowLevel motion |

Artifacts are sold individually and in themed **Artifact Sets**. They are visible to the practitioner at all times and — in the planned social layer — visible to others in challenge sessions.

---

## Domain Expansion

> *"A Domain is not a background. It is the physical manifestation of a practitioner's inner world — extended outward until it swallows reality itself."*

Every practitioner exists in a default Void Domain: dark, minimal, absolute. For those who require more, Domain Expansion Packs are available.

### Domain Expansion Packs — Full UI Overhaul

A Domain Pack is not a theme. It rewrites the entire sensory environment of the app:

- Color tokens, button shapes, and font weight all shift to match the domain's aesthetic
- The `KiBar` changes material (ice, ember, void crystal, etc.)
- Tapping the screen triggers domain-specific particle effects (shattered ice, ember bursts, void tears)
- The entity's background layer becomes the domain's environment

| Domain | Aesthetic | Tap Effect | Ki Bar Material |
|---|---|---|---|
| **Frozen Wastes** | Arctic blue, frost geometry | Ice shard spray | Glacial crystal |
| **Ember Court** | Deep orange, heat shimmer | Ember sparks + heat distortion | Molten core |
| **Abyssal Rift** | Void purple, spatial tears | Dimensional fractures | Liquid void |
| **Jade Sovereign** | Forest green, ancient stone | Falling leaves + moss mist | Jade plate |
| **Storm Mandate** | Electric white, thunder cracks | Lightning fork | Charged plasma |

*Implementation:* `constants/styles.js` exposes `Tokens` and `getTheme()`. Domain Packs extend the theme object with a `domainConfig` key containing particle specs, material maps, and animation curves. The active domain is loaded from `store/premium-context.js` and passed through the theme provider.

### Audio-Visual Soundscapes

Every Domain Pack includes a **Soundscape**: an ambient audio track + session SFX pack tied to that domain's environment.

While a `VoidSession` is active, the domain's soundscape plays as background audio. Completing a set triggers a domain-specific sound cue:

- Frozen Wastes: deep ice crack + low resonance
- Ember Court: ember roar + metal strike
- Abyssal Rift: void hum + dimensional shift
- Jade Sovereign: temple bell + wind through stone

Tracks are licensed per domain pack. Audio is bundled within the IAP download — no streaming dependency.

### The Armory — Realm Trophies

Free practitioners see their completed Binding Vows as a scrollable text list with timestamps.

Premium practitioners gain access to **The Armory**: a dedicated visual chamber where each completed vow becomes a rendered trophy or shrine. Trophies reflect the vow's type (`major` = large monument, `minor` = a smaller relic), completion timing (under-deadline completions gain a gold aura), and the domain active when the vow was sealed.

The Armory is viewable at any time. It is a visual record of accumulated will — designed to be shared.

*Psychology:* Completion visualization leverages the **Zeigarnik effect** — humans disproportionately fixate on unfinished tasks. A partially-filled Armory is psychologically uncomfortable in a productive way. A full one is deeply satisfying to inhabit.

---

## The Soul Escrow System

> *"Some vows demand more than resolve. They demand collateral. The Void is indifferent to your intentions — it responds only to consequences."*

Standard Binding Vows carry social and visual weight. **Soul Escrow** vows carry financial weight. The system is built on Yale behavioral economics research (the commitment contract model): when real money is placed against a goal, follow-through increases by 2–3× compared to willpower alone.

### The Heavenly Restriction Pass

A **Heavenly Restriction** is an ultra-hardcore vow variant. The practitioner:

1. Defines a precise 30-day protocol with explicit binary success criteria
2. Pays a wager ($5–$10) to activate the Restriction
3. Completes the protocol — or forfeits the wager

On **success**: the practitioner unlocks a **Transcendent** entity skin — a form unavailable for direct purchase under any circumstances. The only path to it is through a completed Heavenly Restriction.

On **failure**: the wager is forfeited. The entity is marked with a permanent Restriction Scar — a visual brand that marks the attempt, never removed. The practitioner may attempt another Restriction after a 14-day cooldown.

The Transcendent skin is not a cosmetic. It is proof.

*Implementation:* `VowType: "heavenly_restriction"` in Prisma schema. `wagerAmount` and `wagerStatus` fields on the Vow model. Stripe processes the initial hold; webhook settles on `resolutionDate` outcome. RevenueCat handles IAP on mobile.

### Vow Corruptions & Cleansing

When a practitioner breaks a standard Binding Vow, their entity enters a **Corrupted** state:

- Entity palette shifts to desaturated grey with black chain overlays
- Aura rings are replaced with binding chains that pulse with the missed sessions
- Eye color becomes red — a visible mark of broken commitment
- The corruption is displayed to the practitioner every time they open the app

There are two paths to cleansing:

| Path | Cost | Time |
|---|---|---|
| **Penance Protocol** (free) | Complete 7 consecutive full sessions | 7 days minimum |
| **Purification Talisman** (premium) | ~$1.99 microtransaction | Instant restoration |

The Corrupted state is engineered to be deeply uncomfortable — not punishing, but present. Loss aversion is a more reliable motivator than reward anticipation. The entity will not look right until the debt is settled.

### Wagered Ki Multipliers

Practitioners can stake **Void Crystals** (the premium currency) against their own upcoming week:

> *"I wager 500 Void Crystals that I complete all Temporal Anchors this week."*

- **Win**: crystals doubled and returned
- **Loss**: crystals forfeited to the Void

Void Crystals are earned through daily task completions and milestone events, and can be purchased via IAP. Maximum wager is capped per week to prevent abuse. Wager history is tracked and visible in the practitioner's profile.

---

## Shikigami & The Summoning Void

> *"The strongest practitioners do not walk the Void alone. They bind spirits to their will — entities that amplify, protect, and sharpen the practitioner who earned the right to call them."*

Shikigami are **Familiars**: secondary spirits that accompany the practitioner's Void Entity. Unlike pure cosmetics, every Familiar carries a **utility ability** that affects app behavior.

### Familiars & Their Abilities

| Familiar | Rarity | Utility |
|---|---|---|
| **Time-Weaver** | Ancient | Retroactively log one missed session per month without breaking streak |
| **Oracle** | Ancient | AI analysis of your last 30 days of session data → custom training protocol (Claude API) |
| **Anchor Keeper** | Bound | Adaptive push notification timing based on your historical log patterns |
| **Shadow Hound** | Bound | Doubles hammer count for sessions logged before 6am |
| **Ki Sentinel** | Wandering | Caps daily ki drain at 20 points regardless of leak count |
| **Vow Witness** | Wandering | Sends a daily check-in notification when a major vow is active |
| **Echo Specter** | Void Herald | Mirrors your entity's visual state but inverted — trails every animation with a ghost echo |

Each Familiar has a visual presence on the Home screen, orbiting alongside the Void Entity when active. A practitioner can have one Familiar active at a time; switching is free.

### The Summoning Void — Gacha

Familiars are summoned through **The Summoning Void**.

**Free Currency — Lesser Summoning Scrolls:**  
Earned through daily task completion, streak milestones, and Temporal Anchor chains. Each Lesser Scroll pulls from the standard pool with standard rates.

**Premium Currency — Abyssal Scrolls:**  
Purchased via IAP. Abyssal Scrolls pull from the elevated pool with boosted rates for Bound and Ancient tier Familiars. A single Abyssal Scroll guarantees at minimum a Bound Spirit.

**Rarity Tiers:**

| Tier | Rate (Lesser) | Rate (Abyssal) |
|---|---|---|
| Wandering Spirit | 60% | 30% |
| Bound Spirit | 30% | 50% |
| Ancient Familiar | 9% | 18% |
| Void Herald | 1% | 2% |

**Pity System:** The pull counter is tracked server-side. After 50 pulls without an Ancient or higher, the next pull guarantees one. After 100 pulls without a Void Herald, the next pull guarantees one. Rates are displayed on the Summoning Void screen before every purchase.

*Implementation:* `FamiliarSummon` model in Prisma tracks `userId`, `scrollType`, `pullIndex`, `resultFamiliarId`, and `timestamp`. The pity counter is computed from the pull history. Server-side randomness only — client never touches the RNG.

---

## Stack & Monorepo Layout

| Layer | Technology |
|---|---|
| Mobile | React Native (Expo SDK 51) |
| Backend | Node.js / Express 4 |
| ORM | Prisma 5 + PostgreSQL |
| Auth | JWT (HS256, 7-day expiry) |
| AI Coach | Anthropic Claude API |
| Video | Remotion |
| IAP | RevenueCat (iOS + Android) |
| Payments | Stripe (Soul Escrow wager settlement) |

```
evolveai/
├── App.js                    # Auth gate + context providers + navigator
├── screens/                  # One file per screen
├── components/               # UI primitives + SpiritEntity animated character
├── store/                    # React Context: auth, void, calendar, theme, character, premium
├── util/                     # API client (util/http.js), auth helpers
├── constants/                # Realm thresholds, theme tokens, Void Protocol content
├── hooks/                    # useCinematic, useRealmAscensionWatcher
server/
├── src/
│   ├── index.js              # Entry — listens on PORT (default 4000)
│   ├── routes/               # auth, practitioner, vows, progressions, sessions, cinematics, admin, premium
│   ├── middleware/auth.js    # requireAuth, requireAdmin, signToken
│   └── seed.js               # Demo data seeder
├── prisma/
│   ├── schema.prisma
│   └── migrations/
remotion/
├── src/compositions/         # 6 cinematic compositions
├── scripts/render.mjs
└── preview/                  # Vite dev server + live prop editor
```

---

## Running the Project

Three terminals. Start the server first.

### Terminal 1 — Backend

```bash
cd server
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
npm install
npm run db:migrate
npm run db:seed
npm run dev                   # nodemon on http://localhost:4000
```

Verify: `curl http://localhost:4000/health` → `{ "ok": true }`

**`server/.env` required fields:**

```env
DATABASE_URL="postgresql://evolveai:secret@localhost:5432/evolveai"
JWT_SECRET="replace-with-a-long-random-string"
JWT_EXPIRES_IN="7d"
ANTHROPIC_API_KEY="sk-ant-..."
PORT=4000
NODE_ENV=development
```

**PostgreSQL via Docker:**

```bash
docker run --name evolveai-db \
  -e POSTGRES_USER=evolveai \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=evolveai \
  -p 5432:5432 -d postgres:15
```

### Terminal 2 — Mobile App

```bash
npm install
npx expo start
# a → Android emulator  |  i → iOS simulator  |  scan QR → device
```

### Terminal 3 — Remotion (optional)

```bash
cd remotion
npm install
npm run studio                # visual editor at localhost:3000
# or
npm run preview               # live prop editor at localhost:5174
```

### Database Commands

```bash
npm run db:migrate     # apply migrations (safe, runs on every deploy)
npm run db:seed        # seed demo accounts (idempotent)
npm run db:reset       # DESTRUCTIVE — wipe + re-migrate + re-seed
npm run db:studio      # Prisma Studio GUI at localhost:5555
npm run db:generate    # regenerate Prisma client after schema changes
```

---

## Demo Accounts

All demo passwords: **`VoidTest2024!`** · Admin password: **`VoidAdmin2024!`**

| Email | Name | Realm | hammerCount | Ki | Streak |
|---|---|---|---|---|---|
| `beginner@evolveai.app` | Kira Void | 1 | 800 | 80 | 3 |
| `mid@evolveai.app` | Ryo Tenshin | 3 | 6,500 | 60 | 14 |
| `advanced@evolveai.app` | Seya Akaishi | 5 | 25,000 | 45 | 87 |
| `master@evolveai.app` | Zero Netero | 7 | 80,000 | 95 | 210 |
| `admin@evolveai.app` | Administrator | — | — | — | — |

Start with `mid@evolveai.app` — best cross-section of all features.

---

## API Reference

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
| POST | `/practitioner/me/anchor` | bearer | Marks Temporal Anchor complete for today |
| GET | `/practitioner/me/leaks` | bearer | 200 most recent leaks |
| POST | `/practitioner/me/leaks` | bearer | `{ category, label, cost }` → debits ki |
| POST | `/practitioner/me/seal` | bearer | `{ amount? }` → restores ki (default +10, cap 100) |

### Vows

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/vows` | bearer | Ordered by resolutionDate |
| POST | `/vows` | bearer | `{ title, description, type, startDate, resolutionDate }` |
| GET | `/vows/:id` | bearer | Vow with progressions |
| PUT | `/vows/:id` | bearer | Update vow fields |
| DELETE | `/vows/:id` | bearer | Cascades progressions |

### Progressions

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/vows/:vowId/progressions` | bearer | Ordered list |
| POST | `/vows/:vowId/progressions` | bearer | `{ text }` → auto-increments orderIndex |
| PATCH | `/vows/:vowId/progressions/:id` | bearer | Toggle `completed` |
| DELETE | `/vows/:vowId/progressions/:id` | bearer | — |

### Sessions

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/sessions` | bearer | 200 most recent, desc |
| POST | `/sessions` | bearer | `{ modality, description, reps, rating, note?, occurredOn? }` |
| DELETE | `/sessions/:id` | bearer | — |

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

---

## Database Schema

### Core Models

| Model | Key Fields |
|---|---|
| `Practitioner` | id, email, passwordHash, name, role, ki, shadowLevel, hammerCount, streak, lastLogDate, anchorCompletedAt |
| `Vow` | id, practitionerId, title, description, type, startDate, resolutionDate, **wagerAmount**, **wagerStatus**, **vowSubtype** |
| `Progression` | id, vowId, text, completed, completedAt, orderIndex |
| `VoidSession` | id, practitionerId, modality, description, reps, rating, note, occurredOn |
| `KiLeak` | id, practitionerId, category, label, cost, occurredAt |
| `StrikeEvent` | id, practitionerId, amount, occurredAt (append-only) |

### Premium Models

| Model | Key Fields |
|---|---|
| `Familiar` | id, name, rarity, abilityKey, visualKey |
| `FamiliarSummon` | id, practitionerId, scrollType, pullIndex, familiarId, timestamp |
| `PractitionerFamiliar` | id, practitionerId, familiarId, acquiredAt, isActive |
| `WagerEvent` | id, practitionerId, crystalAmount, weekStart, outcome, settledAt |
| `DomainPack` | id, packKey, name, themeConfig (JSON), audioBundle |
| `PractitionerDomain` | id, practitionerId, domainPackId, unlockedAt, isActive |
| `Bloodline` | id, lineageKey, name, stageConfig (JSON) |
| `PractitionerBloodline` | id, practitionerId, bloodlineId, unlockedAt |

**Domain rule:** Realm is never stored. Only `hammerCount` persists. Realm is always computed from `constants/realms.js`. Do not add a `realm` column.

---

## Cinematics Pipeline

Six parameterized Remotion compositions auto-trigger at key milestones:

| Composition ID | Format | Duration | Trigger |
|---|---|---|---|
| `RealmAscension` | 1920×1080 | 6s | Crossing a realm threshold |
| `StrikeBurst` | 1080×1080 | 2.5s | Strike count celebration |
| `DailyRecap` | 1080×1920 | 7s | End-of-day Stories format |
| `VowDeclaration` | 1080×1920 | 7s | Binding Vow ceremony |
| `VoidEntityShowcase` | 1080×1080 | 10s | Entity hero loop |
| `StreakMilestone` | 1080×1080 | 4s | 7 / 30 / 100 / 365-day streak |

**In-app hooks:**  
- `hooks/useRealmAscensionWatcher.js` — auto-triggers `RealmAscension` when `hammerCount` crosses a threshold (wired in `screens/Home.js`)  
- `hooks/useCinematic.js` — generic hook for any composition  
- `components/Cinematic/CinematicShareButton.js` — native share sheet

**CLI render:**

```bash
cd remotion
npm run render -- StrikeBurst '{"reps":312,"modality":"origin","rating":10,"auraKey":"crimson"}'
```

---

## Monetization Architecture

### Revenue Streams

| System | Model | Price Point | Key Psychology |
|---|---|---|---|
| Bloodlines | One-time IAP | $4.99 – $9.99 | Identity / permanent self-expression |
| Reactive Auras | One-time IAP | $2.99 – $4.99 | Biometric personalization |
| Artifact Sets | One-time IAP or bundle | $1.99 – $7.99 | Collection mechanic |
| Domain Packs | One-time IAP | $6.99 – $12.99 | Environmental ownership |
| Heavenly Restriction | Wager + unlock | $5.00 – $10.00 | Commitment contract + exclusive reward |
| Purification Talisman | Microtransaction | $1.99 | Loss aversion (instant escape) |
| Abyssal Scrolls | IAP (consumable) | $2.99 / $9.99 / $19.99 | Variable reward loop |
| Void Crystal Packs | IAP (currency) | $0.99 – $9.99 | Wager fuel |

### Tech Stack for Monetization

- **RevenueCat** — IAP management for iOS + Android. Handles entitlement tracking, restore purchases, subscription state (if subscription model is added later).
- **Stripe** — Soul Escrow wager settlement. Practitioner holds are captured on Restriction activation; released or forfeited via webhook on `resolutionDate`.
- **`store/premium-context.js`** (new) — holds `activeBloodline`, `activeDomain`, `activeFamiliar`, `unlockedArtifacts`, `voidCrystalBalance`. Persisted in AsyncStorage + synced server-side.
- **`server/src/routes/premium.js`** (new) — RevenueCat and Stripe webhook handlers, familiar summon logic (server-side RNG), wager settlement.

### Gacha Compliance Notes

Pull rates are displayed on the Summoning Void screen before every purchase (required in most jurisdictions). The pity counter is tracked server-side and is tamper-proof. The system is designed to be compliant with Apple's and Google's IAP policies — no loot boxes disguised as consumables. Familiars are clearly classified as cosmetic + utility items, not random chance at gameplay-required content.

---

## Troubleshooting

**Android emulator — use 10.0.2.2, not localhost**  
`localhost` inside the Android Emulator refers to the emulator itself. The host machine is `10.0.2.2`. `util/http.js` handles this automatically via `Platform.OS` check. Do NOT hardcode `localhost` in `app.json`'s `extra.apiUrl`.

**JWT_SECRET must be set before server starts**  
`signToken` and `requireAuth` both read `process.env.JWT_SECRET`. If missing, all auth calls throw → 500s → login fails silently.

**Double initialization of auth state**  
Both `store/auth-context.js` (useEffect) and `App.js > Root` (useEffect) independently read AsyncStorage on mount. They are intentionally concurrent. Root's version controls the splash screen gate (`isTryingLogin`) and takes behavioral precedence.

**Sessions with reps=0 do NOT create StrikeEvents**  
Only `reps > 0` triggers a `StrikeEvent` and increments `hammerCount`. Recovery sessions use `reps: 0` by convention.

**Token expiry vs logout**  
Tokens default to `7d`. Root's useEffect schedules `setTimeout(authCtx.logout, remaining)` for tokens still within validity. Changing `JWT_SECRET` invalidates all existing tokens — users must re-login.

**The root README's API paths do not use `/api/` prefix**  
The server mounts directly at `/auth`, `/vows`, `/practitioner`, etc. There is no `/api/` prefix anywhere in the server code.

---

*EvolveAI is not a fitness app that added gamification. It is a gamified reality that uses fitness as its input signal. The Void was here before the app. The app just made it legible.*
