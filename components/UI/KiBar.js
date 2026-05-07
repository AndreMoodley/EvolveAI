import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';

function KiBar({ value = 100, label = 'Ki Integrity', color }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const animated = useRef(new Animated.Value(value)).current;
  const barColor = color || (value > 60 ? t.ki : value > 30 ? t.accent : t.error);

  useEffect(() => {
    Animated.spring(animated, { toValue: value, useNativeDriver: false, friction: 8 }).start();
  }, [value]);

  const width = animated.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View>
      <View style={styles.row}>
        <Text style={[Tokens.font.label, { color: t.textTertiary }]}>{label}</Text>
        <Text style={[Tokens.font.mono, { color: barColor }]}>{Math.round(value)}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: t.surfaceTop }]}>
        <Animated.View style={[styles.fill, { backgroundColor: barColor, width, shadowColor: barColor }]} />
      </View>
    </View>
  );
}

export default KiBar;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  track: {
    height: 8,
    borderRadius: Tokens.radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Tokens.radius.pill,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});
