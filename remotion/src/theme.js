export const PALETTE = {
  obsidian: '#05060a',
  black: '#0a0b10',
  voidSurface: '#10121b',
  voidSurfaceHi: '#181b27',
  hairline: '#262a3a',
  crimson: '#7a0c1c',
  crimsonHi: '#a4112a',
  crimsonGlow: '#c91538',
  ember: '#ff3b54',
  gold: '#f5b301',
  goldSoft: '#ffd76a',
  ki: '#7cf6ff',
  textPrimary: '#f6f7fb',
  textSecondary: '#a9b0c4',
  textTertiary: '#5d6481',
};

export const AURA_COLORS = {
  ki: '#7cf6ff',
  gold: '#f5b301',
  crimson: '#c91538',
  white: '#dde8ff',
};

export const FONT_STACK = '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Inter, system-ui, sans-serif';
export const MONO_STACK = '"SF Mono", ui-monospace, "JetBrains Mono", Menlo, monospace';

export const REALM_PALETTES = {
  1: { primary: '#1f2436', secondary: '#0d1018', accent: AURA_COLORS.ki, glyph: '壱', name: 'Foundation Realm' },
  2: { primary: '#26152d', secondary: '#10081a', accent: '#a78bfa', glyph: '弐', name: 'Ki Accumulation' },
  3: { primary: '#1a2a36', secondary: '#080d18', accent: AURA_COLORS.ki, glyph: '参', name: 'Ki Establishment' },
  4: { primary: '#2c1c0f', secondary: '#100a05', accent: AURA_COLORS.gold, glyph: '肆', name: 'True Ki Awakening' },
  5: { primary: '#1a0d22', secondary: '#090410', accent: AURA_COLORS.crimson, glyph: '伍', name: 'Transcendence (The Void)' },
  6: { primary: '#2c0e16', secondary: '#10050a', accent: PALETTE.ember, glyph: '陸', name: 'Evolutionary Realm' },
  7: { primary: '#3a1410', secondary: '#1a0608', accent: PALETTE.gold, glyph: '漆', name: 'Divine Master' },
};

export const TYPO = {
  display: { fontFamily: FONT_STACK, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0 },
  title: { fontFamily: FONT_STACK, fontWeight: 800, letterSpacing: -0.6 },
  label: { fontFamily: FONT_STACK, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', fontSize: 14 },
  mono: { fontFamily: MONO_STACK, letterSpacing: 1 },
};
