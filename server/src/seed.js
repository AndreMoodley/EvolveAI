import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';

// ─── Premium catalog (mirrors constants/familiars.js, bloodlines.js, domains.js) ─

const FAMILIAR_CATALOG = [
  { id: 'time_weaver',   name: 'Time-Weaver',     rarity: 'ancient',     abilityKey: 'streak_restore',     visualKey: 'time_weaver',    description: 'Retroactively log one missed session per month without breaking your streak.' },
  { id: 'oracle',        name: 'Oracle',           rarity: 'ancient',     abilityKey: 'ai_coaching',        visualKey: 'oracle',         description: 'Analyzes your last 30 days of session data to generate a custom training protocol.' },
  { id: 'anchor_keeper', name: 'Anchor Keeper',    rarity: 'bound',       abilityKey: 'adaptive_notify',    visualKey: 'anchor_keeper',  description: 'Adapts push notification timing based on your historical log patterns.' },
  { id: 'shadow_hound',  name: 'Shadow Hound',     rarity: 'bound',       abilityKey: 'early_hammer_double', visualKey: 'shadow_hound',   description: 'Doubles hammer count for sessions logged before 6am.' },
  { id: 'ki_sentinel',   name: 'Ki Sentinel',      rarity: 'wandering',   abilityKey: 'ki_drain_cap',       visualKey: 'ki_sentinel',    description: 'Caps daily ki drain at 20 points regardless of leak count.' },
  { id: 'vow_witness',   name: 'Vow Witness',      rarity: 'wandering',   abilityKey: 'vow_notify',         visualKey: 'vow_witness',    description: 'Sends a daily accountability check-in when a major vow is active.' },
  { id: 'echo_specter',  name: 'Echo Specter',     rarity: 'void_herald', abilityKey: 'ghost_echo',         visualKey: 'echo_specter',   description: 'Mirrors your entity\'s visual state but inverted — trails every animation with a ghost echo.' },
];

const BLOODLINE_CATALOG = [
  {
    lineageKey: 'origin',    name: 'Origin Lineage',     description: 'The standard void evolution path. Seven forms. Seven realms. Complete.',
    stageConfig: { 1:{torsoHeight:60,armLength:40,glowRadius:30}, 2:{torsoHeight:68,armLength:46,glowRadius:36}, 3:{torsoHeight:76,armLength:54,glowRadius:44}, 4:{torsoHeight:84,armLength:62,glowRadius:54}, 5:{torsoHeight:94,armLength:72,glowRadius:66}, 6:{torsoHeight:104,armLength:82,glowRadius:80}, 7:{torsoHeight:116,armLength:94,glowRadius:98} },
  },
  {
    lineageKey: 'abyssal',   name: 'Abyssal Lineage',    description: 'Fractured void. Necrotic chains. The entity that consumed its own light.',
    stageConfig: { 1:{torsoHeight:56,armLength:50,glowRadius:24}, 2:{torsoHeight:64,armLength:58,glowRadius:30}, 3:{torsoHeight:72,armLength:68,glowRadius:38}, 4:{torsoHeight:80,armLength:80,glowRadius:50}, 5:{torsoHeight:90,armLength:94,glowRadius:64}, 6:{torsoHeight:102,armLength:110,glowRadius:80}, 7:{torsoHeight:116,armLength:130,glowRadius:100} },
  },
  {
    lineageKey: 'celestial', name: 'Celestial Mandate',  description: 'White sigil fire. Divine geometry. The entity that ascended through purity.',
    stageConfig: { 1:{torsoHeight:58,armLength:38,glowRadius:36}, 2:{torsoHeight:66,armLength:44,glowRadius:46}, 3:{torsoHeight:76,armLength:52,glowRadius:58}, 4:{torsoHeight:86,armLength:62,glowRadius:72}, 5:{torsoHeight:98,armLength:74,glowRadius:90}, 6:{torsoHeight:110,armLength:88,glowRadius:110}, 7:{torsoHeight:124,armLength:104,glowRadius:134} },
  },
  {
    lineageKey: 'crimson',   name: 'Crimson Curse',      description: 'Blood-red ki. Cracked bone structure. The entity shaped by its own suffering.',
    stageConfig: { 1:{torsoHeight:58,armLength:42,glowRadius:28}, 2:{torsoHeight:66,armLength:50,glowRadius:36}, 3:{torsoHeight:74,armLength:60,glowRadius:46}, 4:{torsoHeight:84,armLength:70,glowRadius:58}, 5:{torsoHeight:96,armLength:82,glowRadius:72}, 6:{torsoHeight:108,armLength:96,glowRadius:88}, 7:{torsoHeight:122,armLength:112,glowRadius:108} },
  },
  {
    lineageKey: 'phantom',   name: 'Phantom Sovereign',  description: 'Translucent, shifting between states. The entity that exists between realms.',
    stageConfig: { 1:{torsoHeight:54,armLength:36,glowRadius:32}, 2:{torsoHeight:62,armLength:44,glowRadius:42}, 3:{torsoHeight:72,armLength:54,glowRadius:54}, 4:{torsoHeight:82,armLength:66,glowRadius:68}, 5:{torsoHeight:94,armLength:80,glowRadius:84}, 6:{torsoHeight:108,armLength:96,glowRadius:104}, 7:{torsoHeight:124,armLength:114,glowRadius:128} },
  },
];

