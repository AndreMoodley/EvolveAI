import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '../../../lib/api/client';
import { usePremiumStore } from '../store/premium.store';
import { getEntitlements } from '../services/revenuecat';

export function usePremiumInventory() {
  const syncFromServer = usePremiumStore((s) => s.syncFromServer);
  const setEntitlements = usePremiumStore((s) => s.setEntitlements);

  const query = useQuery({
    queryKey: queryKeys.premium.inventory(),
    queryFn: () => apiClient.get('/premium/inventory').then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      syncFromServer(query.data);
    }
  }, [query.data, syncFromServer]);

  useEffect(() => {
    getEntitlements().then(setEntitlements).catch(() => {});
  }, [setEntitlements]);

  return query;
}

export function useSetActiveInventory() {
  const qc = useQueryClient();
  const store = usePremiumStore();

  return useMutation({
    mutationFn: (updates) =>
      apiClient.patch('/premium/inventory', updates).then((r) => r.data),
    onMutate: (updates) => {
      if (updates.activeBloodlineId !== undefined)
        store.setActiveBloodline(updates.activeBloodlineId);
      if (updates.activeDomainPackId !== undefined)
        store.setActiveDomain(updates.activeDomainPackId);
      if (updates.activeFamiliarId !== undefined)
        store.setActiveFamiliar(updates.activeFamiliarId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.premium.inventory() }),
  });
}

export function useSummonHistory() {
  return useQuery({
    queryKey: queryKeys.premium.summonHistory(),
    queryFn: () => apiClient.get('/premium/summon/history').then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  });
}

export function usePerformSummon() {
  const qc = useQueryClient();
  const addUnlocked = usePremiumStore((s) => s.addUnlockedFamiliar);

  return useMutation({
    mutationFn: (scrollType) =>
      apiClient.post('/premium/summon', { scrollType }).then((r) => r.data),
    onSuccess: (data) => {
      if (data?.familiar) addUnlocked(data.familiar);
      qc.invalidateQueries({ queryKey: queryKeys.premium.summonHistory() });
      qc.invalidateQueries({ queryKey: queryKeys.premium.inventory() });
    },
  });
}

export function useWagers() {
  return useQuery({
    queryKey: ['premium', 'wagers'],
    queryFn: () => apiClient.get('/premium/wagers').then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateWager() {
  const qc = useQueryClient();
  const decrementCrystals = usePremiumStore((s) => s.decrementCrystals);

  return useMutation({
    mutationFn: (payload) =>
      apiClient.post('/premium/wager', payload).then((r) => r.data),
    onSuccess: (_, variables) => {
      decrementCrystals(variables.crystalAmount);
      qc.invalidateQueries({ queryKey: ['premium', 'wagers'] });
      qc.invalidateQueries({ queryKey: queryKeys.premium.inventory() });
    },
  });
}
