import React, { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { CalendarContext } from '../store/calendar-context';
import { useVoid } from '../store/void-context';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import SectionHeader from '../components/UI/SectionHeader';
import NeuralHammerCounter from '../components/UI/NeuralHammerCounter';

function VowDetail({ route }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const { vow } = route.params;
  const { progressions, addProgression, completeProgression, undoCompletion, loadProgressions } =
    useContext(CalendarContext);
  const voidCtx = useVoid();
  const [newProgression, setNewProgression] = useState('');

  useEffect(() => {
    loadProgressions(vow.id);
  }, []);

  const current = progressions[vow.id] || [];
  const completed = progressions[`${vow.id}_completed`] || [];

  const daysLeft = Math.max(0, moment(vow.date).diff(moment(), 'days'));
  const totalDays = Math.max(1, moment(vow.date).diff(moment(vow.startDate), 'days'));
  const elapsed = Math.min(totalDays, moment().diff(moment(vow.startDate), 'days'));
  const ratio = Math.min(1, elapsed / totalDays);
  const isMajor = vow.type === 'major';
  const accent = isMajor ? t.accent : t.ki;

  const handleAdd = async () => {
    if (!newProgression.trim()) return;
    await addProgression(vow.id, { text: newProgression.trim(), completed: false });
    setNewProgression('');
  };

  const confirm = (msg, onOk) =>
    Alert.alert('Confirm', msg, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: onOk },
    ]);

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <GradientCard
        colors={isMajor ? ['#2c0e16', '#0a0408'] : [t.surfaceTop, t.surface]}
        glow={isMajor}
        borderColor={accent}
      >
        <View style={styles.row}>
          <View style={[styles.tag, { borderColor: accent }]}>
            <Ionicons name={isMajor ? 'diamond' : 'leaf-outline'} size={11} color={accent} />
            <Text style={[Tokens.font.label, { color: accent, marginLeft: 4, fontSize: 9 }]}>
              {isMajor ? 'Major Vow' : 'Minor Vow'}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
          <Text style={[Tokens.font.mono, { color: accent }]}>{daysLeft}d left</Text>
        </View>
        <Text style={[Tokens.font.title, { color: t.textPrimary, marginTop: 12 }]}>{vow.title}</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
          {vow.description}
        </Text>
        <View style={[styles.track, { backgroundColor: 'rgba(0,0,0,0.55)', marginTop: 16 }]}>
          <View style={[styles.fill, { backgroundColor: accent, width: `${ratio * 100}%` }]} />
        </View>
        <View style={styles.row}>
          <Text style={[Tokens.font.label, { color: t.textTertiary, marginTop: 6 }]}>
            {moment(vow.startDate).format('MMM D')}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[Tokens.font.label, { color: accent, marginTop: 6 }]}>
            {moment(vow.date).format('MMM D, YYYY')}
          </Text>
        </View>
      </GradientCard>

      <SectionHeader label="Phase VI" title="Neural Hammering" accent={accent} />
      <GradientCard colors={[t.surfaceTop, t.surface]} borderColor={accent}>
        <NeuralHammerCounter
          count={voidCtx.state.hammerCount}
          todayCount={voidCtx.state.todayHammerCount}
          dailyTarget={isMajor ? 100 : 50}
          onStrike={() => voidCtx.strike(1)}
          onStrikeBatch={(n) => voidCtx.strike(n)}
        />
      </GradientCard>

      <SectionHeader label="Active" title="Progressions" />
      <View style={styles.inputRow}>
        <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.hairline, flex: 1 }]}>
          <TextInput
            value={newProgression}
            onChangeText={setNewProgression}
            placeholder="Add a progression milestone"
            placeholderTextColor={t.textTertiary}
            style={[Tokens.font.body, { color: t.textPrimary }]}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
        </View>
        <PressableScale onPress={handleAdd} style={[styles.addBtn, { backgroundColor: accent }]}>
          <Ionicons name="add" size={20} color={t.background} />
        </PressableScale>
      </View>

      {current.length === 0 ? (
        <Text style={[Tokens.font.body, { color: t.textTertiary, marginTop: 12, textAlign: 'center' }]}>
          No active progressions. Each strike compounds — define the next one.
        </Text>
      ) : (
        current.map((p, i) => (
          <View key={p.id || i} style={[styles.progressionRow, { backgroundColor: t.surface, borderColor: t.hairline }]}>
            <View style={[styles.progressionDot, { backgroundColor: accent }]} />
            <Text style={[Tokens.font.body, { color: t.textPrimary, flex: 1, marginLeft: 10 }]}>{p.text}</Text>
          </View>
        ))
      )}

      {current.length > 0 && (
        <PressableScale
          onPress={() =>
            confirm('Mark the most recent progression as conquered?', () => completeProgression(vow.id))
          }
          style={[styles.actionBtn, { backgroundColor: accent }]}
        >
          <Ionicons name="checkmark-circle" size={18} color={t.background} />
          <Text style={[Tokens.font.h3, { color: t.background, marginLeft: 8 }]}>Conquer Last Progression</Text>
        </PressableScale>
      )}

      {completed.length > 0 && (
        <>
          <SectionHeader label="Conquered" title={`${completed.length} milestones broken`} />
          {completed.map((p, i) => (
            <View
              key={p.id || i}
              style={[styles.progressionRow, { backgroundColor: t.surface, borderColor: t.hairline, opacity: 0.7 }]}
            >
              <Ionicons name="checkmark-circle" size={16} color={t.jade} />
              <Text style={[Tokens.font.body, { color: t.textSecondary, flex: 1, marginLeft: 10, textDecorationLine: 'line-through' }]}>
                {p.text}
              </Text>
              {p.completedDate && (
                <Text style={[Tokens.font.label, { color: t.textTertiary, fontSize: 10 }]}>
                  {moment(p.completedDate).format('MMM D')}
                </Text>
              )}
            </View>
          ))}
          <PressableScale
            onPress={() =>
              confirm('Undo the most recent conquest?', () => undoCompletion(vow.id))
            }
            style={[styles.actionBtn, { backgroundColor: 'transparent', borderColor: t.hairline, borderWidth: 1 }]}
          >
            <Ionicons name="arrow-undo" size={16} color={t.textSecondary} />
            <Text style={[Tokens.font.h3, { color: t.textSecondary, marginLeft: 8 }]}>Undo Last</Text>
          </PressableScale>
        </>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

export default VowDetail;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
  track: { height: 6, borderRadius: Tokens.radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Tokens.radius.pill },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  field: {
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  addBtn: {
    width: 48,
    height: 48,
    marginLeft: 8,
    borderRadius: Tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    marginTop: 8,
  },
  progressionDot: { width: 8, height: 8, borderRadius: 4 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Tokens.radius.pill,
    marginTop: Tokens.spacing.lg,
  },
});
