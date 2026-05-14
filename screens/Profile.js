import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { useVoid } from '../store/void-context';
import { AuthContext } from '../store/auth-context';
import { useCharacter } from '../store/character-context';
import { AURA_COLORS } from '../components/Character/SpiritEntity';
import { usePremiumStore } from '../features/premium/store/premium.store';
import { usePremiumInventory } from '../features/premium/hooks/usePremium';
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
  const { auraKey, setAuraKey } = useCharacter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(state.practitionerName || 'Practitioner');

  usePremiumInventory();
  const voidCrystals = usePremiumStore((s) => s.voidCrystalBalance);
  const lesserScrolls = usePremiumStore((s) => s.lesserScrolls);
  const unlockedFamiliars = usePremiumStore((s) => s.unlockedFamiliars);
  const activeFamiliarId = usePremiumStore((s) => s.activeFamiliarId);
  const activeFamiliar = unlockedFamiliars.find((f) => f.id === activeFamiliarId || f.visualKey === activeFamiliarId);

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
            {formatDistanceToNow(new Date(l.at ?? l.occurredAt), { addSuffix: true })}
          </Text>
        </View>
      ))}
      {(state.leaks || []).length === 0 && (
        <Text style={[Tokens.font.body, { color: t.textTertiary, textAlign: 'center', marginTop: 8 }]}>
          No recorded leaks. Ki seal holds.
        </Text>
      )}

      <SectionHeader label="Entity" title="Aura Colour" />
      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <Text style={[Tokens.font.body, { color: t.textTertiary, marginBottom: Tokens.spacing.md }]}>
          The energy signature your void entity radiates.
        </Text>
        <View style={styles.auraRow}>
          {Object.entries(AURA_COLORS).map(([key, { label, sublabel, color }]) => {
            const active = auraKey === key;
            return (
              <PressableScale key={key} onPress={() => setAuraKey(key)} style={styles.auraOption}>
                <View style={[
                  styles.auraSwatch,
                  { borderColor: active ? color : t.hairline, backgroundColor: active ? `${color}18` : t.surfaceHi },
                ]}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: color, shadowColor: color, shadowOpacity: active ? 0.8 : 0.3, shadowRadius: active ? 8 : 3, elevation: active ? 4 : 1 }} />
                </View>
                <Text style={[Tokens.font.label, { color: active ? color : t.textTertiary, marginTop: 6, fontSize: 10 }]}>
                  {label}
                </Text>
                <Text style={[Tokens.font.label, { color: active ? color : t.textTertiary, fontSize: 9, opacity: 0.7 }]}>
                  {sublabel}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </GradientCard>

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

      {authCtx.isAdmin && (
        <>
          <SectionHeader label="System" title="Admin" />
          <PressableScale
            onPress={() => navigation.navigate('Admin')}
            style={[styles.adminBtn, { backgroundColor: t.surfaceHi, borderColor: t.accent }]}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color={t.accent} />
            <Text style={[Tokens.font.h3, { color: t.accent, marginLeft: 8 }]}>Admin Console</Text>
            <Ionicons name="chevron-forward" size={16} color={t.textTertiary} style={{ marginLeft: 'auto' }} />
          </PressableScale>
        </>
      )}

      <SectionHeader label="The Void" title="Premium Inventory" />
      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <View style={styles.statRow}>
          <Stat label="Crystals" value={`${voidCrystals} ◆`} t={t} color={t.accent} />
          <Stat label="Scrolls" value={lesserScrolls} t={t} />
          <Stat label="Familiars" value={unlockedFamiliars.length} t={t} color={t.ki} />
        </View>
        {activeFamiliar && (
          <Text style={[Tokens.font.body, { color: t.textTertiary, marginTop: Tokens.spacing.md }]}>
            Active Familiar: <Text style={{ color: t.textPrimary }}>{activeFamiliar.name}</Text>
          </Text>
        )}
      </GradientCard>
      <PressableScale
        onPress={() => navigation.navigate('SummoningVoid')}
        style={[styles.adminBtn, { backgroundColor: t.surfaceHi, borderColor: '#5a5aaa', marginTop: 10 }]}
      >
        <Ionicons name="sparkles-outline" size={18} color="#7a7acf" />
        <Text style={[Tokens.font.h3, { color: '#7a7acf', marginLeft: 8 }]}>Summoning Void</Text>
        <Ionicons name="chevron-forward" size={16} color={t.textTertiary} style={{ marginLeft: 'auto' }} />
      </PressableScale>
      <PressableScale
        onPress={() => navigation.navigate('Armory')}
        style={[styles.adminBtn, { backgroundColor: t.surfaceHi, borderColor: t.hairline, marginTop: 10 }]}
      >
        <Ionicons name="trophy-outline" size={18} color={t.accent} />
        <Text style={[Tokens.font.h3, { color: t.accent, marginLeft: 8 }]}>The Armory</Text>
        <Ionicons name="chevron-forward" size={16} color={t.textTertiary} style={{ marginLeft: 'auto' }} />
      </PressableScale>

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
  auraRow: { flexDirection: 'row', justifyContent: 'space-between' },
  auraOption: { flex: 1, alignItems: 'center', marginHorizontal: 4 },
  auraSwatch: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Tokens.radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
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
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Tokens.spacing.lg,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
});
