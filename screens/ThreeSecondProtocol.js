import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import SectionHeader from '../components/UI/SectionHeader';

const STAGES = {
  IDLE: 'idle',
  COUNTING: 'counting',
  PASSED: 'passed',
  FAILED: 'failed',
};

function ThreeSecondProtocol({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const [intent, setIntent] = useState('');
  const [stage, setStage] = useState(STAGES.IDLE);
  const [count, setCount] = useState(3);
  const ring = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const begin = () => {
    if (!intent.trim()) return;
    setStage(STAGES.COUNTING);
    setCount(3);
    ring.setValue(0);
    Animated.timing(ring, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ).start();
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current);
          setStage(STAGES.FAILED);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const executed = () => {
    clearInterval(intervalRef.current);
    setStage(STAGES.PASSED);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setStage(STAGES.IDLE);
    setIntent('');
    setCount(3);
    ring.setValue(0);
    pulse.setValue(0);
  };

  const ringColor =
    stage === STAGES.PASSED ? t.jade : stage === STAGES.FAILED ? t.error : t.ember;

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: t.ember }]}>Support Protocol</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>3-Second Rule</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
          Bypass the amygdala. Three seconds from intention to action — or pay the predetermined price.
        </Text>
      </View>

      <View style={styles.center}>
        <View style={styles.ringWrap}>
          <Animated.View
            style={[
              styles.ringGlow,
              {
                backgroundColor: ringColor,
                opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.45] }),
                transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }],
              },
            ]}
          />
          <View style={[styles.ring, { borderColor: t.hairline, backgroundColor: t.surface }]}>
            <Animated.View
              style={[
                styles.ringFill,
                {
                  backgroundColor: ringColor,
                  height: ring.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  opacity: 0.18,
                },
              ]}
            />
            <Text style={[styles.bigCount, { color: ringColor }]}>
              {stage === STAGES.PASSED ? '✓' : stage === STAGES.FAILED ? '✕' : count}
            </Text>
            <Text style={[Tokens.font.label, { color: t.textTertiary, marginTop: 4 }]}>
              {stage === STAGES.IDLE && 'READY'}
              {stage === STAGES.COUNTING && 'EXECUTE NOW'}
              {stage === STAGES.PASSED && 'PASSED'}
              {stage === STAGES.FAILED && 'PAY THE PRICE'}
            </Text>
          </View>
        </View>
      </View>

      {stage === STAGES.IDLE && (
        <>
          <SectionHeader label="State Your Intent" title="What is the action?" />
          <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.hairline }]}>
            <TextInput
              value={intent}
              onChangeText={setIntent}
              placeholder="e.g. Stand up. Begin warm-up. Go cold shower."
              placeholderTextColor={t.textTertiary}
              style={[Tokens.font.h3, { color: t.textPrimary }]}
              onSubmitEditing={begin}
              returnKeyType="go"
            />
          </View>
          <PressableScale onPress={begin} style={[styles.cta, { backgroundColor: t.ember }]}>
            <Ionicons name="timer" size={18} color={t.background} />
            <Text style={[Tokens.font.h3, { color: t.background, marginLeft: 8 }]}>Initiate Countdown</Text>
          </PressableScale>
        </>
      )}

      {stage === STAGES.COUNTING && (
        <>
          <GradientCard colors={[t.surfaceTop, t.surface]} borderColor={t.ember}>
            <Text style={[Tokens.font.label, { color: t.ember }]}>EXECUTE</Text>
            <Text style={[Tokens.font.h2, { color: t.textPrimary, marginTop: 4 }]}>{intent}</Text>
          </GradientCard>
          <PressableScale onPress={executed} style={[styles.cta, { backgroundColor: t.jade }]}>
            <Ionicons name="checkmark-circle" size={20} color={t.background} />
            <Text style={[Tokens.font.h3, { color: t.background, marginLeft: 8 }]}>I Acted</Text>
          </PressableScale>
        </>
      )}

      {stage === STAGES.PASSED && (
        <>
          <GradientCard colors={['#0e2519', t.surface]} borderColor={t.jade}>
            <Text style={[Tokens.font.label, { color: t.jade }]}>FRICTION ELIMINATED</Text>
            <Text style={[Tokens.font.h2, { color: t.textPrimary, marginTop: 4 }]}>
              Action met intention.
            </Text>
            <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8 }]}>
              The reflex is being conditioned. Hesitation cost goes up, action cost goes down.
            </Text>
          </GradientCard>
          <PressableScale onPress={reset} style={[styles.cta, { backgroundColor: t.primary }]}>
            <Ionicons name="refresh" size={18} color={t.textPrimary} />
            <Text style={[Tokens.font.h3, { color: t.textPrimary, marginLeft: 8 }]}>Run Again</Text>
          </PressableScale>
        </>
      )}

      {stage === STAGES.FAILED && (
        <>
          <GradientCard colors={['#290612', t.surface]} borderColor={t.error}>
            <Text style={[Tokens.font.label, { color: t.error }]}>PENALTY DUE</Text>
            <Text style={[Tokens.font.h2, { color: t.textPrimary, marginTop: 4 }]}>
              The cage hesitated. The body pays.
            </Text>
            <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8 }]}>
              Predetermined penalty: 10 strict handstand-pushups. Or replace with your own. Execute it before reset.
            </Text>
          </GradientCard>
          <PressableScale onPress={reset} style={[styles.cta, { backgroundColor: t.error }]}>
            <Ionicons name="alert-circle" size={18} color={t.textPrimary} />
            <Text style={[Tokens.font.h3, { color: t.textPrimary, marginLeft: 8 }]}>Penalty Served</Text>
          </PressableScale>
        </>
      )}

      <View style={{ height: 24 }} />
    </View>
  );
}

export default ThreeSecondProtocol;

const styles = StyleSheet.create({
  container: { flex: 1, padding: Tokens.spacing.lg, paddingTop: 64 },
  header: { marginBottom: Tokens.spacing.lg },
  center: { alignItems: 'center', marginVertical: Tokens.spacing.xl },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  ringGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  ring: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ringFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bigCount: { fontSize: 96, fontWeight: '900', letterSpacing: -2 },
  field: {
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Tokens.radius.pill,
    marginTop: Tokens.spacing.lg,
  },
});
