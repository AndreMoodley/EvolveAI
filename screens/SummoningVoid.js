import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { usePremiumStore } from '../features/premium/store/premium.store';
import { usePerformSummon, useSummonHistory } from '../features/premium/hooks/usePremium';
import { FAMILIARS, RARITY_LABELS, RARITY_COLORS } from '../constants/familiars';

const SCROLL_COST = { lesser: 1, abyssal: 10 };

function RarityBadge({ rarity }) {
  const color = RARITY_COLORS[rarity] ?? '#7a7a9a';
  const label = RARITY_LABELS[rarity] ?? rarity;
  return (
    <View style={[styles.rarityBadge, { borderColor: color }]}>
      <Text style={[styles.rarityText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

function SummonResultModal({ visible, result, onClose }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 40 }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.6);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!result) return null;

  const familiar = FAMILIARS[result.familiar?.visualKey ?? result.familiar?.id];
  const rarityColor = RARITY_COLORS[result.familiar?.rarity] ?? '#7a7a9a';

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalBackdrop}>
        <Animated.View style={[styles.resultCard, { transform: [{ scale }], opacity }]}>
          <View style={[styles.resultGlow, { backgroundColor: `${rarityColor}18`, borderColor: rarityColor }]}>
            <Text style={[styles.resultGlyph, { color: familiar?.color ?? rarityColor }]}>
              {result.isNew ? '✦' : '◈'}
            </Text>
            <Text style={styles.resultName}>{result.familiar?.name}</Text>
            <RarityBadge rarity={result.familiar?.rarity} />
            <Text style={styles.resultDescription}>{result.familiar?.description}</Text>
            {!result.isNew && (
              <Text style={styles.duplicateNote}>Already bound — +15 Void Crystals received</Text>
            )}
          </View>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>SEAL INTO THE VOID</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

function HistoryRow({ item }) {
  const familiar = FAMILIARS[item.familiar?.visualKey ?? item.familiar?.id];
  const color = RARITY_COLORS[item.familiar?.rarity] ?? '#7a7a9a';
  return (
    <View style={styles.historyRow}>
      <View style={[styles.historyDot, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.historyName}>{item.familiar?.name}</Text>
        <Text style={styles.historyMeta}>
          {item.scrollType.toUpperCase()} SCROLL · #{item.pullIndex + 1}
        </Text>
      </View>
      <Text style={[styles.rarityText, { color }]}>
        {(RARITY_LABELS[item.familiar?.rarity] ?? '').toUpperCase()}
      </Text>
    </View>
  );
}

export default function SummoningVoid({ navigation }) {
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const lesserScrolls = usePremiumStore((s) => s.lesserScrolls);
  const voidCrystals = usePremiumStore((s) => s.voidCrystalBalance);

  const summonMutation = usePerformSummon();
  const { data: history = [] } = useSummonHistory();

  const ritualOpacity = useRef(new Animated.Value(1)).current;

  async function handleSummon(scrollType) {
    if (scrollType === 'lesser' && lesserScrolls < 1) return;
    if (scrollType === 'abyssal' && voidCrystals < SCROLL_COST.abyssal) return;

    Animated.sequence([
      Animated.timing(ritualOpacity, { toValue: 0.2, duration: 200, useNativeDriver: true }),
      Animated.timing(ritualOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    try {
      const data = await summonMutation.mutateAsync(scrollType);
      setResult(data);
      setShowModal(true);
    } catch {}
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SUMMONING VOID</Text>
        <Text style={styles.headerSub}>Tear open the Void. Pull what answers.</Text>
      </View>

      <Animated.View style={[styles.ritual, { opacity: ritualOpacity }]}>
        <View style={styles.ritualCircle}>
          <Text style={styles.ritualGlyph}>⬡</Text>
          <Text style={styles.ritualText}>THE VOID PULLS</Text>
        </View>
      </Animated.View>

      <View style={styles.scrollSection}>
        <View style={styles.scrollCard}>
          <Text style={styles.scrollType}>LESSER SCROLL</Text>
          <Text style={styles.scrollDetail}>Wandering · Bound · Rare Ancients</Text>
          <Text style={styles.scrollInventory}>{lesserScrolls} remaining</Text>
          <Pressable
            style={[styles.summonBtn, lesserScrolls < 1 && styles.summonBtnDisabled]}
            onPress={() => handleSummon('lesser')}
            disabled={summonMutation.isPending || lesserScrolls < 1}
          >
            {summonMutation.isPending ? (
              <ActivityIndicator color="#7a7acf" size="small" />
            ) : (
              <Text style={styles.summonBtnText}>SUMMON</Text>
            )}
          </Pressable>
        </View>

        <View style={[styles.scrollCard, styles.abyssalCard]}>
          <Text style={[styles.scrollType, { color: '#9a2a7a' }]}>ABYSSAL SCROLL</Text>
          <Text style={styles.scrollDetail}>All tiers · Higher Ancient rate · Void Heralds</Text>
          <Text style={styles.scrollInventory}>{voidCrystals} ◆ crystals</Text>
          <Pressable
            style={[styles.summonBtn, styles.abyssalBtn, voidCrystals < SCROLL_COST.abyssal && styles.summonBtnDisabled]}
            onPress={() => handleSummon('abyssal')}
            disabled={summonMutation.isPending || voidCrystals < SCROLL_COST.abyssal}
          >
            <Text style={[styles.summonBtnText, { color: '#d060c0' }]}>SUMMON · {SCROLL_COST.abyssal} ◆</Text>
          </Pressable>
        </View>
      </View>

      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historySectionLabel}>PULL HISTORY</Text>
          <FlatList
            data={history.slice(0, 20)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <HistoryRow item={item} />}
            scrollEnabled={false}
          />
        </View>
      )}

      <SummonResultModal
        visible={showModal}
        result={result}
        onClose={() => setShowModal(false)}
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
    fontSize: 13,
    color: '#6a6a8a',
    marginTop: 4,
  },
  ritual: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  ritualCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: '#4a4a7a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ritualGlyph: {
    fontSize: 44,
    color: '#5a5aaa',
  },
  ritualText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#4a4a6a',
  },
  scrollSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  scrollCard: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  abyssalCard: {
    borderColor: '#3a1a3a',
    backgroundColor: '#14081a',
  },
  scrollType: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#5a5aaa',
  },
  scrollDetail: {
    fontSize: 13,
    color: '#6a6a8a',
  },
  scrollInventory: {
    fontSize: 13,
    fontWeight: '700',
    color: '#c0b8d0',
  },
  summonBtn: {
    marginTop: 8,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#5a5aaa',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  abyssalBtn: {
    borderColor: '#8a2a8a',
    backgroundColor: '#1a0a2a',
  },
  summonBtnDisabled: {
    opacity: 0.4,
  },
  summonBtnText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#7a7acf',
  },
  historySection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  historySectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#5a5aaa',
    marginBottom: 12,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a24',
    gap: 12,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c0b8d0',
  },
  historyMeta: {
    fontSize: 11,
    color: '#6a6a8a',
    letterSpacing: 0.5,
  },
  rarityBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000090',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#0e0e18',
    borderRadius: 20,
    padding: 24,
    gap: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  resultGlow: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  resultGlyph: {
    fontSize: 52,
  },
  resultName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#c0b8d0',
    letterSpacing: 1,
  },
  resultDescription: {
    fontSize: 14,
    color: '#8a8aaa',
    textAlign: 'center',
    lineHeight: 22,
  },
  duplicateNote: {
    fontSize: 12,
    color: '#5a5aaa',
    fontStyle: 'italic',
  },
  closeBtn: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#4a4a7a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#7a7acf',
  },
});
