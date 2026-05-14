// Familiar definitions — canonical source of truth for all shikigami
// Matches the Familiar.abilityKey values seeded into the database

export const FAMILIARS = {
  time_weaver: {
    id: 'time_weaver',
    name: 'Time-Weaver',
    rarity: 'ancient',
    abilityKey: 'streak_restore',
    visualKey: 'time_weaver',
    description: 'Retroactively log one missed session per month without breaking your streak.',
    abilityDescription: 'Once per month, seal a past day without consequence.',
    color: '#7c6fcd',
    glowColor: '#4a3fa0',
  },
  oracle: {
    id: 'oracle',
    name: 'Oracle',
    rarity: 'ancient',
    abilityKey: 'ai_coaching',
    visualKey: 'oracle',
    description: 'Analyzes your last 30 days of session data to generate a custom training protocol.',
    abilityDescription: 'Weekly AI-generated protocol tailored to your actual output.',
    color: '#c0a060',
    glowColor: '#806030',
  },
  anchor_keeper: {
    id: 'anchor_keeper',
    name: 'Anchor Keeper',
    rarity: 'bound',
    abilityKey: 'adaptive_notify',
    visualKey: 'anchor_keeper',
    description: 'Adapts push notification timing based on your historical log patterns.',
    abilityDescription: 'Notifications arrive when you actually open the app — not on a fixed schedule.',
    color: '#4a8a6a',
    glowColor: '#2a5a4a',
  },
  shadow_hound: {
    id: 'shadow_hound',
    name: 'Shadow Hound',
    rarity: 'bound',
    abilityKey: 'early_hammer_double',
    visualKey: 'shadow_hound',
    description: 'Doubles hammer count for sessions logged before 6am.',
    abilityDescription: 'The Void rewards those who rise before the world.',
    color: '#8a4a4a',
    glowColor: '#5a2a2a',
  },
  ki_sentinel: {
    id: 'ki_sentinel',
    name: 'Ki Sentinel',
    rarity: 'wandering',
    abilityKey: 'ki_drain_cap',
    visualKey: 'ki_sentinel',
    description: 'Caps daily ki drain at 20 points regardless of leak count.',
    abilityDescription: 'The Sentinel absorbs excess leakage so the practitioner can recover.',
    color: '#4a6a8a',
    glowColor: '#2a4a6a',
  },
  vow_witness: {
    id: 'vow_witness',
    name: 'Vow Witness',
    rarity: 'wandering',
    abilityKey: 'vow_notify',
    visualKey: 'vow_witness',
    description: 'Sends a daily accountability check-in when a major vow is active.',
    abilityDescription: 'The Witness watches. It does not forgive.',
    color: '#6a6a4a',
    glowColor: '#4a4a2a',
  },
  echo_specter: {
    id: 'echo_specter',
    name: 'Echo Specter',
    rarity: 'void_herald',
    abilityKey: 'ghost_echo',
    visualKey: 'echo_specter',
    description: 'Mirrors your entity\'s visual state but inverted — trails every animation with a ghost echo.',
    abilityDescription: 'The Specter is proof that you have walked the Void long enough to leave a shadow.',
    color: '#d0d0f0',
    glowColor: '#8080c0',
  },
};

export const FAMILIAR_RARITY_ORDER = ['wandering', 'bound', 'ancient', 'void_herald'];

export const RARITY_LABELS = {
  wandering: 'Wandering Spirit',
  bound: 'Bound Spirit',
  ancient: 'Ancient Familiar',
  void_herald: 'Void Herald',
};

export const RARITY_COLORS = {
  wandering: '#7a7a9a',
  bound: '#4a7a9a',
  ancient: '#9a7a2a',
  void_herald: '#7a2a9a',
};