const DOMAIN_CATALOG = [
  { packKey: 'void_default',   name: 'The Void',          description: 'Absolute darkness. The default domain. Everything else is decoration.',        themeConfig: { background:'#0a0a0f' }, audioBundle: null },
  { packKey: 'frozen_wastes',  name: 'Frozen Wastes',     description: 'Arctic blue. Frost geometry. The practitioner whose will is absolute zero.',   themeConfig: { background:'#060c14' }, audioBundle: 'frozen_wastes_ambient' },
  { packKey: 'ember_court',    name: 'Ember Court',       description: 'Deep orange. Heat shimmer. The domain of those who train through the burn.',   themeConfig: { background:'#120800' }, audioBundle: 'ember_court_ambient' },
  { packKey: 'abyssal_rift',   name: 'Abyssal Rift',      description: 'Void purple. Spatial tears. The domain where reality concedes to will.',       themeConfig: { background:'#080010' }, audioBundle: 'abyssal_rift_ambient' },
  { packKey: 'jade_sovereign', name: 'Jade Sovereign',    description: 'Forest green. Ancient stone. The domain of the practitioner who has become nature itself.', themeConfig: { background:'#020c06' }, audioBundle: 'jade_sovereign_ambient' },
  { packKey: 'storm_mandate',  name: 'Storm Mandate',     description: 'Electric white. Thunder cracks. The domain of pure kinetic dominance.',       themeConfig: { background:'#060810' }, audioBundle: 'storm_mandate_ambient' },
];

const ADMIN_EMAIL = 'admin@evolveai.app';
const ADMIN_PASSWORD = 'VoidAdmin2024!';
const DEMO_PASSWORD = 'VoidTest2024!';

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function upsertAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.practitioner.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: 'ADMIN' },
    create: { email: ADMIN_EMAIL, passwordHash, name: 'Administrator', role: 'ADMIN' },
  });
  console.log('✓ Admin:', ADMIN_EMAIL);
}

