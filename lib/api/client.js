import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

function resolveBaseUrl() {
  const configured = Constants.expoConfig?.extra?.apiUrl;
  if (configured) return configured;
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : 'http://localhost:4000';
}

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach stored token on every request
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error responses into a consistent shape
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    const status = error.response?.status ?? 0;
    const normalized = new Error(message);
    normalized.status = status;
    normalized.raw = error;
    return Promise.reject(normalized);
  }
);

// Query key factories — centralized to avoid string typos
export const queryKeys = {
  practitioner: () => ['practitioner'],
  sessions: () => ['sessions'],
  sessionList: (filters) => ['sessions', filters],
  vows: () => ['vows'],
  vowDetail: (id) => ['vows', id],
  leaks: () => ['leaks'],
  premium: {
    inventory: () => ['premium', 'inventory'],
    familiars: () => ['premium', 'familiars'],
    summonHistory: () => ['premium', 'summon-history'],
  },
};
