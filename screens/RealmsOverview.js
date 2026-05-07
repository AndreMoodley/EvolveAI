import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../constants/styles';
import { REALMS } from '../constants/realms';
import { useTheme } from '../store/theme-context';
import { useVoid } from '../store/void-context';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import RealmBadge from '../components/UI/RealmBadge';
import SectionHeader from '../components/UI/SectionHeader';

function RealmsOverview({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const { state, realm: currentRealm, progress } = useVoid();

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: t.accent }]}>Phase V</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>
          The Seven Realms
        </Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
          A measurable ladder. Each realm is filtered by friction the realm below cannot tolerate. The strike count
          determines what reveals itself.
        </Text>
      </View>

      <SectionHeader label="Currently" title={currentRealm.name} />
      <GradientCard colors={[currentRealm.palette[0], currentRealm.palette[1]]} glow borderColor={t.accent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RealmBadge realm={currentRealm} size="lg" />
          <View style={{ flex: 1, marginLeft: Tokens.spacing.lg }}>
            <Text style={[Tokens.font.label, { color: t.accent }]}>Realm {currentRealm.level}</Text>
            <Text style={[Tokens.font.h2, { color: t.textPrimary }]}>{currentRealm.name}</Text>
            <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 4 }]}>
              {state.hammerCount.toLocaleString()} strikes inscribed
            </Text>
          </View>
        </View>
        {progress.next && (
          <View style={{ marginTop: Tokens.spacing.md }}>
            <View style={styles.row}>
              <Text style={[Tokens.font.label, { color: t.textTertiary }]}>To {progress.next.name}</Text>
              <Text style={[Tokens.font.mono, { color: t.accent }]}>
                {Math.round(progress.ratio * 100)}%
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
              <View style={[styles.fill, { backgroundColor: t.accent, width: `${progress.ratio * 100}%` }]} />
            </View>
          </View>
        )}
      </GradientCard>

      <SectionHeader label="Ladder" title="All Seven Realms" />
      {REALMS.map((r) => {
        const reached = state.hammerCount >= r.threshold;
        const isCurrent = r.level === currentRealm.level;
        return (
          <PressableScale
            key={r.level}
            onPress={() => navigation.navigate('RealmDetail', { realm: r })}
            style={{ marginBottom: Tokens.spacing.md }}
          >
            <GradientCard
              colors={isCurrent ? [r.palette[0], r.palette[1]] : [t.surface, t.background]}
              glow={isCurrent}
              borderColor={isCurrent ? t.accent : reached ? t.primary : t.hairline}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RealmBadge realm={r} />
                <View style={{ flex: 1, marginLeft: Tokens.spacing.md }}>
                  <View style={styles.row}>
                    <Text style={[Tokens.font.label, { color: isCurrent ? t.accent : t.textTertiary }]}>
                      Realm {r.level}
                    </Text>
                    {reached && (
                      <View style={[styles.tag, { borderColor: isCurrent ? t.accent : t.primary }]}>
                        <Ionicons
                          name={isCurrent ? 'eye' : 'checkmark'}
                          size={11}
                          color={isCurrent ? t.accent : t.primary}
                        />
                        <Text
                          style={[
                            Tokens.font.label,
                            { color: isCurrent ? t.accent : t.primary, marginLeft: 4, fontSize: 10 },
                          ]}
                        >
                          {isCurrent ? 'You are here' : 'Cleared'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[Tokens.font.h3, { color: t.textPrimary, marginTop: 2 }]}>{r.name}</Text>
                  <Text style={[Tokens.font.body, { color: t.textTertiary, marginTop: 4, fontSize: 13 }]}>
                    {r.markers}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={t.textTertiary} />
              </View>
            </GradientCard>
          </PressableScale>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

export default RealmsOverview;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg, paddingTop: 64 },
  header: { marginBottom: Tokens.spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  track: { height: 6, borderRadius: Tokens.radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Tokens.radius.pill },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
});
