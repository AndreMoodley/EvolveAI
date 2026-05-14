import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { differenceInDays } from 'date-fns';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { CalendarContext } from '../store/calendar-context';
import { useVoid } from '../store/void-context';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import SectionHeader from '../components/UI/SectionHeader';
import EmptyState from '../components/UI/EmptyState';

function VowCard({ vow, onPress, t, todayCount }) {
  const now = new Date();
  const daysLeft = Math.max(0, differenceInDays(new Date(vow.date), now));
  const totalDays = Math.max(1, differenceInDays(new Date(vow.date), new Date(vow.startDate)));
  const elapsed = Math.min(totalDays, differenceInDays(now, new Date(vow.startDate)));
  const ratio = Math.min(1, elapsed / totalDays);
  const isMajor = vow.type === 'major';
  const accent = isMajor ? t.accent : t.ki;

  return (
    <PressableScale onPress={onPress} style={{ marginBottom: Tokens.spacing.md }}>
      <GradientCard
        colors={isMajor ? ['#2c0e16', '#0a0408'] : [t.surfaceTop, t.surface]}
        glow={isMajor}
        borderColor={accent}
      >
        <View style={styles.row}>
          <View style={styles.glyphBubble}>
            <Ionicons name={isMajor ? 'diamond' : 'leaf-outline'} size={18} color={accent} />
          </View>
          <View style={[styles.tag, { borderColor: accent }]}>
            <Text style={[Tokens.font.label, { color: accent, fontSize: 9 }]}>
              {isMajor ? 'Major Vow' : 'Minor Vow'}
            </Text>
          </View>
        </View>
        <Text style={[Tokens.font.h2, { color: t.textPrimary, marginTop: 12 }]}>{vow.title}</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 4 }]} numberOfLines={2}>
          {vow.description}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="hourglass-outline" size={14} color={t.textTertiary} />
          <Text style={[Tokens.font.mono, { color: t.textTertiary, marginLeft: 6, fontSize: 12 }]}>
            {daysLeft}d remaining
          </Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="flash" size={14} color={accent} />
          <Text style={[Tokens.font.mono, { color: accent, marginLeft: 4, fontSize: 12 }]}>
            +{todayCount} today
          </Text>
        </View>
        <View style={[styles.track, { backgroundColor: 'rgba(0,0,0,0.45)', marginTop: 12 }]}>
          <View style={[styles.fill, { backgroundColor: accent, width: `${ratio * 100}%` }]} />
        </View>
      </GradientCard>
    </PressableScale>
  );
}

function BindingVow({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const calendarCtx = useContext(CalendarContext);
  const voidCtx = useVoid();

  const sorted = useMemo(() => {
    return [...(calendarCtx.vows || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [calendarCtx.vows]);

  const major = sorted.filter((v) => v.type === 'major');
  const minor = sorted.filter((v) => v.type === 'minor');

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: t.accent }]}>Phase VI · Netero Standard</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>Binding Vows</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
          A binding vow is a contract with your nervous system. The greater the stakes, the deeper the
          myelination. Strike daily until the wall cracks.
        </Text>
      </View>

      <PressableScale onPress={() => navigation.navigate('BindingVowForm')}>
        <GradientCard colors={[t.primary, '#0a0408']} glow>
          <View style={styles.row}>
            <Ionicons name="add-circle-outline" size={28} color={t.accent} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[Tokens.font.h3, { color: t.textPrimary }]}>Inscribe a New Vow</Text>
              <Text style={[Tokens.font.body, { color: t.textSecondary, fontSize: 13 }]}>
                Major (≥2 months) or Minor (&lt;2 months)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={t.accent} />
          </View>
        </GradientCard>
      </PressableScale>

      <PressableScale
        onPress={() => navigation.navigate('SoulEscrow')}
        style={{ marginTop: 10 }}
      >
        <GradientCard colors={['#2a0410', '#0a0408']} borderColor="#5a1020">
          <View style={styles.row}>
            <Ionicons name="shield-checkmark-outline" size={28} color="#c91538" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[Tokens.font.h3, { color: t.textPrimary }]}>Heavenly Restriction</Text>
              <Text style={[Tokens.font.body, { color: t.textSecondary, fontSize: 13 }]}>
                Bind real money to a vow. Break it and lose it.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#c91538" />
          </View>
        </GradientCard>
      </PressableScale>

      <SectionHeader label="Long Trial" title="Major Vows" accent={t.accent} />
      {major.length === 0 ? (
        <EmptyState
          icon="diamond-outline"
          title="No Major Vows Inscribed"
          body="Major vows demand at least 2 months of relentless application. Choose carefully."
        />
      ) : (
        major.map((v) => (
          <VowCard
            key={v.id}
            vow={v}
            t={t}
            todayCount={voidCtx.state.todayHammerCount}
            onPress={() => navigation.navigate('VowDetail', { vow: v })}
          />
        ))
      )}

      <SectionHeader label="Short Trial" title="Minor Vows" accent={t.ki} />
      {minor.length === 0 ? (
        <EmptyState
          icon="leaf-outline"
          title="No Minor Vows Inscribed"
          body="Minor vows are sub-2-month sprints. Sharpen a single edge."
        />
      ) : (
        minor.map((v) => (
          <VowCard
            key={v.id}
            vow={v}
            t={t}
            todayCount={voidCtx.state.todayHammerCount}
            onPress={() => navigation.navigate('VowDetail', { vow: v })}
          />
        ))
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

export default BindingVow;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg, paddingTop: 64 },
  header: { marginBottom: Tokens.spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  glyphBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  track: { height: 5, borderRadius: Tokens.radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Tokens.radius.pill },
});
