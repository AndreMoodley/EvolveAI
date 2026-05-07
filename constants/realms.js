export const REALMS = [
  {
    level: 1,
    name: 'Foundation Realm',
    sigil: 'leaf-outline',
    glyph: '壱',
    threshold: 0,
    nextThreshold: 1500,
    markers: '3–8 reps. Copy gross movement. Cognitive stage of motor learning.',
    lore: 'Disciple grade. No capacity for creation, only replication.',
    equivalent: 'Grade 4–3 Sorcerer · Basic cursed energy usage.',
    palette: ['#1f2436', '#0d1018'],
  },
  {
    level: 2,
    name: 'Ki Accumulation',
    sigil: 'flash-outline',
    glyph: '弐',
    threshold: 1500,
    nextThreshold: 4000,
    markers: '8–15 reps. Uninformed tweaking. Experimenting in the dark.',
    lore: 'Routines edited by feel. The mind-muscle channel begins to thaw.',
    equivalent: 'Grade 2 Sorcerer · Innate technique surfacing.',
    palette: ['#26152d', '#10081a'],
  },
  {
    level: 3,
    name: 'Ki Establishment',
    sigil: 'pulse-outline',
    glyph: '参',
    threshold: 4000,
    nextThreshold: 9000,
    markers: 'Informed adjustments. First strict muscle-ups. Internal error correction.',
    lore: 'Conventional rules still hold. Associative stage — feedback runs internal.',
    equivalent: 'Semi-Grade 1 · Capable but bound by convention.',
    palette: ['#1a2a36', '#080d18'],
  },
  {
    level: 4,
    name: 'True Ki Awakening',
    sigil: 'eye-outline',
    glyph: '肆',
    threshold: 9000,
    nextThreshold: 18000,
    markers: 'Casuals filter out. The 65lb Reset. Recognition of true ignorance.',
    lore: 'The great wall. Entry point into the Void. Clean weighted MUs only.',
    equivalent: 'Grade 1 · Peak of standard human capability.',
    palette: ['#2c1c0f', '#100a05'],
  },
  {
    level: 5,
    name: 'Transcendence (The Void)',
    sigil: 'planet-outline',
    glyph: '伍',
    threshold: 18000,
    nextThreshold: 36500,
    markers: 'Ego at zero. Origin Art crystallized. Daily 10,000 strikes.',
    lore: 'The current location. Variables controlled. Environment manipulated.',
    equivalent: 'Supreme Grade 1 · Anomalous scaling begins.',
    palette: ['#1a0d22', '#090410'],
  },
  {
    level: 6,
    name: 'Evolutionary Realm',
    sigil: 'flame-outline',
    glyph: '陸',
    threshold: 36500,
    nextThreshold: 73000,
    markers: 'Absolute neural control. 10+ years of grinding (MikeMike standard).',
    lore: 'Refined biomechanical anomaly. Movements transcend normal mechanics.',
    equivalent: 'Special Grade (Baseline) · Anomalous, refined power.',
    palette: ['#2c0e16', '#10050a'],
  },
  {
    level: 7,
    name: 'Divine Master',
    sigil: 'sparkles-outline',
    glyph: '漆',
    threshold: 73000,
    nextThreshold: null,
    markers: 'Pinnacle of human capability. Unrecognizable to the masses.',
    lore: 'The strongest. Country-level threat anomaly. The crown is heavy.',
    equivalent: 'Gojo · Sukuna · Dabura — the absolute apex.',
    palette: ['#3a1410', '#1a0608'],
  },
];

export const realmForCount = (count) => {
  let current = REALMS[0];
  for (const r of REALMS) {
    if (count >= r.threshold) current = r;
  }
  return current;
};

export const realmProgress = (count) => {
  const r = realmForCount(count);
  if (r.nextThreshold == null) return { realm: r, next: null, ratio: 1, into: count - r.threshold, span: 1 };
  const span = r.nextThreshold - r.threshold;
  const into = Math.max(0, count - r.threshold);
  return { realm: r, next: REALMS.find((x) => x.level === r.level + 1), ratio: Math.min(1, into / span), into, span };
};
