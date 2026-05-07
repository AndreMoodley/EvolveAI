import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@evolveai/character/v1';

const CharacterContext = createContext({ auraKey: 'ki', setAuraKey: () => {} });

export function CharacterProvider({ children }) {
  const [auraKey, setAuraKeyLocal] = useState('ki');

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => { if (v) setAuraKeyLocal(v); })
      .catch(() => {});
  }, []);

  const setAuraKey = (key) => {
    setAuraKeyLocal(key);
    AsyncStorage.setItem(KEY, key).catch(() => {});
  };

  return (
    <CharacterContext.Provider value={{ auraKey, setAuraKey }}>
      {children}
    </CharacterContext.Provider>
  );
}

export const useCharacter = () => useContext(CharacterContext);
