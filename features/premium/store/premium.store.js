import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INITIAL_STATE = {
  voidCrystalBalance: 0,
  lesserScrolls: 0,
  activeBloodlineId: null,
  activeDomainPackId: null,
  activeFamiliarId: null,
  unlockedBloodlines: [],
  unlockedDomains: [],
  unlockedFamiliars: [],
  entitlements: {},
  restrictionScar: false,
  hasTranscendentSkin: false,
  isCorrupted: false,
  corruptedAt: null,
  lastSyncedAt: null,
};

export const usePremiumStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      syncFromServer: (data) =>
        set({
          voidCrystalBalance: data.voidCrystalBalance ?? get().voidCrystalBalance,
          lesserScrolls: data.lesserScrolls ?? get().lesserScrolls,
          activeBloodlineId: data.activeBloodlineId ?? null,
          activeDomainPackId: data.activeDomainPackId ?? null,
          activeFamiliarId: data.activeFamiliarId ?? null,
          unlockedBloodlines: data.bloodlines ?? get().unlockedBloodlines,
          unlockedDomains: data.domains ?? get().unlockedDomains,
          unlockedFamiliars: data.familiars ?? get().unlockedFamiliars,
          restrictionScar: data.restrictionScar ?? false,
          hasTranscendentSkin: data.hasTranscendentSkin ?? false,
          isCorrupted: !!data.corruptedAt,
          corruptedAt: data.corruptedAt ?? null,
          lastSyncedAt: new Date().toISOString(),
        }),

      setEntitlements: (entitlements) => set({ entitlements }),

      setActiveBloodline: (id) => set({ activeBloodlineId: id }),
      setActiveDomain: (id) => set({ activeDomainPackId: id }),
      setActiveFamiliar: (id) => set({ activeFamiliarId: id }),

      addUnlockedFamiliar: (familiar) =>
        set((state) => ({
          unlockedFamiliars: state.unlockedFamiliars.some((f) => f.id === familiar.id)
            ? state.unlockedFamiliars
            : [...state.unlockedFamiliars, familiar],
        })),

      decrementCrystals: (amount) =>
        set((state) => ({
          voidCrystalBalance: Math.max(0, state.voidCrystalBalance - amount),
        })),

      incrementCrystals: (amount) =>
        set((state) => ({ voidCrystalBalance: state.voidCrystalBalance + amount })),

      hasEntitlement: (entitlementId) => {
        const { entitlements } = get();
        return entitlements[entitlementId]?.isActive === true;
      },

      hasUnlockedBloodline: (lineageKey) => {
        const { unlockedBloodlines } = get();
        return unlockedBloodlines.some((b) => b.lineageKey === lineageKey);
      },

      hasUnlockedDomain: (packKey) => {
        const { unlockedDomains } = get();
        return unlockedDomains.some((d) => d.packKey === packKey);
      },

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'evolveai-premium',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        voidCrystalBalance: state.voidCrystalBalance,
        lesserScrolls: state.lesserScrolls,
        activeBloodlineId: state.activeBloodlineId,
        activeDomainPackId: state.activeDomainPackId,
        activeFamiliarId: state.activeFamiliarId,
        unlockedBloodlines: state.unlockedBloodlines,
        unlockedDomains: state.unlockedDomains,
        unlockedFamiliars: state.unlockedFamiliars,
        restrictionScar: state.restrictionScar,
        hasTranscendentSkin: state.hasTranscendentSkin,
        isCorrupted: state.isCorrupted,
        corruptedAt: state.corruptedAt,
      }),
    }
  )
);
