import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../constants/styles';
import { TEMPORAL_ANCHOR_SCRIPT } from '../constants/voidProtocol';
import { useTheme } from '../store/theme-context';
import { useVoid } from '../store/void-context';
import PressableScale from '../components/UI/PressableScale';

function TemporalAnchor({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;
  const voidCtx = useVoid();

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(breath, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [step]);

  const orbScale = breath.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.12] });
  const orbOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1] });

  const node = TEMPORAL_ANCHOR_SCRIPT[step];
  const isLast = step === TEMPORAL_ANCHOR_SCRIPT.length - 1;

  const advance = () => {
    if (isLast) {
      voidCtx.completeAnchor();
      navigation.goBack();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.orbWrap}>
        <Animated.View
          style={[
            styles.orb,
            {
              backgroundColor: t.primary,
              shadowColor: t.primaryGlow,
              transform: [{ scale: orbScale }],
              opacity: orbOpacity,
            },
          ]}
        />
        <View style={[styles.orbCore, { backgroundColor: t.background, borderColor: t.accent }]}>
          <Text style={[styles.numeral, { color: t.accent }]}>I</Text>
        </View>
      </View>

      <Animated.View style={[styles.content, { opacity: fade }]}>
        <Text style={[Tokens.font.label, { color: t.accent }]}>The Temporal Anchor</Text>
        <Text style={[Tokens.font.title, { color: t.textPrimary, marginTop: 6, textAlign: 'center' }]}>{node.title}</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 14, textAlign: 'center', lineHeight: 22 }]}>
          {node.body}
        </Text>
      </Animated.View>

      <View style={styles.dots}>
        {TEMPORAL_ANCHOR_SCRIPT.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: i === step ? t.accent : t.hairline }]}
          />
        ))}
      </View>

      <PressableScale onPress={advance} style={[styles.cta, { borderColor: t.accent }]}>
        <Ionicons name={isLast ? 'flame' : 'arrow-forward'} size={18} color={t.accent} />
        <Text style={[Tokens.font.h3, { color: t.accent, marginLeft: 10 }]}>
          {isLast ? 'Open Eyes — Begin' : 'Continue'}
        </Text>
      </PressableScale>
    </View>
  );
}

export default TemporalAnchor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Tokens.spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orbWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  orb: {
    width: 220,
    height: 220,
    borderRadius: 110,
    shadowOpacity: 0.7,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  orbCore: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeral: { fontSize: 38, fontWeight: '900' },
  content: { alignItems: 'center', paddingHorizontal: 12 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1.5,
  },
});
