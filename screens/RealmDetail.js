import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { useVoid } from '../store/void-context';
import GradientCard from '../components/UI/GradientCard';
import RealmBadge from '../components/UI/RealmBadge';
import SectionHeader from '../components/UI/SectionHeader';

function RealmDetail({ route }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const { realm } = route.params;
  const { state } = useVoid();
  const reached = state.hammerCount >= realm.threshold;

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <GradientCard colors={[realm.palette[0], realm.palette[1]]} glow borderColor={t.accent}>
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <RealmBadge realm={realm} size="lg" />
          <Text style={[Tokens.font.label, { color: t.accent, marginTop: 14 }]}>Realm {realm.level}</Text>
          <Text style={[Tokens.font.title, { color: t.textPrimary, marginTop: 4, textAlign: 'center' }]}>
            {realm.name}
          </Text>
          <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 6, textAlign: 'center' }]}>
            {realm.equivalent}
          </Text>
        </View>
      </GradientCard>

      <SectionHeader label="Markers" title="Physiological & Biomechanical" />
      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <Text style={[Tokens.font.body, { color: t.textPrimary, lineHeight: 22 }]}>{realm.markers}</Text>
      </GradientCard>

      <SectionHeader label="Lore" title="Narrative Equivalent" />
      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <Text style={[Tokens.font.body, { color: t.textPrimary, lineHeight: 22 }]}>{realm.lore}</Text>
      </GradientCard>

      <SectionHeader label="Threshold" title="Strike Requirements" />
      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <View style={styles.thresholdRow}>
          <View style={{ flex: 1 }}>
            <Text style={[Tokens.font.label, { color: t.textTertiary }]}>Entry</Text>
            <Text style={[Tokens.font.h2, { color: t.textPrimary, marginTop: 4 }]}>
              {realm.threshold.toLocaleString()}
            </Text>
          </View>
          {realm.nextThreshold && (
            <>
              <Ionicons name="arrow-forward" size={18} color={t.textTertiary} />
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[Tokens.font.label, { color: t.textTertiary }]}>Next</Text>
                <Text style={[Tokens.font.h2, { color: t.accent, marginTop: 4 }]}>
                  {realm.nextThreshold.toLocaleString()}
                </Text>
              </View>
            </>
          )}
        </View>
        <View style={[styles.statusPill, { borderColor: reached ? t.accent : t.hairline }]}>
          <Ionicons
            name={reached ? 'checkmark-circle' : 'lock-closed-outline'}
            size={14}
            color={reached ? t.accent : t.textTertiary}
          />
          <Text
            style={[
              Tokens.font.label,
              { color: reached ? t.accent : t.textTertiary, marginLeft: 6 },
            ]}
          >
            {reached ? 'Threshold reached' : 'Locked — keep striking'}
          </Text>
        </View>
      </GradientCard>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

export default RealmDetail;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
    marginTop: Tokens.spacing.md,
  },
});