async function seedPractitioner({ email, name, hammerCount, ki, shadowLevel, streak, anchorCompletedAt, lastLogDate, vows, sessions, leaks }) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const p = await prisma.practitioner.upsert({
    where: { email },
    update: { passwordHash, name, hammerCount, ki, shadowLevel, streak, anchorCompletedAt, lastLogDate },
    create: { email, passwordHash, name, hammerCount, ki, shadowLevel, streak, anchorCompletedAt, lastLogDate },
  });

  // Wipe and recreate related data (idempotent)
  await prisma.strikeEvent.deleteMany({ where: { practitionerId: p.id } });
  await prisma.kiLeak.deleteMany({ where: { practitionerId: p.id } });
  await prisma.voidSession.deleteMany({ where: { practitionerId: p.id } });
  await prisma.vow.deleteMany({ where: { practitionerId: p.id } }); // cascades progressions

  for (const { progressions, ...vowData } of vows) {
    const vow = await prisma.vow.create({ data: { ...vowData, practitionerId: p.id } });
    for (let i = 0; i < (progressions ?? []).length; i++) {
      const prog = progressions[i];
      await prisma.progression.create({
        data: {
          vowId: vow.id,
          text: prog.text,
          completed: prog.completed ?? false,
          completedAt: prog.completed ? daysAgo(Math.ceil(Math.random() * 7)) : null,
          orderIndex: i,
        },
      });
    }
  }

  for (const session of sessions) {
    await prisma.voidSession.create({ data: { ...session, practitionerId: p.id } });
    if (session.reps > 0) {
      await prisma.strikeEvent.create({
        data: { practitionerId: p.id, amount: session.reps, occurredAt: session.occurredOn },
      });
    }
  }

  for (const leak of leaks) {
    await prisma.kiLeak.create({ data: { ...leak, practitionerId: p.id } });
  }

  console.log(`✓ ${name}: ${email}`);
}

// ─── Practitioner definitions ────────────────────────────────────────────────

const BEGINNER = {
  email: 'beginner@evolveai.app',
  name: 'Kira Void',
  hammerCount: 800,
  ki: 80,
  shadowLevel: 1,
  streak: 3,
  anchorCompletedAt: null,
  lastLogDate: daysAgo(0),
  vows: [
    {
      title: 'Zero Processed Food — 30 Days',
      description: 'No processed food, no sugar, no excuses.',
      type: 'minor',
      startDate: daysAgo(5),
      resolutionDate: daysAgo(-25),
      progressions: [
        { text: 'Audit pantry and remove all processed items' },
        { text: 'Meal prep Sunday before the week starts' },
      ],
    },
    {
      title: 'Morning Origin Practice — Daily',
      description: 'Complete the Temporal Anchor every morning before checking the phone.',
      type: 'minor',
      startDate: daysAgo(3),
      resolutionDate: daysAgo(-27),
      progressions: [
        { text: 'Set alarm 30 min earlier than usual' },
        { text: 'Complete first 7 consecutive Temporal Anchors' },
      ],
    },
  ],
  sessions: [
    { modality: 'origin', description: 'Morning muscle-up practice', reps: 12, rating: 7, occurredOn: daysAgo(2) },
    { modality: 'pull', description: 'Pull day — weighted rows', reps: 18, rating: 8, occurredOn: daysAgo(1) },
    { modality: 'core', description: 'Core conditioning circuit', reps: 15, rating: 6, occurredOn: daysAgo(0) },
  ],
  leaks: [
    { category: 'social', label: 'Scrolled socials for 45 min after waking', cost: 5, occurredAt: daysAgo(2) },
    { category: 'media', label: 'Watched 2 hrs of Netflix instead of training', cost: 8, occurredAt: daysAgo(1) },
  ],
};

