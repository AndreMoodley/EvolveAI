import axios from 'axios';
import Constants from 'expo-constants';

const fromExtra = Constants?.expoConfig?.extra?.apiUrl;
const fromEnv = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_DEV_URL = 'http://localhost:4000';

export const API_URL = fromExtra || fromEnv || DEFAULT_DEV_URL;

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

function bearer(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function refreshToken(token) {
  const { data } = await client.post('/auth/refresh', null, { headers: bearer(token) });
  return data.token;
}

export async function fetchVows(token) {
  const { data } = await client.get('/vows', { headers: bearer(token) });
  return data.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    type: v.type,
    date: v.resolutionDate,
    startDate: v.startDate,
  }));
}

export async function storeVow(vowData, token) {
  const payload = {
    title: vowData.title,
    description: vowData.description,
    type: vowData.type,
    startDate: vowData.startDate,
    resolutionDate: vowData.date,
  };
  const { data } = await client.post('/vows', payload, { headers: bearer(token) });
  return data.id;
}

export async function updateVow(id, vowData, token) {
  const payload = {
    title: vowData.title,
    description: vowData.description,
    type: vowData.type,
    startDate: vowData.startDate,
    resolutionDate: vowData.date,
  };
  await client.put(`/vows/${id}`, payload, { headers: bearer(token) });
}

export async function deleteVow(id, token) {
  await client.delete(`/vows/${id}`, { headers: bearer(token) });
}

export async function fetchProgressions(vowId, token) {
  const { data } = await client.get(`/vows/${vowId}/progressions`, { headers: bearer(token) });
  return data.map((p) => ({
    id: p.id,
    text: p.text,
    completed: p.completed,
    completedDate: p.completedAt,
  }));
}

export async function storeProgression(vowId, progression, token) {
  const { data } = await client.post(
    `/vows/${vowId}/progressions`,
    { text: progression.text },
    { headers: bearer(token) },
  );
  return data.id;
}

export async function updateProgression(vowId, progressionId, progression, token) {
  await client.put(
    `/vows/${vowId}/progressions/${progressionId}`,
    {
      text: progression.text,
      completed: !!progression.completedDate,
    },
    { headers: bearer(token) },
  );
}

export async function deleteProgression(vowId, progressionId, token) {
  await client.delete(`/vows/${vowId}/progressions/${progressionId}`, { headers: bearer(token) });
}

export async function fetchSessions(token) {
  const { data } = await client.get('/sessions', { headers: bearer(token) });
  return data;
}

export async function storeSession(payload, token) {
  const { data } = await client.post('/sessions', payload, { headers: bearer(token) });
  return data;
}

export async function fetchMe(token) {
  const { data } = await client.get('/practitioner/me', { headers: bearer(token) });
  return data;
}

export async function patchMe(payload, token) {
  const { data } = await client.patch('/practitioner/me', payload, { headers: bearer(token) });
  return data;
}

export async function postStrike(amount, token) {
  const { data } = await client.post(
    '/practitioner/me/strike',
    { amount },
    { headers: bearer(token) },
  );
  return data;
}

export async function postAnchor(token) {
  const { data } = await client.post('/practitioner/me/anchor', null, {
    headers: bearer(token),
  });
  return data;
}

export async function fetchLeaks(token) {
  const { data } = await client.get('/practitioner/me/leaks', { headers: bearer(token) });
  return data;
}

export async function postLeak(leak, token) {
  const { data } = await client.post('/practitioner/me/leaks', leak, {
    headers: bearer(token),
  });
  return data;
}

export async function postSeal(amount, token) {
  const { data } = await client.post(
    '/practitioner/me/seal',
    { amount },
    { headers: bearer(token) },
  );
  return data;
}

export async function renderCinematic(compositionId, inputProps, token) {
  const { data } = await client.post(
    '/cinematics',
    { compositionId, inputProps },
    { headers: bearer(token), timeout: 120000 },
  );
  return { ...data, fullUrl: `${API_URL}${data.url}` };
}
