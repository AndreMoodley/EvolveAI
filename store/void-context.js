import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { realmForCount, realmProgress } from '../constants/realms';

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
  oneRepetitionLog: [],
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
      const next = {
        ...state,
        hammerCount: state.hammerCount + action.amount,
        todayHammerCount: (isNewDay ? 0 : state.todayHammerCount) + action.amount,
        lastHammerDate: today,
        originArtMastery: Math.min(100, state.originArtMastery + action.amount * 0.001),
      };
      return next;
    }
    case 'LEAK':
      return {
        ...state,
        ki: Math.max(0, state.ki - action.cost),
        leaks: [{ id: Date.now().toString(), ...action.leak, at: new Date().toISOString() }, ...state.leaks].slice(0, 200),
      };
    case 'SEAL_KI':
      return { ...state, ki: Math.min(100, state.ki + action.amount) };
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
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const VoidProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const realm = realmForCount(state.hammerCount);
  const progress = realmProgress(state.hammerCount);

  const api = {
    state,
    realm,
    progress,
    strike: (amount = 1) => dispatch({ type: 'STRIKE', amount }),
    logLeak: (leak, cost = 5) => dispatch({ type: 'LEAK', leak, cost }),
    sealKi: (amount = 10) => dispatch({ type: 'SEAL_KI', amount }),
    logDay: (entry) => dispatch({ type: 'LOG_DAY', entry }),
    setShadow: (level) => dispatch({ type: 'SHADOW', level }),
    completeAnchor: () => dispatch({ type: 'COMPLETE_ANCHOR' }),
    setName: (name) => dispatch({ type: 'SET_NAME', name }),
    reset: () => dispatch({ type: 'RESET' }),
  };

  return <VoidContext.Provider value={api}>{children}</VoidContext.Provider>;
};

export const useVoid = () => useContext(VoidContext);