const INTERMEDIATE = {
  email: 'mid@evolveai.app',
  name: 'Ryo Tenshin',
  hammerCount: 6500,
  ki: 60,
  shadowLevel: 3,
  streak: 14,
  anchorCompletedAt: daysAgo(1),
  lastLogDate: daysAgo(0),
  vows: [
    {
      title: '10,000 Origin Art Strikes — The Netero Standard',
      description: 'Reach the annual Netero Standard of 10,000 muscle-up reps.',
      type: 'major',
      startDate: daysAgo(60),
      resolutionDate: daysAgo(-30),
      progressions: [
        { text: 'Hit 1,000 cumulative strikes', completed: true },
        { text: 'Achieve clean false-grip hold for 10 seconds', completed: true },
        { text: 'Complete 5 consecutive strict muscle-ups', completed: false },
        { text: 'Log 30 consecutive training days', completed: false },
        { text: 'Hit 5,000 cumulative strikes', completed: false },
        { text: 'Hit 10,000 cumulative strikes — Netero Standard achieved', completed: false },
      ],
    },
    {
      title: 'Master the False Grip — 21 Days',
      description: 'Build false-grip strength to carry over to the muscle-up.',
      type: 'minor',
      startDate: daysAgo(10),
      resolutionDate: daysAgo(-11),
      progressions: [
        { text: 'Hold false grip for 5 seconds unassisted', completed: true },
        { text: 'Hold for 10 seconds three times in a row', completed: false },
        { text: 'Transition false grip into ring row', completed: false },
        { text: 'Combine false grip with full pull-up', completed: false },
      ],
    },
    {
      title: 'Zero Ki Leaks — 7 Days',
      description: 'No social media, no junk food, no validation-seeking for a full week.',
      type: 'minor',
      startDate: daysAgo(3),
      resolutionDate: daysAgo(-4),
      progressions: [
        { text: 'Delete social apps from phone for 7 days', completed: true },
        { text: 'Journal each evening instead of scrolling', completed: false },
        { text: 'Complete 7 consecutive anchor rituals', completed: false },
        { text: 'No processed food for the full 7 days', completed: false },
      ],
    },
  ],
  sessions: [
    { modality: 'origin',   description: 'Morning origin — muscle-up sets',      reps: 20, rating: 8, occurredOn: daysAgo(6) },
    { modality: 'pull',     description: 'Ring rows + false-grip holds',          reps: 25, rating: 7, occurredOn: daysAgo(6) },
    { modality: 'push',     description: 'Ring push-ups and dips',                reps: 30, rating: 8, occurredOn: daysAgo(5) },
    { modality: 'core',     description: 'L-sit and hollow body work',            reps: 22, rating: 6, occurredOn: daysAgo(4) },
    { modality: 'cardio',   description: 'Zone 2 run — 40 min',                   reps: 15, rating: 7, occurredOn: daysAgo(3) },
    { modality: 'recovery', description: 'NSDR session + stretching',             reps:  0, rating: 9, occurredOn: daysAgo(2) },
    { modality: 'origin',   description: 'Heavy origin practice — weighted vest', reps: 35, rating: 9, occurredOn: daysAgo(1) },
    { modality: 'pull',     description: 'Weighted pull-ups 5×5',                 reps: 40, rating: 8, occurredOn: daysAgo(0) },
  ],
  leaks: [
    { category: 'social',     label: 'Checked IG twice during rest periods',       cost: 5, occurredAt: daysAgo(5) },
    { category: 'food',       label: 'Ate fast food after skipping meal prep',     cost: 8, occurredAt: daysAgo(4) },
    { category: 'media',      label: 'Two-hour doom-scroll before bed',            cost: 7, occurredAt: daysAgo(3) },
    { category: 'doubt',      label: 'Questioned the Netero Standard mid-session', cost: 5, occurredAt: daysAgo(2) },
    { category: 'argument',   label: 'Energy-draining argument over nothing',      cost: 10, occurredAt: daysAgo(1) },
  ],
};

