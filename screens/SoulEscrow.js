import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../lib/api/client';
import { Tokens } from '../constants/styles';

const WAGER_AMOUNTS = [5, 7, 10];

function WagerTile({ amount, selected, onSelect }) {
  return (
    <Pressable
      style={[styles.wagerTile, selected && styles.wagerTileSelected]}
      onPress={() => onSelect(amount)}
    >
      <Text style={[styles.wagerAmount, selected && styles.wagerAmountSelected]}>
        ${amount}
      </Text>
      <Text style={[styles.wagerLabel, selected && styles.wagerLabelSelected]}>
        {amount === 5 ? 'Initiate' : amount === 7 ? 'Committed' : 'Absolute'}
      </Text>
    </Pressable>
  );
}

export default function SoulEscrow({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resolutionDate, setResolutionDate] = useState('');
  const [wagerAmount, setWagerAmount] = useState(7);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) =>
      apiClient.post('/premium/restriction', payload).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.vows() });
      Alert.alert(
        'Heavenly Restriction Sworn',
        `The Void holds $${wagerAmount}. Complete the vow to reclaim it. Break it, and it is forfeit.`,
        [{ text: 'I understand', onPress: () => navigation.goBack() }]
      );
    },
    onError: (err) => {
      Alert.alert('Restriction Failed', err.message ?? 'Could not create Heavenly Restriction');
    },
  });

  function validateDate(dateStr) {
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) && d > new Date();
  }

  function submit() {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Name the restriction.');
      return;
    }
    if (!resolutionDate.trim() || !validateDate(resolutionDate)) {
      Alert.alert('Invalid Date', 'Enter a future date in YYYY-MM-DD format.');
      return;
    }
    Alert.alert(
      'Swear the Heavenly Restriction',
      `$${wagerAmount} will be held by the Void until ${resolutionDate}.\n\nSuccess: the hold releases. Failure: it is captured.\n\nThis cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Swear It',
          style: 'destructive',
          onPress: () =>
            mutation.mutate({
              title: title.trim(),
              description: description.trim(),
              resolutionDate,
              wagerAmount,
            }),
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>HEAVENLY RESTRICTION</Text>
          <Text style={styles.title}>Soul Escrow</Text>
          <Text style={styles.subtitle}>
            Bind real money to a vow. The Void holds it. Break the vow and it is captured. Honour
            it and the hold dissolves.
          </Text>
        </View>

        <View style={styles.warningBanner}>
          <Ionicons name="warning-outline" size={16} color="#c91538" />
          <Text style={styles.warningText}>
            A real payment hold will be created. This is not a simulation.
          </Text>
        </View>

        <Text style={styles.fieldLabel}>RESTRICTION TITLE</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="What are you swearing to?"
          placeholderTextColor="#5a5a7a"
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>CRITERIA (OPTIONAL)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Define exactly what constitutes success or failure."
          placeholderTextColor="#5a5a7a"
          multiline
          style={[styles.input, styles.inputTall]}
          textAlignVertical="top"
        />

        <Text style={styles.fieldLabel}>RESOLUTION DATE (YYYY-MM-DD)</Text>
        <TextInput
          value={resolutionDate}
          onChangeText={setResolutionDate}
          placeholder="2026-06-30"
          placeholderTextColor="#5a5a7a"
          style={styles.input}
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.fieldLabel}>WAGER AMOUNT</Text>
        <View style={styles.wagerRow}>
          {WAGER_AMOUNTS.map((a) => (
            <WagerTile
              key={a}
              amount={a}
              selected={wagerAmount === a}
              onSelect={setWagerAmount}
            />
          ))}
        </View>

        <View style={styles.mechSection}>
          <Text style={styles.mechTitle}>HOW IT WORKS</Text>
          <View style={styles.mechRow}>
            <View style={[styles.mechDot, { backgroundColor: '#5a5aaa' }]} />
            <Text style={styles.mechText}>
              A Stripe payment hold is created — no charge yet
            </Text>
          </View>
          <View style={styles.mechRow}>
            <View style={[styles.mechDot, { backgroundColor: '#50a060' }]} />
            <Text style={styles.mechText}>
              On the resolution date, if you succeed: hold is cancelled, no charge
            </Text>
          </View>
          <View style={styles.mechRow}>
            <View style={[styles.mechDot, { backgroundColor: '#c91538' }]} />
            <Text style={styles.mechText}>
              If you fail: the hold is captured — money is gone
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.submitBtn, mutation.isPending && styles.submitBtnDisabled]}
          onPress={submit}
          disabled={mutation.isPending}
        >
          <Ionicons name="shield-checkmark" size={18} color="#ffffff" />
          <Text style={styles.submitText}>
            {mutation.isPending ? 'SEALING...' : `SWEAR RESTRICTION · $${wagerAmount}`}
          </Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scroll: {
    padding: 20,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#c91538',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#c0b8d0',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6a6a8a',
    marginTop: 10,
    lineHeight: 22,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#2a0410',
    borderWidth: 1,
    borderColor: '#5a1020',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#e06070',
    lineHeight: 20,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#5a5aaa',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#c0b8d0',
    fontSize: 15,
  },
  inputTall: {
    minHeight: 90,
  },
  wagerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  wagerTile: {
    flex: 1,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  wagerTileSelected: {
    borderColor: '#c91538',
    backgroundColor: '#2a0410',
  },
  wagerAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#6a6a8a',
  },
  wagerAmountSelected: {
    color: '#e06070',
  },
  wagerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#4a4a6a',
  },
  wagerLabelSelected: {
    color: '#c05060',
  },
  mechSection: {
    marginTop: 28,
    backgroundColor: '#0e0e18',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  mechTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#5a5a7a',
    marginBottom: 4,
  },
  mechRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  mechDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 5,
  },
  mechText: {
    flex: 1,
    fontSize: 13,
    color: '#8a8aaa',
    lineHeight: 20,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#7a0c1c',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 32,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#ffffff',
  },
});
