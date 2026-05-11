import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { AuthContext } from '../store/auth-context';
import { API_URL } from '../util/http';
import { REALMS } from '../constants/realms';

function getRealmLevel(hammerCount) {
  let level = 1;
  for (const r of REALMS) {
    if (hammerCount >= r.threshold) level = r.level;
  }
  return level;
}

function StatCard({ label, value, icon, t }) {
  return (
    <View style={[styles.statCard, { backgroundColor: t.surface, borderColor: t.hairline }]}>
      <Ionicons name={icon} size={22} color={t.accent} style={{ marginBottom: 6 }} />
      <Text style={[Tokens.font.display, { color: t.textPrimary, fontSize: 26 }]}>{value}</Text>
      <Text style={[Tokens.font.label, { color: t.textTertiary, marginTop: 2 }]}>{label}</Text>
    </View>
  );
}

function PractitionerRow({ item, t }) {
  const realm = getRealmLevel(item.hammerCount);
  const kiPct = Math.max(0, Math.min(100, item.ki));
  return (
    <View style={[styles.row, { backgroundColor: t.surface, borderColor: t.hairline }]}>
      <View style={styles.rowLeft}>
        <View style={[styles.realmBadge, { backgroundColor: t.primary }]}>
          <Text style={[Tokens.font.label, { color: t.textPrimary, fontSize: 10 }]}>R{realm}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[Tokens.font.h3, { color: t.textPrimary }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[Tokens.font.body, { color: t.textTertiary, fontSize: 12 }]} numberOfLines={1}>
            {item.email}
          </Text>
          {item.role === 'ADMIN' && (
            <Text style={[Tokens.font.label, { color: t.accent, fontSize: 9, marginTop: 2 }]}>
              ADMIN
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rowRight}>
        <Text style={[Tokens.font.label, { color: t.textTertiary, fontSize: 10 }]}>STRIKES</Text>
        <Text style={[Tokens.font.h3, { color: t.textPrimary }]}>{item.hammerCount.toLocaleString()}</Text>
        <View style={[styles.kiTrack, { backgroundColor: t.hairline, marginTop: 4 }]}>
          <View
            style={[
              styles.kiFill,
              { width: `${kiPct}%`, backgroundColor: '#7cf6ff' },
            ]}
          />
        </View>
        <Text style={[Tokens.font.label, { color: '#7cf6ff', fontSize: 9, marginTop: 2 }]}>
          KI {item.ki}
        </Text>
      </View>
    </View>
  );
}

export default function AdminScreen() {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const authCtx = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const headers = { Authorization: `Bearer ${authCtx.token}` };

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [statsRes, practitionersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers }),
        axios.get(`${API_URL}/admin/practitioners?limit=100`, { headers }),
      ]);
      setStats(statsRes.data);
      setPractitioners(practitionersRes.data.practitioners);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed to load admin data';
      setError(msg);
      Alert.alert('Admin Error', msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authCtx.token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: t.background }]}>
        <ActivityIndicator size="large" color={t.accent} />
      </View>
    );
  }

  if (error && !stats) {
    return (
      <View style={[styles.center, { backgroundColor: t.background }]}>
        <Ionicons name="warning-outline" size={40} color={t.error || '#ff5b76'} />
        <Text style={[Tokens.font.body, { color: t.textTertiary, marginTop: 12, textAlign: 'center' }]}>
          {error}
        </Text>
      </View>
    );
  }

  const ListHeader = (
    <View style={{ paddingHorizontal: Tokens.spacing.lg }}>
      <Text style={[Tokens.font.label, { color: t.textTertiary, marginTop: Tokens.spacing.xl, marginBottom: Tokens.spacing.md }]}>
        PLATFORM STATS
      </Text>
      <View style={styles.statsRow}>
        <StatCard label="PRACTITIONERS" value={stats?.totalUsers ?? '—'} icon="people-outline" t={t} />
        <StatCard label="SESSIONS" value={stats?.totalSessions ?? '—'} icon="flash-outline" t={t} />
        <StatCard label="STRIKES" value={stats ? (stats.totalStrikes >= 1000 ? `${(stats.totalStrikes / 1000).toFixed(1)}k` : stats.totalStrikes) : '—'} icon="fitness-outline" t={t} />
      </View>
      <View style={[styles.statsRow, { marginTop: Tokens.spacing.sm }]}>
        <StatCard label="VOWS BOUND" value={stats?.totalVows ?? '—'} icon="diamond-outline" t={t} />
        <StatCard label="AVG KI" value={stats ? `${stats.avgKi}%` : '—'} icon="water-outline" t={t} />
        <View style={[styles.statCard, { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
      </View>

      <Text style={[Tokens.font.label, { color: t.textTertiary, marginTop: Tokens.spacing.xl, marginBottom: Tokens.spacing.md }]}>
        ALL PRACTITIONERS ({practitioners.length})
      </Text>
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: t.background }}
      data={practitioners}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PractitionerRow item={item} t={t} />}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{ paddingBottom: Tokens.spacing.xxxl }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={t.accent}
        />
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={[Tokens.font.body, { color: t.textTertiary }]}>No practitioners found.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Tokens.spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Tokens.spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    paddingVertical: Tokens.spacing.md,
    paddingHorizontal: Tokens.spacing.sm,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Tokens.spacing.lg,
    marginBottom: Tokens.spacing.sm,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    padding: Tokens.spacing.md,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    alignItems: 'flex-end',
    minWidth: 72,
  },
  realmBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kiTrack: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  kiFill: {
    height: 4,
    borderRadius: 2,
  },
});
