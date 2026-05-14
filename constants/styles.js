const palette = {
  obsidian: '#05060a',
  black: '#0a0b10',
  voidSurface: '#10121b',
  voidSurfaceHi: '#181b27',
  voidSurfaceTop: '#222637',
  hairline: '#262a3a',
  crimson: '#7a0c1c',
  crimsonHi: '#a4112a',
  crimsonGlow: '#c91538',
  ember: '#ff3b54',
  gold: '#f5b301',
  goldSoft: '#ffd76a',
  jade: '#16d39a',
  ki: '#7cf6ff',
  textPrimary: '#f6f7fb',
  textSecondary: '#a9b0c4',
  textTertiary: '#5d6481',
  errorBackground: '#2a0410',
  error: '#ff5b76',
};

export const Tokens = {
  radius: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 },
  font: {
    display: { fontSize: 34, fontWeight: '900', letterSpacing: -0.5 },
    title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
    h2: { fontSize: 20, fontWeight: '700' },
    h3: { fontSize: 17, fontWeight: '700' },
    body: { fontSize: 15, fontWeight: '500' },
    label: { fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
    mono: { fontSize: 13, fontFamily: 'monospace', letterSpacing: 0.5 },
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 6,
    },
    glow: {
      shadowColor: palette.crimsonGlow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 8,
    },
  },
};

const voidTheme = {
  name: 'void',
  background: palette.obsidian,
  surface: palette.voidSurface,
  surfaceHi: palette.voidSurfaceHi,
  surfaceTop: palette.voidSurfaceTop,
  hairline: palette.hairline,
  primary: palette.crimson,
  primaryHi: palette.crimsonHi,
  primaryGlow: palette.crimsonGlow,
  primaryLight: palette.crimsonHi,
  primary800: palette.crimson,
  ember: palette.ember,
  accent: palette.gold,
  accentSoft: palette.goldSoft,
  ki: palette.ki,
  jade: palette.jade,
  textPrimary: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textTertiary: palette.textTertiary,
  iconColor: palette.textPrimary,
  error: palette.error,
  errorBackground: palette.errorBackground,
  shadowColor: '#000',
};

const lightTheme = {
  ...voidTheme,
  name: 'ascendant',
  background: '#f6f3ee',
  surface: '#ffffff',
  surfaceHi: '#f1ece4',
  surfaceTop: '#e7e0d4',
  hairline: '#d8cfbf',
  textPrimary: '#0a0b10',
  textSecondary: '#3a3f55',
  textTertiary: '#7d8298',
  iconColor: '#0a0b10',
};

export const GlobalStyles = {
  palette,
  Tokens,
  void: voidTheme,
  dark: voidTheme,
  light: lightTheme,
};

export const getTheme = (theme, domainKey) => {
  const base = theme === 'light' || theme === 'ascendant' ? lightTheme : voidTheme;
  if (!domainKey || domainKey === 'void_default') return base;

  try {
    const { getDomainConfig } = require('./domains');
    const domain = getDomainConfig(domainKey);
    if (!domain?.tokens) return base;
    const t = domain.tokens;
    return {
      ...base,
      background: t.background ?? base.background,
      surface: t.surface ?? base.surface,
      surfaceHi: t.surfaceElevated ?? base.surfaceHi,
      hairline: t.border ?? base.hairline,
      primaryGlow: t.accentBright ?? base.primaryGlow,
      ki: t.kiBarFill ?? base.ki,
      textPrimary: t.text ?? base.textPrimary,
      textSecondary: t.textMuted ?? base.textSecondary,
      shadowColor: t.shadow ?? base.shadowColor,
      _domainKey: domainKey,
    };
  } catch {
    return base;
  }
};
