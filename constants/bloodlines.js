// Bloodline definitions — each rewrites the entity's entire visual evolution path

import { AURA_COLORS } from '../components/Character/SpiritEntity.js';

// Origin Lineage (free) — standard void forms, one per realm
export const ORIGIN_STAGE = {
  1: { torsoHeight: 60, armLength: 40, glowRadius: 30, label: 'Void Seed' },
  2: { torsoHeight: 68, armLength: 46, glowRadius: 36, label: 'Void Sprout' },
  3: { torsoHeight: 76, armLength: 54, glowRadius: 44, label: 'Void Form' },
  4: { torsoHeight: 84, armLength: 62, glowRadius: 54, label: 'Void Warrior' },
  5: { torsoHeight: 94, armLength: 72, glowRadius: 66, label: 'Void Ascendant' },
  6: { torsoHeight: 104, armLength: 82, glowRadius: 80, label: 'Void Sovereign' },
  7: { torsoHeight: 116, armLength: 94, glowRadius: 98, label: 'Void Absolute' },
};

export const BLOODLINES = {
  origin: {
    lineageKey: 'origin',
    name: 'Origin Lineage',
    description: 'The standard void evolution path. Seven forms. Seven realms. Complete.',
    stageConfig: ORIGIN_STAGE,
    auraColors: AURA_COLORS,
    particleStyle: 'orb',
    corruptedOverride: null, // uses default corruption visual
    price: null, // free
  },

  abyssal: {
    lineageKey: 'abyssal',
    name: 'Abyssal Lineage',
    description: 'Fractured void. Necrotic chains. The entity that consumed its own light.',
    stageConfig: {
      1: { torsoHeight: 56, armLength: 50, glowRadius: 24, label: 'Hollow Shard' },
      2: { torsoHeight: 64, armLength: 58, glowRadius: 30, label: 'Chain-Born' },
      3: { torsoHeight: 72, armLength: 68, glowRadius: 38, label: 'Abyss Walker' },
      4: { torsoHeight: 80, armLength: 80, glowRadius: 50, label: 'Void Devourer' },
      5: { torsoHeight: 90, armLength: 94, glowRadius: 64, label: 'Abyssal Wraith' },
      6: { torsoHeight: 102, armLength: 110, glowRadius: 80, label: 'Rift Sovereign' },
      7: { torsoHeight: 116, armLength: 130, glowRadius: 100, label: 'Abyss Absolute' },
    },
    auraColors: { ki: '#1a0a2e', gold: '#2a1a4e', crimson: '#2e0808', white: '#0a0a1e' },
    particleStyle: 'tendril',
    corruptedOverride: 'deep_corruption', // heavier chain overlay
    price: 7.99,
  },

  celestial: {
    lineageKey: 'celestial',
    name: 'Celestial Mandate',
    description: 'White sigil fire. Divine geometry. The entity that ascended through purity.',
    stageConfig: {
      1: { torsoHeight: 58, armLength: 38, glowRadius: 36, label: 'Sigil Spark' },
      2: { torsoHeight: 66, armLength: 44, glowRadius: 46, label: 'Sigil Flame' },
      3: { torsoHeight: 76, armLength: 52, glowRadius: 58, label: 'Radiant Form' },
      4: { torsoHeight: 86, armLength: 62, glowRadius: 72, label: 'Sacred Warrior' },
      5: { torsoHeight: 98, armLength: 74, glowRadius: 90, label: 'Heaven\'s Edge' },
      6: { torsoHeight: 110, armLength: 88, glowRadius: 110, label: 'Divine Sovereign' },
      7: { torsoHeight: 124, armLength: 104, glowRadius: 134, label: 'Celestial Absolute' },
    },
    auraColors: { ki: '#e0f0ff', gold: '#fff0d0', crimson: '#ffe0e0', white: '#ffffff' },
    particleStyle: 'sacred_geometry',
    corruptedOverride: 'fallen_angel',
    price: 7.99,
  },

  crimson: {
    lineageKey: 'crimson',
    name: 'Crimson Curse',
    description: 'Blood-red ki. Cracked bone structure. The entity shaped by its own suffering.',
    stageConfig: {
      1: { torsoHeight: 58, armLength: 42, glowRadius: 28, label: 'Cracked Seed' },
      2: { torsoHeight: 66, armLength: 50, glowRadius: 36, label: 'Bloodborn' },
      3: { torsoHeight: 74, armLength: 60, glowRadius: 46, label: 'Scar Walker' },
      4: { torsoHeight: 84, armLength: 70, glowRadius: 58, label: 'Crimson Warden' },
      5: { torsoHeight: 96, armLength: 82, glowRadius: 72, label: 'Curse Carrier' },
      6: { torsoHeight: 108, armLength: 96, glowRadius: 88, label: 'Blood Sovereign' },
      7: { torsoHeight: 122, armLength: 112, glowRadius: 108, label: 'Crimson Absolute' },
    },
    auraColors: { ki: '#8a0000', gold: '#8a4000', crimson: '#ff0000', white: '#ff8080' },
    particleStyle: 'blood_drop',
    corruptedOverride: 'shattered',
    price: 7.99,
  },

  phantom: {
    lineageKey: 'phantom',
    name: 'Phantom Sovereign',
    description: 'Translucent, shifting between states. The entity that exists between realms.',
    stageConfig: {
      1: { torsoHeight: 54, armLength: 36, glowRadius: 32, label: 'Flicker' },
      2: { torsoHeight: 62, armLength: 44, glowRadius: 42, label: 'Phase Shade' },
      3: { torsoHeight: 72, armLength: 54, glowRadius: 54, label: 'Rift Ghost' },
      4: { torsoHeight: 82, armLength: 66, glowRadius: 68, label: 'Phantom Form' },
      5: { torsoHeight: 94, armLength: 80, glowRadius: 84, label: 'Sovereign Specter' },
      6: { torsoHeight: 108, armLength: 96, glowRadius: 104, label: 'Rift Sovereign' },
      7: { torsoHeight: 124, armLength: 114, glowRadius: 128, label: 'Phantom Absolute' },
    },
    auraColors: { ki: '#c0c0e0', gold: '#e0d0c0', crimson: '#e0c0c0', white: '#f0f0ff' },
    particleStyle: 'ghost_echo',
    corruptedOverride: 'spectral_collapse',
    price: 9.99,
  },
};
