import { useEffect, useRef } from 'react';
import { useVoid } from '../store/void-context';
import { useCharacter } from '../store/character-context';
import { realmForCount } from '../constants/realms';
import { useCinematic } from './useCinematic';

export function useRealmAscensionWatcher({ enabled = true, onAscend } = {}) {
  const { state } = useVoid();
  const { auraKey } = useCharacter();
  const { render } = useCinematic();
  const previousRealm = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const currentRealm = realmForCount(state.hammerCount).level;
    if (previousRealm.current === null) {
      previousRealm.current = currentRealm;
      return;
    }
    if (currentRealm > previousRealm.current) {
      const fromRealm = previousRealm.current;
      const toRealm = currentRealm;
      previousRealm.current = currentRealm;

      const props = {
        fromRealm,
        toRealm,
        hammerCount: state.hammerCount,
        practitionerName: state.practitionerName ?? 'Practitioner',
        auraKey: auraKey ?? 'crimson',
      };

      onAscend?.(props);
      render('RealmAscension', props).catch(() => {});
    } else {
      previousRealm.current = currentRealm;
    }
  }, [state.hammerCount, enabled]);
}
