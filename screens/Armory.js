import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useContext } from 'react';
import AuthContext from '../store/auth-context';
import { useQuery } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../lib/api/client';
import { PremiumGate } from '../features/premium/gates/PremiumGate';
import { Tokens } from '../constants/styles';

function VowTrophyCard({ vow }) {
  const isExpired = new Date(vow.resolutionDate) < new Date();
  const allComplete =
    vow.progressions?.length > 0 &&
    vow.progressions.every((p) => p.completed);

  const statusColor = allComplete ? '#50a060' : isExpired ? '#c91538' : '#6a6a8a';
  const statusLabel = allComplete ? 'COMPLETED' : isExpired ? 'EXPIRED' : 'ACTIVE';

  return (
    <View style={styles.card}>
      <View style={[styles.cardBadge, { backgroundColor: `${statusColor}22`, borderColor: statusColor }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
      </View>
      <Text style={styles.vowTitle}>{vow.title}</Text>
      <Text style={styles.vowMeta}>
        {vow.type.toUpperCase()} VOW ·{' '}
        {new Date(vow.resolutionDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
      {vow.progressions?.length > 0 && (
        <Text style={styles.progressText}>
          {vow.progressions.filter((p) => p.completed).length}/{vow.progressions.length} SEALS BROKEN
        </Text>
      )}
    </View>
  );
}

function VowTrophyGrid({ vows }) {
  return (
    <View style={styles.grid}>
      {vows.map((vow) => (
        <View key={vow.id} style={styles.gridItem}>
          <View style={styles.trophyShrine}>
            <Text style={styles.shrineGlyph}>
              {vow.type === 'major' ? '⬡' : '◆'}
            </Text>
            <Text style={styles.shrineName} numberOfLines={2}>
              {vow.title}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function Armory({ navigation }) {
  const authCtx = useContext(AuthContext);

  const { data: vows = [], isLoading } = useQuery({
    queryKey: queryKeys.vows(),
    queryFn: () => apiClient.get('/vows').then((r) => r.data),
    enabled: !!authCtx.authToken,
  });

  const completedVows = vows.filter((v) =>
    v.progressions?.every((p) => p.completed) && v.progressions?.length > 0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>THE ARMORY</Text>
        <Text style={styles.headerSub}>
          {completedVows.length} SEALS BROKEN · {vows.length} VOWS SWORN
        </Text>
      </View>

      <PremiumGate
        entitlementId="armory_visual"
        unlockPrompt="Transform your completed vows into permanent monuments in the Void."
        fallback={null}
      >
        <View style={styles.premiumSection}>
          <Text style={styles.sectionLabel}>VOW MONUMENTS</Text>
          <VowTrophyGrid vows={completedVows} />
        </View>
      </PremiumGate>

      <Text style={styles.sectionLabel} style={styles.allVowsLabel}>ALL VOWS</Text>
      <FlatList
        data={vows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <VowTrophyCard vow={item} />}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.empty}>No vows sworn. The Void awaits your commitment.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3a',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#c0b8d0',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#6a6a8a',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#5a5aaa',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  allVowsLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#5a5aaa',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  premiumSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3a',
    paddingBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  gridItem: {
    width: '45%',
  },
  trophyShrine: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  shrineGlyph: {
    fontSize: 28,
    color: '#5a5aaa',
  },
  shrineName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c0b8d0',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  vowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#c0b8d0',
    lineHeight: 22,
  },
  vowMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6a6a8a',
    letterSpacing: 0.5,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5a5aaa',
    letterSpacing: 1,
  },
  empty: {
    fontSize: 14,
    color: '#6a6a8a',
    textAlign: 'center',
    paddingVertical: 40,
    lineHeight: 22,
  },
});
