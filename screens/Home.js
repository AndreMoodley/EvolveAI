import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { useVoid } from '../store/void-context';
import { realmProgress } from '../constants/realms';
import { KI_LEAKAGE_CATEGORIES, SHADOW_INTENSITIES } from '../constants/voidProtocol';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import KiBar from '../components/UI/KiBar';
import RealmBadge from '../components/UI/RealmBadge';
import SectionHeader from '../components/UI/SectionHeader';

function Home({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const voidCtx = useVoid();
  const { state, realm, progress } = voidCtx;

  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return 'Hour of the Void';
    if (h < 12) return 'Hour of Sharpening';
    if (h < 17) return 'Hour of Strikes';
    if (h < 21) return 'Hour of Distillation';
    return 'Hour of Sealing';
  }, []);

  const todayTarget = 100;
  const todayRatio = Math.min(1, state.todayHammerCount / todayTarget);

  const anchorDoneToday =
    state.anchorCompletedAt &&
    new Date(state.anchorCompletedAt).toDateString() === new Date().toDateString();

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: t.accent }]}>{greeting}</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>
          {state.practitionerName}
        </Text>
        <View style={styles.headerRow}>
          <RealmBadge realm={realm} size="sm" />
          <View style={{ marginLeft: 10 }}>
            <Text style={[Tokens.font.h3, { color: t.textPrimary }]}>{realm.name}</Text>
            <Text style={[Tokens.font.body, { color: t.textTertiary }]}>{realm.equivalent}</Text>
          </View>
        </View>
      </View>

      {!anchorDoneToday && (
        <PressableScale onPress={() => navigation.navigate('TemporalAnchor')}>
          <GradientCard colors={[t.primary, '#0a0408']} glow style={{ marginTop: Tokens.spacing.lg }}>
            <View style={styles.anchorRow}>
              <Animated.View
                style={[
                  styles.anchorOrb,
                  {
                    backgroundColor: t.accent,
                    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.1] }) }],
                  },
                ]}
              />
              <View style={{ flex: 1 }}>
                <Text style={[Tokens.font.label, { color: t.accent }]}>Phase I · Daily</Text>
                <Text style={[Tokens.font.h2, { color: t.textPrimary, marginTop: 2 }]}>
                  Anchor the Day
                </Text>
                <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 4 }]}>
                  Project 30 years forward. Return. Begin.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={t.accent} />
            </View>
          </GradientCard>
        </PressableScale>
      )}

      <SectionHeader label="Phase VI · Neural Hammering" title="Today's Strikes" />
      <PressableScale onPress={() => navigation.navigate('Vows')}>
        <GradientCard colors={[t.surfaceTop, t.surface]}>
          <View style={styles.strikesHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[Tokens.font.display, { color: t.textPrimary }]}>
                {state.todayHammerCount}
                <Text style={[Tokens.font.h2, { color: t.textTertiary }]}> / {todayTarget}</Text>
              </Text>
              <Text style={[Tokens.font.body, { color: t.textTertiary, marginTop: 2 }]}>
                Total: {state.hammerCount.toLocaleString()} strikes
              </Text>
            </View>
            <View style={[styles.streakPill, { backgroundColor: t.surfaceHi, borderColor: t.accent }]}>
              <Ionicons name="flame" size={14} color={t.accent} />
              <Text style={[Tokens.font.mono, { color: t.accent, marginLeft: 6 }]}>{state.streak}d</Text>
            </View>
          </View>
          <View style={[styles.track, { backgroundColor: t.background }]}>
            <View style={[styles.fill, { backgroundColor: t.primaryGlow, width: `${todayRatio * 100}%` }]} />
          </View>
          <View style={styles.strikeButtons}>
            {[1, 5, 25].map((n) => (
              <PressableScale
                key={n}
                onPress={() => voidCtx.strike(n)}
                style={[styles.strikeBtn, { backgroundColor: t.surfaceHi, borderColor: t.primaryHi }]}
              >
                <Text style={[Tokens.font.mono, { color: t.textPrimary }]}>+{n}</Text>
              </PressableScale>
            ))}
            <PressableScale
              onPress={() => navigation.navigate('Vows')}
              style={[styles.strikeBtn, { backgroundColor: t.primary, borderColor: t.primaryGlow, flex: 1 }]}
            >
              <Ionicons name="flash" size={14} color={t.textPrimary} />
              <Text style={[Tokens.font.mono, { color: t.textPrimary, marginLeft: 6 }]}>Open Vow</Text>
            </PressableScale>
          </View>
        </GradientCard>
      </PressableScale>

      <SectionHeader label="Phase III" title="Ki Integrity" />
      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <KiBar value={state.ki} />
        <Text style={[Tokens.font.body, { color: t.textTertiary, marginTop: Tokens.spacing.md }]}>
          Each leak drains Ki. Seal inputs, downregulate the prefrontal cortex, slip into hypofrontality.
        </Text>
        <View style={styles.leakGrid}>
          {KI_LEAKAGE_CATEGORIES.map((leak) => (
            <PressableScale
              key={leak.id}
              onPress={() => voidCtx.logLeak({ category: leak.id, label: leak.label }, 6)}
              style={[styles.leakChip, { backgroundColor: t.surfaceHi, borderColor: t.hairline }]}
            >
              <Ionicons name={leak.icon} size={14} color={t.textSecondary} />
              <Text style={[Tokens.font.body, { color: t.textSecondary, marginLeft: 6, fontSize: 12 }]}>
                {leak.label}
              </Text>
            </PressableScale>
          ))}
        </View>
        <PressableScale onPress={() => voidCtx.sealKi(15)} style={[styles.sealBtn, { borderColor: t.ki }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={t.ki} />
          <Text style={[Tokens.font.h3, { color: t.ki, marginLeft: 8 }]}>Seal · +15 Ki</Text>
        </PressableScale>
      </GradientCard>

      <SectionHeader label="Phase II" title="Shadow Integration" />
      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <Text style={[Tokens.font.body, { color: t.textTertiary }]}>
          The monster is not the enemy. Release on demand. Retract on command.
        </Text>
        <View style={styles.shadowRow}>
          {SHADOW_INTENSITIES.map((s) => {
            const active = state.shadowLevel === s.id;
            return (
              <PressableScale
                key={s.id}
                onPress={() => voidCtx.setShadow(s.id)}
                style={[
                  styles.shadowItem,
                  {
                    backgroundColor: active ? t.primary : t.surfaceHi,
                    borderColor: active ? t.primaryGlow : t.hairline,
                  },
                ]}
              >
                <Text style={[styles.shadowGlyph, { color: active ? t.textPrimary : t.textTertiary }]}>{s.glyph}</Text>
                <Text style={[Tokens.font.label, { color: active ? t.textPrimary : t.textTertiary, marginTop: 4, fontSize: 9 }]}>
                  {s.label}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </GradientCard>

      <SectionHeader label="Realm Progress" title={`To ${progress.next ? progress.next.name : 'Apex'}`} />
      <GradientCard colors={[realm.palette[0], realm.palette[1]]} glow borderColor={t.accent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RealmBadge realm={realm} size="lg" />
          <View style={{ flex: 1, marginLeft: Tokens.spacing.lg }}>
            <Text style={[Tokens.font.label, { color: t.accent }]}>Realm {realm.level}</Text>
            <Text style={[Tokens.font.h2, { color: t.textPrimary }]}>{realm.name}</Text>
            <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 4 }]}>{realm.lore}</Text>
          </View>
        </View>
        {progress.next && (
          <View style={{ marginTop: Tokens.spacing.lg }}>
            <View style={styles.realmTrackRow}>
              <Text style={[Tokens.font.label, { color: t.textTertiary }]}>{progress.into.toLocaleString()}</Text>
              <Text style={[Tokens.font.label, { color: t.textTertiary }]}>{progress.span.toLocaleString()}</Text>
            </View>
            <View style={[styles.track, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <View style={[styles.fill, { backgroundColor: t.accent, width: `${progress.ratio * 100}%` }]} />
            </View>
          </View>
        )}
        <PressableScale
          onPress={() => navigation.navigate('Realms')}
          style={[styles.realmCta, { borderColor: t.accent }]}
        >
          <Text style={[Tokens.font.h3, { color: t.accent }]}>View All Seven Realms</Text>
          <Ionicons name="arrow-forward" size={16} color={t.accent} />
        </PressableScale>
      </GradientCard>

      <SectionHeader label="Support Protocol" title="3-Second Rule" />
      <PressableScale onPress={() => navigation.navigate('ThreeSecondProtocol')}>
        <GradientCard colors={['#1a0408', t.surface]} borderColor={t.primaryGlow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="timer-outline" size={32} color={t.ember} />
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={[Tokens.font.h2, { color: t.textPrimary }]}>Initiate the Countdown</Text>
              <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 4 }]}>
                3 seconds from intention to action — or pay the penalty.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={t.textTertiary} />
          </View>
        </GradientCard>
      </PressableScale>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg, paddingTop: 64 },
  header: { marginBottom: Tokens.spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: Tokens.spacing.md },
  anchorRow: { flexDirection: 'row', alignItems: 'center' },
  anchorOrb: { width: 48, height: 48, borderRadius: 24, marginRight: Tokens.spacing.md },
  strikesHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
  track: { height: 6, borderRadius: Tokens.radius.pill, marginTop: Tokens.spacing.md, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Tokens.radius.pill },
  strikeButtons: { flexDirection: 'row', marginTop: Tokens.spacing.md, gap: 8 },
  strikeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minWidth: 56,
  },
  leakGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Tokens.spacing.md, gap: 6 },
  leakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
  sealBtn: {
    marginTop: Tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1.5,
  },
  shadowRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Tokens.spacing.md },
  shadowItem: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 12,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  shadowGlyph: { fontSize: 22 },
  realmTrackRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  realmCta: {
    marginTop: Tokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
  },
});
