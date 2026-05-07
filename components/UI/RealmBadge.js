import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';

function RealmBadge({ realm, size = 'md' }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const dim = size === 'sm' ? 36 : size === 'lg' ? 84 : 56;
  const fontSize = size === 'sm' ? 18 : size === 'lg' ? 38 : 26;

  return (
    <View
      style={[
        styles.badge,
        {
          width: dim,
          height: dim,
          borderColor: t.accent,
          backgroundColor: realm.palette[1],
        },
      ]}
    >
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: realm.palette[0], opacity: 0.55, transform: [{ skewY: '-12deg' }, { translateY: -dim / 2 }] }]}
      />
      <Text style={[styles.glyph, { fontSize, color: t.accent }]}>{realm.glyph}</Text>
      <View style={styles.iconBubble}>
        <Ionicons name={realm.sigil} size={size === 'sm' ? 10 : size === 'lg' ? 16 : 12} color={t.textPrimary} />
      </View>
    </View>
  );
}

export default RealmBadge;

const styles = StyleSheet.create({
  badge: {
    borderRadius: Tokens.radius.pill,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: { fontWeight: '900', textAlign: 'center', includeFontPadding: false },
  iconBubble: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    padding: 3,
  },
});