const ADVANCED = {
  email: 'advanced@evolveai.app',
  name: 'Seya Akaishi',
  hammerCount: 25000,
  ki: 45,
  shadowLevel: 4,
  streak: 87,
  anchorCompletedAt: daysAgo(0),
  lastLogDate: daysAgo(0),
  vows: [
    {
      title: 'Year One — 10,000 Strikes Milestone',
      description: 'Complete the first full Netero cycle within the year.',
      type: 'major',
      startDate: daysAgo(180),
      resolutionDate: daysAgo(-5),
      progressions: [
        { text: 'Hit 1,000 strikes',                   completed: true },
        { text: 'Hit 2,500 strikes',                   completed: true },
        { text: 'Hit 5,000 strikes',                   completed: true },
        { text: 'Maintain 30-day streak',              completed: true },
        { text: 'Log sessions across all 6 modalities', completed: true },
        { text: 'Hit 7,500 strikes',                   completed: true },
        { text: 'Hit 10,000 strikes',                  completed: false },
        { text: 'Celebrate and reset for Year Two',    completed: false },
      ],
    },
    {
      title: 'Body Recomposition — 90 Day Protocol',
      description: 'Reduce body fat while increasing ring strength metrics.',
      type: 'major',
      startDate: daysAgo(90),
      resolutionDate: daysAgo(-0),
      progressions: [
        { text: 'Establish baseline measurements',      completed: true },
        { text: 'Follow the void nutrition protocol',   completed: true },
        { text: 'Hit weekly session targets 8 weeks',   completed: true },
        { text: 'Mid-point check-in measurements',      completed: true },
        { text: 'Final measurement and photo comparison', completed: true },
        { text: 'Assess and plan next 90-day cycle',    completed: false },
        { text: 'Document learnings in Void Journal',   completed: false },
        { text: 'Set new physique target for next cycle', completed: false },
      ],
    },
    {
      title: 'No Screens After 9pm — 30 Days',
      description: 'Protect sleep and deep ki recovery by cutting all screens after 9pm.',
      type: 'minor',
      startDate: daysAgo(20),
      resolutionDate: daysAgo(-10),
      progressions: [
        { text: 'Set phone to grayscale and DND at 9pm',  completed: true },
        { text: 'Replace screen time with reading or journaling', completed: true },
        { text: 'Log 14 consecutive screen-free nights', completed: true },
        { text: 'Log final 16 nights to close the vow',  completed: false },
      ],
    },
  ],
  sessions: [
    { modality: 'origin',   description: 'Heavy muscle-up sets — 5×5',         reps: 50, rating: 9, occurredOn: daysAgo(13) },
    { modality: 'pull',     description: 'Weighted ring rows',                  reps: 35, rating: 8, occurredOn: daysAgo(13) },
    { modality: 'push',     description: 'Weighted ring dips',                  reps: 40, rating: 8, occurredOn: daysAgo(12) },
    { modality: 'cardio',   description: 'Sprint intervals — 8 rounds',         reps: 20, rating: 7, occurredOn: daysAgo(11) },
    { modality: 'core',     description: 'Dragon flags and toes-to-bar',        reps: 30, rating: 8, occurredOn: daysAgo(10) },
    { modality: 'recovery', description: 'Floatation tank — 60 min',            reps:  0, rating: 10, occurredOn: daysAgo(9) },
    { modality: 'origin',   description: 'Max rep muscle-up test — new PR',     reps: 45, rating: 10, occurredOn: daysAgo(8) },
    { modality: 'pull',     description: 'One-arm assisted rows',               reps: 28, rating: 7, occurredOn: daysAgo(7) },
    { modality: 'push',     description: 'Planche progressions',                reps: 22, rating: 8, occurredOn: daysAgo(6) },
    { modality: 'cardio',   description: 'Zone 2 — 60 min long run',            reps: 25, rating: 7, occurredOn: daysAgo(5) },
    { modality: 'core',     description: 'Gymnastics core — 45 min',            reps: 35, rating: 9, occurredOn: daysAgo(4) },
    { modality: 'origin',   description: 'Morning origin — fasted',             reps: 30, rating: 8, occurredOn: daysAgo(3) },
    { modality: 'recovery', description: 'NSDR + yoga nidra',                   reps:  0, rating: 9, occurredOn: daysAgo(2) },
    { modality: 'pull',     description: 'Supinated pull — tempo work',         reps: 38, rating: 8, occurredOn: daysAgo(1) },
    { modality: 'origin',   description: 'Saturday origin block',               reps: 48, rating: 9, occurredOn: daysAgo(0) },
  ],
  leaks: [
    { category: 'social',      label: 'Checked socials during anchor time',        cost: 5,  occurredAt: daysAgo(12) },
    { category: 'food',        label: 'Cheat meal spiralled into cheat day',       cost: 10, occurredAt: daysAgo(10) },
    { category: 'media',       label: 'Late-night YouTube spiral',                 cost: 8,  occurredAt: daysAgo(9) },
    { category: 'validation',  label: 'Posted training video seeking likes',       cost: 7,  occurredAt: daysAgo(7) },
    { category: 'doubt',       label: 'Compared progress to someone else\'s reel', cost: 6,  occurredAt: daysAgo(6) },
    { category: 'argument',    label: 'Lost energy in pointless debate online',    cost: 9,  occurredAt: daysAgo(4) },
    { category: 'social',      label: 'Attended social event that drained ki',     cost: 7,  occurredAt: daysAgo(3) },
    { category: 'media',       label: 'Watched news for 2 hours',                 cost: 6,  occurredAt: daysAgo(1) },
  ],
};

