import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { realmForCount, realmProgress } from '../constants/realms';
import { AuthContext } from './auth-context';
import {
  fetchMe,
  patchMe,
  postStrike,
  postAnchor,
  fetchLeaks,
  postLeak,
  postSeal,
} from '../util/http';

const STORAGE_KEY = '@evolveai/voidstate/v1';

export const VoidContext = createContext();

const initialState = {
  hammerCount: 0,
  todayHammerCount: 0,
  lastHammerDate: null,
  streak: 0,
  lastLogDate: null,
  ki: 100,
  shadowLevel: 1,
  leaks: [],
  sessions: [],
  anchorCompletedAt: null,
  practitionerName: 'Practitioner',
  originArtMastery: 0,
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const reducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };
    case 'STRIKE': {
      const today = todayKey();
      const isNewDay = state.lastHammerDate !== today;
      return {
        ...state,
        hammerCount: state.hammerCount + action.amount,
        todayHammerCount: (isNewDay ? 0 : state.todayHammerCount) + action.amount,
        lastHammerDate: today,
        originArtMastery: Math.min(100, state.originArtMastery + action.amount * 0.001),
      };
    }
    case 'LEAK':
      return {
        ...state,
        ki: Math.max(0, state.ki - action.cost),
        leaks: [{ id: action.id || Date.now().toString(), ...action.leak, at: new Date().toISOString() }, ...state.leaks].slice(0, 200),
      };
    case 'SEAL_KI':
      return { ...state, ki: Math.min(100, state.ki + action.amount) };
    case 'SET_KI':
      return { ...state, ki: action.value };
    case 'LOG_DAY': {
      const today = todayKey();
      const continued = state.lastLogDate
        ? Math.round((Date.parse(today) - Date.parse(state.lastLogDate)) / 86400000) === 1
        : false;
      return {
        ...state,
        streak: state.lastLogDate === today ? state.streak : continued ? state.streak + 1 : 1,
        lastLogDate: today,
        sessions: [{ id: Date.now().toString(), date: today, ...action.entry }, ...state.sessions].slice(0, 500),
      };
    }
    case 'SHADOW':
      return { ...state, shadowLevel: action.level };
    case 'COMPLETE_ANCHOR':
      return { ...state, anchorCompletedAt: new Date().toISOString() };
    case 'SET_NAME':
      return { ...state, practitionerName: action.name };
    case 'SYNC_SERVER':
      return {
        ...state,
        hammerCount: action.payload.hammerCount ?? state.hammerCount,
        ki: action.payload.ki ?? state.ki,
        shadowLevel: action.payload.shadowLevel ?? state.shadowLevel,
        anchorCompletedAt: action.payload.anchorCompletedAt ?? state.anchorCompletedAt,
        practitionerName: action.payload.name ?? state.practitionerName,
        leaks: action.payload.leaks ?? state.leaks,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const VoidProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const authCtx = useContext(AuthContext);
  const token = authCtx?.token;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [me, leaks] = await Promise.all([fetchMe(token), fetchLeaks(token)]);
        dispatch({
          type: 'SYNC_SERVER',
          payload: {
            hammerCount: me.hammerCount,
            ki: me.ki,
            shadowLevel: me.shadowLevel,
            anchorCompletedAt: me.anchorCompletedAt,
            name: me.name,
            leaks: leaks.map((l) => ({
              id: l.id,
              category: l.category,
              label: l.label,
              at: l.occurredAt,
            })),
          },
        });
      } catch (e) {
        console.warn('void sync failed', e?.message);
      }
    })();
  }, [token]);

  const strike = (amount = 1) => {
    dispatch({ type: 'STRIKE', amount });
    if (token) postStrike(amount, token).catch(() => {});
  };

  const logLeak = (leak, cost = 5) => {
    dispatch({ type: 'LEAK', leak, cost });
    if (token) postLeak({ ...leak, cost }, token).catch(() => {});
  };

  const sealKi = (amount = 10) => {
    dispatch({ type: 'SEAL_KI', amount });
    if (token) postSeal(amount, token).catch(() => {});
  };

  const logDay = (entry) => dispatch({ type: 'LOG_DAY', entry });

  const setShadow = (level) => {
    dispatch({ type: 'SHADOW', level });
    if (token) patchMe({ shadowLevel: level }, token).catch(() => {});
  };

  const completeAnchor = () => {
    dispatch({ type: 'COMPLETE_ANCHOR' });
    if (token) postAnchor(token).catch(() => {});
  };

  const setName = (name) => {
    dispatch({ type: 'SET_NAME', name });
    if (token) patchMe({ name }, token).catch(() => {});
  };

  const reset = () => dispatch({ type: 'RESET' });

  const realm = realmForCount(state.hammerCount);
  const progress = realmProgress(state.hammerCount);

  return (
    <VoidContext.Provider
      value={{
        state,
        realm,
        progress,
        strike,
        logLeak,
        sealKi,
        logDay,
        setShadow,
        completeAnchor,
        setName,
        reset,
      }}
    >
      {children}
    </VoidContext.Provider>
  );
};

export const useVoid = () => useContext(VoidContext);
