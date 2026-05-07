# EvolveAI · Remotion Cinematics

A self-contained video rendering layer for the Void Protocol. Every cinematic is parameterized by the practitioner's live state (realm, ki, hammerCount, streak, aura color), so the same composition produces a personal artifact for every user.

## Compositions

| ID | Format | Duration | Purpose |
|---|---|---|---|
| `RealmAscension` | 1920×1080 landscape | 6.0s | Cinematic when crossing a realm threshold |
| `StrikeBurst` | 1080×1080 square | 2.5s | Shareable celebration of a strike count |
| `DailyRecap` | 1080×1920 vertical | 7.0s | End-of-day summary (Stories/Reels) |
| `VowDeclaration` | 1080×1920 vertical | 7.0s | Sacred binding-vow ceremony |
| `VoidEntityShowcase` | 1080×1080 square | 10.0s | Hero loop of the Void Entity |
| `StreakMilestone` | 1080×1080 square | 4.0s | 7/30/100/365-day streak celebration |

Each composition lives in `src/compositions/` and exports a `defaultProps` schema that documents its parameters.

## Three ways to use Remotion in EvolveAI

### 1. Remotion Studio (development & content design)
```bash
npm run studio
```
Opens the visual editor at `localhost:3000`. Tweak compositions, scrub the timeline, edit `defaultProps`. The Studio reads `index.js` → `src/Root.jsx`.

### 2. CLI rendering (one-off MP4 exports)
```bash
npm run render -- StrikeBurst '{"reps":312,"modality":"origin","rating":10,"auraKey":"crimson"}'
npm run render -- RealmAscension '{"fromRealm":4,"toRealm":5,"hammerCount":18000}' out/ascension.mp4
```
Outputs land in `out/` by default. Each composition has a named shortcut (`render:strike-burst`, `render:realm-ascension`, …).

### 3. Live preview studio (interactive `@remotion/player`)
```bash
npm run preview
```
Opens a Vite dev server at `localhost:5174` showing every composition with **live, editable props in a sidebar** — change a number, the player re-renders instantly. Useful for designing data-driven cinematics with real values from your account.

## Server-side rendering pipeline

The Express backend at `server/src/routes/cinematics.js` exposes:

- `POST /cinematics` — `{ compositionId, inputProps }` → renders MP4, returns `{ url, fullUrl, ... }`
- `GET  /cinematics/file/:filename` — streams the rendered MP4
- `GET  /cinematics/compositions` — list of available compositions

The bundle is built once per server boot (cached). Renders queue serially. Auth: bearer token (same JWT as the rest of the API).

## In-app integration

### Auto-trigger on realm ascension
`hooks/useRealmAscensionWatcher.js` watches `hammerCount` in the Void context and POSTs to `/cinematics` when the practitioner crosses a realm threshold. Wired in `screens/Home.js`:

```js
import { useRealmAscensionWatcher } from '../hooks/useRealmAscensionWatcher';
useRealmAscensionWatcher();
```

### Manual share button
`components/Cinematic/CinematicShareButton.js` triggers any composition and shares the result via the native share sheet (or opens in a tab on web):

```jsx
<CinematicShareButton
  compositionId="DailyRecap"
  label="Share Today"
  buildProps={() => ({
    practitionerName: state.practitionerName,
    date: new Date().toISOString().slice(0, 10),
    realmLevel: realm.level,
    hammerCount: state.hammerCount,
    ki: state.ki,
    shadowLevel: state.shadowLevel,
    streak: state.streak,
    todayStrikes: state.todayHammerCount,
    auraKey,
  })}
/>
```

### Generic hook
`hooks/useCinematic.js` returns `{ render, renderAndShare, renderingId, error }` for arbitrary compositions.

## Suggested integration points (not yet wired)

- **`screens/BindingVowForm.js`** — on submit, trigger `VowDeclaration` for ceremonial confirmation
- **`screens/VoidSession.js`** — on submit, trigger `StrikeBurst` if `reps >= 25`
- **`screens/CustomCalendar.js`** — when streak crosses 7/30/100/365, trigger `StreakMilestone`
- **`screens/Profile.js`** — "Year in Review" button rendering a longer-form `DailyRecap` montage
- **`screens/RealmDetail.js`** — embed `VoidEntityShowcase` as a hero header (web only via `@remotion/player`)

## Architecture notes

- Compositions are pure React, only depending on `remotion` runtime APIs (`useCurrentFrame`, `interpolate`, `spring`, `AbsoluteFill`, `Sequence`).
- The `VoidEntity` primitive in `src/primitives/VoidEntity.jsx` is a frame-driven port of the React Native `SpiritEntity` — same anatomy, same aura system, same realm progression.
- Theme tokens in `src/theme.js` mirror `constants/styles.js` so video aesthetics stay in lockstep with the app.
- Renders happen out-of-process (`@remotion/renderer` spawns Chromium headless). The Expo bundle is **not** affected by Remotion deps.

## File layout

```
remotion/
├── package.json                 # studio, render, preview scripts
├── remotion.config.js
├── index.js                     # registers RemotionRoot
├── src/
│   ├── theme.js                 # tokens (mirrors app constants/styles.js)
│   ├── Root.jsx                 # composition registry
│   ├── primitives/
│   │   └── VoidEntity.jsx       # frame-driven port of SpiritEntity
│   └── compositions/
│       ├── RealmAscension.jsx
│       ├── StrikeBurst.jsx
│       ├── DailyRecap.jsx
│       ├── VowDeclaration.jsx
│       ├── VoidEntityShowcase.jsx
│       └── StreakMilestone.jsx
├── scripts/
│   └── render.mjs               # parameterized CLI renderer
├── preview/
│   ├── index.html
│   ├── main.jsx
│   ├── PreviewApp.jsx           # @remotion/player + live prop editor
│   └── vite.config.mjs
└── out/                         # rendered MP4s (gitignored)
```