const MASTER = {
  email: 'master@evolveai.app',
  name: 'Zero Netero',
  hammerCount: 80000,
  ki: 95,
  shadowLevel: 5,
  streak: 210,
  anchorCompletedAt: daysAgo(0),
  lastLogDate: daysAgo(0),
  vows: [
    {
      title: 'Year Eight — Ascension Beyond Form',
      description: 'The strike is no longer about muscle. It is about becoming the Void itself.',
      type: 'major',
      startDate: daysAgo(300),
      resolutionDate: daysAgo(-65),
      progressions: [
        { text: 'Reach 70,000 lifetime strikes',         completed: true },
        { text: 'Complete 200-day unbroken streak',      completed: true },
        { text: 'Master one-arm muscle-up progression',  completed: true },
        { text: 'Complete 6-month no-leak protocol',     completed: true },
        { text: 'Reach 75,000 lifetime strikes',         completed: true },
        { text: 'Train in full silence for 30 days',     completed: true },
        { text: 'Complete isolation floatation protocol', completed: true },
        { text: 'Reach 80,000 lifetime strikes',         completed: true },
        { text: 'Publish the Void Protocol manuscript',  completed: false },
        { text: 'Initiate Year Nine vow cycle',          completed: false },
      ],
    },
    {
      title: 'Teach the Origin Art — First Student',
      description: 'Pass the flame. Identify, accept, and guide one student through Realm 1.',
      type: 'major',
      startDate: daysAgo(120),
      resolutionDate: daysAgo(-60),
      progressions: [
        { text: 'Write the Origin Art beginner curriculum',   completed: true },
        { text: 'Identify one worthy student',               completed: true },
        { text: 'Conduct first session — technique foundation', completed: true },
        { text: 'Student completes 30-day streak',           completed: true },
        { text: 'Student reaches 1,000 strikes',             completed: true },
        { text: 'Student completes first binding vow',       completed: true },
        { text: 'Document teaching methodology',             completed: true },
        { text: 'Student reaches Realm 2 (1,500 strikes)',   completed: true },
        { text: 'Assess student readiness for solo practice', completed: false },
        { text: 'Formal handover ceremony — student is free', completed: false },
      ],
    },
    {
      title: 'Void Journal — 365 Days',
      description: 'Write in the Void Journal every single day for one full year.',
      type: 'minor',
      startDate: daysAgo(30),
      resolutionDate: daysAgo(-335),
      progressions: [
        { text: 'Write first 7 consecutive entries',          completed: true },
        { text: 'Write 30 consecutive entries',              completed: true },
        { text: 'Identify a recurring pattern in the entries', completed: true },
        { text: 'Write 100 entries',                         completed: false },
        { text: 'Write 200 entries',                         completed: false },
        { text: 'Write 365 entries — vow complete',          completed: false },
      ],
    },
  ],
  sessions: [
    { modality: 'origin',   description: 'Dawn origin — 100 reps fasted',          reps: 100, rating: 10, occurredOn: daysAgo(29) },
    { modality: 'recovery', description: 'Floatation tank — 90 min',                reps:   0, rating: 10, occurredOn: daysAgo(28) },
    { modality: 'pull',     description: 'One-arm ring row progression',             reps:  60, rating:  9, occurredOn: daysAgo(27) },
    { modality: 'origin',   description: 'Mid-morning origin block',                reps:  80, rating:  9, occurredOn: daysAgo(26) },
    { modality: 'push',     description: 'Planche lean + ring dip cycle',           reps:  55, rating:  8, occurredOn: daysAgo(25) },
    { modality: 'cardio',   description: 'Zone 2 run — 90 min',                     reps:  30, rating:  8, occurredOn: daysAgo(24) },
    { modality: 'core',     description: 'Dragon flag + L-sit — 45 min',            reps:  45, rating:  9, occurredOn: daysAgo(23) },
    { modality: 'origin',   description: 'Evening origin — second session',         reps:  90, rating:  9, occurredOn: daysAgo(22) },
    { modality: 'recovery', description: 'NSDR + yoga nidra — 45 min',              reps:   0, rating: 10, occurredOn: daysAgo(21) },
    { modality: 'origin',   description: 'Origin — heavy negatives',                reps:  70, rating:  9, occurredOn: daysAgo(20) },
    { modality: 'pull',     description: 'Weighted chin-up ladder',                 reps:  65, rating:  8, occurredOn: daysAgo(19) },
    { modality: 'push',     description: 'Full ring dip depth work',                reps:  50, rating:  8, occurredOn: daysAgo(18) },
    { modality: 'cardio',   description: 'Sprint protocol — 10 × 200m',             reps:  35, rating:  9, occurredOn: daysAgo(17) },
    { modality: 'origin',   description: 'Morning origin — PR attempt',             reps:  95, rating: 10, occurredOn: daysAgo(16) },
    { modality: 'core',     description: 'Toes-to-bar + front lever holds',         reps:  40, rating:  9, occurredOn: daysAgo(15) },
    { modality: 'recovery', description: 'Full rest day — floatation',              reps:   0, rating: 10, occurredOn: daysAgo(14) },
    { modality: 'origin',   description: 'Teaching session — guided origin',        reps:  50, rating:  9, occurredOn: daysAgo(13) },
    { modality: 'pull',     description: 'Ring muscle-up transition drill',         reps:  75, rating:  9, occurredOn: daysAgo(12) },
    { modality: 'push',     description: 'Ring push-up + dip superset',             reps:  60, rating:  8, occurredOn: daysAgo(11) },
    { modality: 'cardio',   description: 'Zone 2 — 75 min trail run',               reps:  30, rating:  8, occurredOn: daysAgo(10) },
    { modality: 'origin',   description: 'Fasted AM origin — silent session',       reps:  85, rating: 10, occurredOn: daysAgo(9) },
    { modality: 'core',     description: 'Gymnastics conditioning — 60 min',        reps:  55, rating:  9, occurredOn: daysAgo(8) },
    { modality: 'recovery', description: 'NSDR — 30 min',                           reps:   0, rating:  9, occurredOn: daysAgo(7) },
    { modality: 'origin',   description: 'Origin + student coaching block',         reps:  70, rating:  9, occurredOn: daysAgo(6) },
    { modality: 'pull',     description: 'Supinated grip ladder',                   reps:  65, rating:  8, occurredOn: daysAgo(5) },
    { modality: 'push',     description: 'Weighted dip 6×4',                        reps:  48, rating:  8, occurredOn: daysAgo(4) },
    { modality: 'cardio',   description: 'Max VO2 interval — 6 rounds',             reps:  40, rating:  9, occurredOn: daysAgo(3) },
    { modality: 'core',     description: 'Full gymnastics core cycle',              reps:  50, rating:  9, occurredOn: daysAgo(2) },
    { modality: 'origin',   description: 'Pre-dawn — 100 rep target hit',           reps: 100, rating: 10, occurredOn: daysAgo(1) },
    { modality: 'origin',   description: 'Today\'s dawn origin — Void complete',    reps: 100, rating: 10, occurredOn: daysAgo(0) },
  ],
  leaks: [
    { category: 'social',     label: 'Attended networking event — energy cost',    cost: 5,  occurredAt: daysAgo(25) },
    { category: 'food',       label: 'Off-protocol meal after student session',    cost: 4,  occurredAt: daysAgo(22) },
    { category: 'validation', label: 'Briefly sought approval from old contact',   cost: 3,  occurredAt: daysAgo(19) },
    { category: 'media',      label: 'Read news for 30 min — unnecessary',        cost: 3,  occurredAt: daysAgo(16) },
    { category: 'argument',   label: 'Engaged with a challenger online',           cost: 4,  occurredAt: daysAgo(13) },
    { category: 'doubt',      label: 'Momentary doubt before PR attempt',          cost: 2,  occurredAt: daysAgo(10) },
    { category: 'social',     label: 'Overstayed social obligation',               cost: 5,  occurredAt: daysAgo(8) },
    { category: 'food',       label: 'Celebratory meal — acceptable leak',        cost: 3,  occurredAt: daysAgo(6) },
    { category: 'media',      label: 'Evening screen time — broke 9pm rule',      cost: 4,  occurredAt: daysAgo(5) },
    { category: 'validation', label: 'Checked post metrics twice',                 cost: 3,  occurredAt: daysAgo(3) },
    { category: 'doubt',      label: 'Questioned teaching methodology briefly',    cost: 2,  occurredAt: daysAgo(2) },
    { category: 'social',     label: 'Family obligation — unavoidable ki cost',    cost: 5,  occurredAt: daysAgo(1) },
  ],
};

