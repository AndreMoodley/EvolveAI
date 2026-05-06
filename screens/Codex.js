import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { useVoid } from '../store/void-context';
import { PHASES } from '../constants/voidProtocol';
import { ORIGIN_ART, SUPPORT_PROTOCOLS } from '../constants/originArt';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import SectionHeader from '../components/UI/SectionHeader';

const TABS = [
  { id: 'phases', label: 'Phases' },
  { id: 'art', label: 'Origin Art' },
  { id: 'support', label: 'Support' },
];

function Codex({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const voidCtx = useVoid();
  const [tab, setTab] = useState('phases');

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: t.accent }]}>The Void Codex</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>Reference</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
          The complete protocol — phases, the Origin Art, and the support modalities that sustain it.
        </Text>
      </View>

      <View style={[styles.tabs, { borderColor: t.hairline, backgroundColor: t.surface }]}>
        {TABS.map((s) => {
          const active = tab === s.id;
          return (
            <PressableScale
              key={s.id}
              onPress={() => setTab(s.id)}
              style={[
                styles.tab,
                active && { backgroundColor: t.surfaceTop, borderColor: t.accent, borderWidth: 1 },
              ]}
            >
              <Text style={[Tokens.font.h3, { color: active ? t.accent : t.textTertiary, fontSize: 14 }]}>
                {s.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      {tab === 'phases' &&
        PHASES.map((p) => (
          <GradientCard
            key={p.id}
            colors={[t.surfaceTop, t.surface]}
            style={{ marginBottom: Tokens.spacing.md }}
          >
            <View style={styles.row}>
              <View style={[styles.numeralBadge, { borderColor: t.accent }]}>
                <Text style={[Tokens.font.h3, { color: t.accent }]}>{p.numeral}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[Tokens.font.h2, { color: t.textPrimary }]}>{p.title}</Text>
                <Text style={[Tokens.font.label, { color: t.textTertiary, fontSize: 10, marginTop: 2 }]}>
                  {p.subtitle}
                </Text>
              </View>
              <Ionicons name={p.icon} size={22} color={t.accent} />
            </View>
            <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 10, lineHeight: 21 }]}>
              {p.summary}
            </Text>
            <View style={[styles.practiceBox, { borderColor: t.primary, backgroundColor: t.background }]}>
              <Text style={[Tokens.font.label, { color: t.accent, fontSize: 10 }]}>Practice</Text>
              <Text style={[Tokens.font.body, { color: t.textPrimary, marginTop: 4, fontSize: 13 }]}>
                {p.practice}
              </Text>
            </View>
          </GradientCard>
        ))}

      {tab === 'art' && (
        <>
          <GradientCard colors={['#2c0e16', '#0a0408']} glow borderColor={t.accent}>
            <Text style={[Tokens.font.label, { color: t.accent }]}>The Origin Art</Text>
            <Text style={[Tokens.font.title, { color: t.textPrimary, marginTop: 4 }]}>{ORIGIN_ART.name}</Text>
            <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
              {ORIGIN_ART.lineage}
            </Text>
            <View style={[styles.masteryWrap]}>
              <View style={styles.row}>
                <Text style={[Tokens.font.label, { color: t.textTertiary }]}>MASTERY</Text>
                <View style={{ flex: 1 }} />
                <Text style={[Tokens.font.mono, { color: t.accent }]}>
                  {voidCtx.state.originArtMastery.toFixed(1)}%
                </Text>
              </View>
              <View style={[styles.track, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
                <View
                  style={[
                    styles.fill,
                    { backgroundColor: t.accent, width: `${voidCtx.state.originArtMastery}%` },
                  ]}
                />
              </View>
              <Text style={[Tokens.font.body, { color: t.textTertiary, fontSize: 12, marginTop: 6 }]}>
                {voidCtx.state.hammerCount.toLocaleString()} of {ORIGIN_ART.cadence.target.toLocaleString()} annual strikes
              </Text>
            </View>
          </GradientCard>

          <SectionHeader label="Kinematic Rules" title="Four Laws of the Origin Art" />
          {ORIGIN_ART.rules.map((r) => (
            <GradientCard key={r.number} colors={[t.surfaceTop, t.surface]} style={{ marginBottom: Tokens.spacing.md }}>
              <View style={styles.row}>
                <View style={[styles.numeralBadge, { borderColor: t.accent }]}>
                  <Text style={[Tokens.font.h3, { color: t.accent }]}>{r.number}</Text>
                </View>
                <Text style={[Tokens.font.h3, { color: t.textPrimary, marginLeft: 12, flex: 1 }]}>{r.title}</Text>
              </View>
              <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 10, lineHeight: 21 }]}>
                {r.detail}
              </Text>
              <View style={[styles.faultBox, { borderColor: t.error }]}>
                <Ionicons name="warning" size={14} color={t.error} />
                <Text style={[Tokens.font.body, { color: t.error, marginLeft: 8, flex: 1, fontSize: 13 }]}>
                  {r.fault}
                </Text>
              </View>
            </GradientCard>
          ))}
        </>
      )}

      {tab === 'support' &&
        SUPPORT_PROTOCOLS.map((s) => (
          <PressableScale
            key={s.id}
            onPress={() => s.id === 'three-second' && navigation.navigate('ThreeSecondProtocol')}
            style={{ marginBottom: Tokens.spacing.md }}
          >
            <GradientCard colors={[t.surfaceTop, t.surface]}>
              <View style={styles.row}>
                <View style={[styles.iconBubble, { backgroundColor: t.surfaceHi, borderColor: t.accent }]}>
                  <Ionicons name={s.icon} size={20} color={t.accent} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[Tokens.font.h3, { color: t.textPrimary }]}>{s.name}</Text>
                  <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 4 }]}>{s.summary}</Text>
                </View>
                {s.id === 'three-second' && <Ionicons name="chevron-forward" size={20} color={t.textTertiary} />}
              </View>
            </GradientCard>
          </PressableScale>
        ))}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

export default Codex;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg, paddingTop: 64 },
  header: { marginBottom: Tokens.spacing.lg },
  tabs: {
    flexDirection: 'row',
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
    padding: 4,
    marginBottom: Tokens.spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Tokens.radius.pill,
    alignItems: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  numeralBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceBox: {
    marginTop: Tokens.spacing.md,
    padding: 12,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
  },
  masteryWrap: { marginTop: Tokens.spacing.md },
  track: { height: 6, borderRadius: Tokens.radius.pill, overflow: 'hidden', marginTop: 6 },
  fill: { height: '100%', borderRadius: Tokens.radius.pill },
  faultBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Tokens.spacing.md,
    padding: 10,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
  },
});
