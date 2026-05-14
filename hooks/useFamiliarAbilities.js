import { usePremiumStore } from '../features/premium/store/premium.store';

// Returns the abilityKey for the currently active familiar, or null.
// Server enforces all ability effects — this hook drives UI hints only.
export function useActiveFamiliarAbility() {
  const activeFamiliarId = usePremiumStore((s) => s.activeFamiliarId);
  const unlockedFamiliars = usePremiumStore((s) => s.unlockedFamiliars);

  if (!activeFamiliarId) return null;

  const familiar = unlockedFamiliars.find(
    (f) => f.id === activeFamiliarId || f.visualKey === activeFamiliarId
  );
  return familiar?.abilityKey ?? null;
}

// Returns true if the given abilityKey is currently active.
export function useFamiliarHasAbility(abilityKey) {
  const active = useActiveFamiliarAbility();
  return active === abilityKey;
}

// Returns a descriptor for the active familiar's ability for UI display.
export function useFamiliarAbilityHint() {
  const activeFamiliarId = usePremiumStore((s) => s.activeFamiliarId);
  const unlockedFamiliars = usePremiumStore((s) => s.unlockedFamiliars);

  if (!activeFamiliarId) return null;

  const familiar = unlockedFamiliars.find(
    (f) => f.id === activeFamiliarId || f.visualKey === activeFamiliarId
  );
  if (!familiar) return null;

  return {
    name: familiar.name,
    abilityKey: familiar.abilityKey,
    rarity: familiar.rarity,
  };
}