// ─── Premium catalog seeder ───────────────────────────────────────────────────

async function seedPremiumCatalog() {
  for (const f of FAMILIAR_CATALOG) {
    await prisma.familiar.upsert({
      where: { id: f.id },
      update: { name: f.name, rarity: f.rarity, abilityKey: f.abilityKey, visualKey: f.visualKey, description: f.description },
      create: f,
    });
  }
  console.log(`✓ Familiars: ${FAMILIAR_CATALOG.length} seeded`);

  for (const b of BLOODLINE_CATALOG) {
    await prisma.bloodline.upsert({
      where: { lineageKey: b.lineageKey },
      update: { name: b.name, description: b.description, stageConfig: b.stageConfig },
      create: b,
    });
  }
  console.log(`✓ Bloodlines: ${BLOODLINE_CATALOG.length} seeded`);

  for (const d of DOMAIN_CATALOG) {
    await prisma.domainPack.upsert({
      where: { packKey: d.packKey },
      update: { name: d.name, description: d.description, themeConfig: d.themeConfig, audioBundle: d.audioBundle },
      create: d,
    });
  }
  console.log(`✓ Domains: ${DOMAIN_CATALOG.length} seeded`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n[seed] Seeding EvolveAI demo data...\n');

  await seedPremiumCatalog();
  await upsertAdmin();
  await seedPractitioner(BEGINNER);
  await seedPractitioner(INTERMEDIATE);
  await seedPractitioner(ADVANCED);
  await seedPractitioner(MASTER);

  console.log('\n[seed] Done.\n');
  console.log('  Demo password for all test accounts: VoidTest2024!');
  console.log('  Accounts:');
  console.log('    beginner@evolveai.app  — Realm 1 (800 strikes)');
  console.log('    mid@evolveai.app       — Realm 3 (6,500 strikes)');
  console.log('    advanced@evolveai.app  — Realm 5 (25,000 strikes)');
  console.log('    master@evolveai.app    — Realm 7 (80,000 strikes)');
  console.log('    admin@evolveai.app     — Admin panel (password: VoidAdmin2024!)');
  console.log('');

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
