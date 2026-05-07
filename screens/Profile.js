import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { useVoid } from '../store/void-context';
import { AuthContext } from '../store/auth-context';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import SectionHeader from '../components/UI/SectionHeader';
import RealmBadge from '../components/UI/RealmBadge';
import KiBar from '../components/UI/KiBar';

function Stat({ label, value, color, t }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[Tokens.font.label, { color: t.textTertiary }]}>{label}</Text>
      <Text style={[Tokens.font.h2, { color: color || t.textPrimary, marginTop: 4 }]}>{value}</Text>
    </View>
  );
}

function Profile({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const t = getTheme(theme);
  const voidCtx = useVoid();
  const { state, realm } = voidCtx;
  const authCtx = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(state.practitionerName || 'Practitioner');

  const reset = () =>
    Alert.alert(
      'Reset Protocol Data',
      'This wipes local strikes, ki, sessions, and shadow state. Vows persist on the server.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: voidCtx.reset },
      ],
    );

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: t.accent }]}>Phase VIII · The Practitioner</Text>
        {editing ? (
          <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.accent }]}>
            <TextInput
              value={name}
              onChangeText={setName}
              autoFocus
              style={[Tokens.font.display, { color: t.textPrimary }]}
              onBlur={() => {
                voidCtx.setName(name.trim() || 'Practitioner');
                setEditing(false);
              }}
              onSubmitEditing={() => {
                voidCtx.setName(name.trim() || 'Practitioner');
                setEditing(false);
              }}
            />
          </View>
        ) : (
          <PressableScale onPress={() => setEditing(true)}>
            <View style={styles.nameRow}>
              <Text style={[Tokens.font.display, { color: t.textPrimary }]}>{state.practitionerName}</Text>
              <Ionicons name="pencil" size={16} color={t.textTertiary} style={{ marginLeft: 10 }} />
            </View>
          </PressableScale>
        )}
      </View>

      <GradientCard colors={[realm.palette[0], realm.palette[1]]} glow borderColor={t.accent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RealmBadge realm={realm} size="lg" />
          <View style={{ flex: 1, marginLeft: Tokens.spacing.lg }}>
            <Text style={[Tokens.font.label, { color: t.accent }]}>Currently Inhabits</Text>
            <Text style={[Tokens.font.h2, { color: t.textPrimary, marginTop: 2 }]}>{realm.name}</Text>
            <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 4, fontSize: 13 }]}>
              {realm.equivalent}
            </Text>
          </View>
        </View>
      </GradientCard>

      <SectionHeader label="Cumulative" title="Practitioner Stats" />
      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <View style={styles.statRow}>
          <Stat label="Total Strikes" value={state.hammerCount.toLocaleString()} t={t} color={t.accent} />
          <Stat label="Today" value={state.todayHammerCount} t={t} />
          <Stat label="Streak" value={`${state.streak}d`} t={t} color={t.jade} />
        </View>
        <View style={[styles.divider, { backgroundColor: t.hairline }]} />
        <View style={styles.statRow}>
          <Stat label="Sessions" value={(state.sessions || []).length} t={t} />
          <Stat label="Leaks" value={(state.leaks || []).length} t={t} color={t.error} />
          <Stat label="Mastery" value={`${state.originArtMastery.toFixed(1)}%`} t={t} color={t.ki} />
        </View>
        <View style={{ marginTop: Tokens.spacing.md }}>
          <KiBar value={state.ki} />
        </View>
      </GradientCard>

      <SectionHeader label="Recent Leaks" title="Audit the Pull" />
      {(state.leaks || []).slice(0, 5).map((l) => (
        <View key={l.id} style={[styles.leakRow, { backgroundColor: t.surface, borderColor: t.hairline }]}>
          <Ionicons name="alert-circle-outline" size={14} color={t.error} />
          <Text style={[Tokens.font.body, { color: t.textSecondary, marginLeft: 8, flex: 1 }]}>{l.label}</Text>
          <Text style={[Tokens.font.label, { color: t.textTertiary, fontSize: 10 }]}>
            {moment(l.at).fromNow()}
          </Text>
        </View>
      ))}
      {(state.leaks || []).length === 0 && (
        <Text style={[Tokens.font.body, { color: t.textTertiary, textAlign: 'center', marginTop: 8 }]}>
          No recorded leaks. Ki seal holds.
        </Text>
      )}

      <SectionHeader label="Ascendance" title="Theme" />
      <View style={styles.themeRow}>
        <PressableScale
          onPress={() => theme !== 'dark' && toggleTheme()}
          style={[
            styles.themeBtn,
            {
              backgroundColor: theme === 'dark' ? t.surfaceHi : t.surface,
              borderColor: theme === 'dark' ? t.accent : t.hairline,
            },
          ]}
        >
          <Ionicons name="moon" size={18} color={theme === 'dark' ? t.accent : t.textTertiary} />
          <Text style={[Tokens.font.h3, { color: theme === 'dark' ? t.textPrimary : t.textTertiary, marginLeft: 8 }]}>
            Void
          </Text>
        </PressableScale>
        <PressableScale
          onPress={() => theme !== 'light' && toggleTheme()}
          style={[
            styles.themeBtn,
            {
              backgroundColor: theme === 'light' ? t.surfaceHi : t.surface,
              borderColor: theme === 'light' ? t.accent : t.hairline,
            },
          ]}
        >
          <Ionicons name="sunny" size={18} color={theme === 'light' ? t.accent : t.textTertiary} />
          <Text style={[Tokens.font.h3, { color: theme === 'light' ? t.textPrimary : t.textTertiary, marginLeft: 8 }]}>
            Ascendant
          </Text>
        </PressableScale>
      </View>

      <SectionHeader label="Danger Zone" title="Reset & Logout" />
      <PressableScale onPress={reset} style={[styles.dangerBtn, { borderColor: t.error }]}>
        <Ionicons name="refresh-circle-outline" size={18} color={t.error} />
        <Text style={[Tokens.font.h3, { color: t.error, marginLeft: 8 }]}>Reset Local Protocol Data</Text>
      </PressableScale>
      <PressableScale onPress={authCtx.logout} style={[styles.dangerBtn, { borderColor: t.hairline, marginTop: 10 }]}>
        <Ionicons name="exit-outline" size={18} color={t.textSecondary} />
        <Text style={[Tokens.font.h3, { color: t.textSecondary, marginLeft: 8 }]}>Log Out</Text>
      </PressableScale>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg, paddingTop: 64 },
  header: { marginBottom: Tokens.spacing.lg },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  field: {
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { height: 1, marginVertical: Tokens.spacing.md },
  leakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    marginBottom: 6,
  },
  themeRow: { flexDirection: 'row', gap: 10 },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
});
