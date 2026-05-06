import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { useVoid } from '../store/void-context';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import SectionHeader from '../components/UI/SectionHeader';

const SESSION_TYPES = [
  { id: 'origin', label: 'Origin Art', icon: 'analytics-outline' },
  { id: 'pull', label: 'Pull Day', icon: 'arrow-up-outline' },
  { id: 'push', label: 'Push Day', icon: 'arrow-down-outline' },
  { id: 'core', label: 'Core / Brace', icon: 'shield-outline' },
  { id: 'cardio', label: 'Cardio', icon: 'heart-outline' },
  { id: 'recovery', label: 'NSDR / Float', icon: 'cloud-outline' },
];

function VoidSession({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const voidCtx = useVoid();
  const [type, setType] = useState('origin');
  const [description, setDescription] = useState('');
  const [reps, setReps] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(7);

  const submit = () => {
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Name the session.');
      return;
    }
    voidCtx.logDay({
      type,
      description: description.trim(),
      reps: reps ? parseInt(reps, 10) : 0,
      note: note.trim(),
      rating,
    });
    if (reps) {
      voidCtx.strike(parseInt(reps, 10));
    }
    navigation.goBack();
  };

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: t.accent }]}>Phase IV · Daily Cultivation</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>Log Void Session</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
          Each session is a strike against the wall. Log it; the codex compounds.
        </Text>
      </View>

      <SectionHeader label="Modality" title="What was the work?" />
      <View style={styles.typeGrid}>
        {SESSION_TYPES.map((s) => {
          const active = type === s.id;
          return (
            <PressableScale
              key={s.id}
              onPress={() => setType(s.id)}
              style={[
                styles.typeBtn,
                {
                  backgroundColor: active ? t.surfaceHi : t.surface,
                  borderColor: active ? t.accent : t.hairline,
                },
              ]}
            >
              <Ionicons name={s.icon} size={20} color={active ? t.accent : t.textTertiary} />
              <Text
                style={[
                  Tokens.font.body,
                  { color: active ? t.textPrimary : t.textTertiary, marginTop: 6, fontSize: 12, fontWeight: '700' },
                ]}
              >
                {s.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <SectionHeader label="Description" title="The exact movement" />
      <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.hairline }]}>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. 5x3 strict bar muscle-ups · false grip"
          placeholderTextColor={t.textTertiary}
          style={[Tokens.font.h3, { color: t.textPrimary }]}
        />
      </View>

      <SectionHeader label="Volume" title="Total Strikes" />
      <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.hairline }]}>
        <TextInput
          value={reps}
          onChangeText={(v) => setReps(v.replace(/[^0-9]/g, ''))}
          placeholder="0"
          placeholderTextColor={t.textTertiary}
          keyboardType="number-pad"
          style={[Tokens.font.h3, { color: t.textPrimary }]}
        />
      </View>

      <SectionHeader label="Note" title="Form, sensation, deviation" />
      <View style={[styles.field, styles.fieldTall, { backgroundColor: t.surface, borderColor: t.hairline }]}>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Form integrity. CNS state. Was the shadow released?"
          placeholderTextColor={t.textTertiary}
          multiline
          style={[Tokens.font.body, { color: t.textPrimary, lineHeight: 22, textAlignVertical: 'top' }]}
        />
      </View>

      <SectionHeader label="Quality" title={`Rating · ${rating}/10`} />
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
          const active = n <= rating;
          return (
            <PressableScale
              key={n}
              onPress={() => setRating(n)}
              style={[
                styles.ratingBlock,
                {
                  backgroundColor: active ? t.accent : t.surface,
                  borderColor: active ? t.accent : t.hairline,
                },
              ]}
            >
              <Text style={[Tokens.font.mono, { color: active ? t.background : t.textTertiary }]}>{n}</Text>
            </PressableScale>
          );
        })}
      </View>

      <PressableScale onPress={submit} style={[styles.submit, { backgroundColor: t.primary }]}>
        <Ionicons name="flash" size={18} color={t.textPrimary} />
        <Text style={[Tokens.font.h3, { color: t.textPrimary, marginLeft: 8 }]}>Inscribe Session</Text>
      </PressableScale>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

export default VoidSession;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg, paddingTop: 24 },
  header: { marginBottom: Tokens.spacing.lg },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: {
    width: '31%',
    margin: '1%',
    paddingVertical: 14,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  field: {
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  fieldTall: { minHeight: 100 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between' },
  ratingBlock: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: Tokens.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Tokens.radius.pill,
    marginTop: Tokens.spacing.xl,
  },
});
