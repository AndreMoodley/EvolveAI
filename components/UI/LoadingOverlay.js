import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';

function LoadingOverlay({ message = 'Entering the Void' }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2200, easing: Easing.linear, useNativeDriver: true }),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.05] });

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <Animated.View
        style={[
          styles.orb,
          { backgroundColor: t.primary, shadowColor: t.primaryGlow, transform: [{ scale }] },
        ]}
      />
      <Animated.View style={[styles.ring, { borderColor: t.accent, transform: [{ rotate }] }]} />
      <Text style={[Tokens.font.label, { color: t.accent, marginTop: 36 }]}>EvolveAI</Text>
      <Text style={[Tokens.font.h3, { color: t.textPrimary, marginTop: 6 }]}>{message}</Text>
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  orb: {
    width: 96,
    height: 96,
    borderRadius: 48,
    shadowOpacity: 0.7,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
  },
  ring: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1.5,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
