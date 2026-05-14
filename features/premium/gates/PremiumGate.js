import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { usePremiumStore } from '../store/premium.store';

export function PremiumGate({ entitlementId, children, fallback, unlockPrompt }) {
  const hasEntitlement = usePremiumStore((s) => s.hasEntitlement);

  if (hasEntitlement(entitlementId)) {
    return children;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  return <UnlockPrompt entitlementId={entitlementId} prompt={unlockPrompt} />;
}

function UnlockPrompt({ prompt }) {
  return (
    <View style={styles.container}>
      <View style={styles.glowRing} />
      <Text style={styles.lockGlyph}>⬡</Text>
      <Text style={styles.title}>Sealed by the Void</Text>
      {prompt && <Text style={styles.prompt}>{prompt}</Text>}
      <Pressable style={styles.cta} onPress={() => {}}>
        <Text style={styles.ctaText}>Unlock</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#4a4a7a',
    opacity: 0.4,
  },
  lockGlyph: {
    fontSize: 40,
    color: '#5a5aaa',
    opacity: 0.7,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c0b8d0',
    letterSpacing: 1,
  },
  prompt: {
    fontSize: 13,
    color: '#6a6a8a',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 240,
  },
  cta: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5a5aaa',
    backgroundColor: '#1a1a24',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7a7acf',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
