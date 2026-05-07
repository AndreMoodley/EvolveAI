import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tokens } from '../../constants/styles';

function GradientCard({ colors = ['#181b27', '#0a0b10'], children, style, glow, borderColor }) {
  const [from, to] = colors;
  return (
    <View style={[styles.outer, glow && styles.glow, style]}>
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.bg, { backgroundColor: to }]}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.diagonal, { backgroundColor: from, opacity: 0.85 }]}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.shine]}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.borderInner, borderColor && { borderColor }]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export default GradientCard;

const styles = StyleSheet.create({
  outer: {
    borderRadius: Tokens.radius.lg,
    overflow: 'hidden',
    backgroundColor: '#10121b',
  },
  glow: {
    shadowColor: '#c91538',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  bg: { borderRadius: Tokens.radius.lg },
  diagonal: {
    borderRadius: Tokens.radius.lg,
    transform: [{ skewY: '-8deg' }, { translateY: -120 }],
  },
  shine: {
    borderRadius: Tokens.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    height: '50%',
    bottom: undefined,
  },
  borderInner: {
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  content: { padding: Tokens.spacing.lg },
});
