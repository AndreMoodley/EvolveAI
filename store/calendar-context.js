import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchVows,
  storeVow,
  updateVow,
  deleteVow,
  storeProgression,
  fetchProgressions,
  updateProgression,
} from '../util/http';
import { AuthContext } from './auth-context';

export const CalendarContext = createContext();

const CalendarContextProvider = ({ children }) => {
  const [vows, setVows] = useState([]);
  const [progressions, setProgressions] = useState({});
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (!authCtx.token || !authCtx.userId) return;
    fetchVows(authCtx.token)
      .then(setVows)
      .catch((e) => console.warn('vows fetch failed', e?.message));
  }, [authCtx.token, authCtx.userId]);

  const addVow = async (vow) => {
    const id = await storeVow(vow, authCtx.token);
    setVows((prev) => [...prev, { ...vow, id }]);
  };

  const updateVowHandler = async (vowId, updatedVow) => {
    await updateVow(vowId, updatedVow, authCtx.token);
    setVows((prev) => prev.map((v) => (v.id === vowId ? { ...v, ...updatedVow } : v)));
  };

  const deleteVowHandler = async (vowId) => {
    await deleteVow(vowId, authCtx.token);
    setVows((prev) => prev.filter((v) => v.id !== vowId));
  };

  const addProgression = async (vowId, progression) => {
    const id = await storeProgression(vowId, progression, authCtx.token);
    setProgressions((prev) => ({
      ...prev,
      [vowId]: [...(prev[vowId] || []), { ...progression, id }],
    }));
  };

  const loadProgressions = async (vowId) => {
    const loaded = await fetchProgressions(vowId, authCtx.token);
    const open = loaded.filter((p) => !p.completedDate);
    const done = loaded.filter((p) => p.completedDate);
    setProgressions((prev) => ({
      ...prev,
      [vowId]: open,
      [`${vowId}_completed`]: done,
    }));
  };

  const completeProgression = async (vowId) => {
    setProgressions((prev) => {
      const open = prev[vowId];
      if (!open || open.length === 0) return prev;
      const last = open[open.length - 1];
      const completed = { ...last, completedDate: new Date().toISOString() };
      updateProgression(vowId, last.id, completed, authCtx.token).catch(() => {});
      return {
        ...prev,
        [vowId]: open.slice(0, -1),
        [`${vowId}_completed`]: [...(prev[`${vowId}_completed`] || []), completed],
      };
    });
  };

  const undoCompletion = async (vowId) => {
    setProgressions((prev) => {
      const completed = prev[`${vowId}_completed`];
      if (!completed || completed.length === 0) return prev;
      const last = completed[completed.length - 1];
      const reopened = { ...last, completedDate: null };
      updateProgression(vowId, last.id, reopened, authCtx.token).catch(() => {});
      return {
        ...prev,
        [`${vowId}_completed`]: completed.slice(0, -1),
        [vowId]: [...(prev[vowId] || []), reopened],
      };
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        vows,
        addVow,
        updateVow: updateVowHandler,
        deleteVow: deleteVowHandler,
        progressions,
        addProgression,
        loadProgressions,
        completeProgression,
        undoCompletion,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContextProvider;
