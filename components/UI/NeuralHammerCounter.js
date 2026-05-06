import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';
import PressableScale from './PressableScale';

function NeuralHammerCounter({ count, todayCount, onStrike, onStrikeBatch, dailyTarget = 100 }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const ring = useRef(new Animated.Value(0)).current;

  const fire = () => {
    onStrike?.();
    ring.setValue(0);
    Animated.timing(ring, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  };

  const ratio = Math.min(1, todayCount / dailyTarget);
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });
  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });

  return (
    <View style={styles.wrap}>
      <View style={[styles.ring, { borderColor: t.hairline }]}>
        <Animated.View
          style={[
            styles.ring,
            styles.absRing,
            {
              borderColor: t.primaryGlow,
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />
        <View style={[styles.progressArc, { backgroundColor: t.primaryGlow, height: `${ratio * 100}%` }]} />
        <PressableScale onPress={fire} scale={0.92} style={styles.core}>
          <View style={[styles.core, { backgroundColor: t.surfaceHi, borderColor: t.primaryHi }]}>
            <Ionicons name="flash" size={36} color={t.accent} />
            <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 6 }]}>{todayCount}</Text>
            <Text style={[Tokens.font.label, { color: t.textTertiary, marginTop: 2 }]}>today</Text>
          </View>
        </PressableScale>
      </View>
      <View style={styles.row}>
        <Stat label="Total Strikes" value={count.toLocaleString()} t={t} />
        <View style={[styles.divider, { backgroundColor: t.hairline }]} />
        <Stat label="Daily Target" value={dailyTarget.toLocaleString()} t={t} />
      </View>
      <View style={styles.batchRow}>
        {[10, 25, 100].map((n) => (
          <PressableScale key={n} onPress={() => onStrikeBatch?.(n)} style={[styles.batchBtn, { borderColor: t.hairline }]}>
            <Text style={[Tokens.font.mono, { color: t.textPrimary }]}>+{n}</Text>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

const Stat = ({ label, value, t }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={[Tokens.font.label, { color: t.textTertiary }]}>{label}</Text>
    <Text style={[Tokens.font.h3, { color: t.textPrimary, marginTop: 4 }]}>{value}</Text>
  </View>
);

export default NeuralHammerCounter;

const SIZE = 220;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  ring: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  absRing: { position: 'absolute' },
  progressArc: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.18,
  },
  core: {
    width: SIZE - 36,
    height: SIZE - 36,
    borderRadius: (SIZE - 36) / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', marginTop: Tokens.spacing.lg, alignSelf: 'stretch' },
  divider: { width: 1, marginHorizontal: 12 },
  batchRow: { flexDirection: 'row', marginTop: Tokens.spacing.md, gap: 10 },
  batchBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
    marginHorizontal: 4,
  },
});
