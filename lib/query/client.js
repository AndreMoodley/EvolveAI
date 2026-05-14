import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes before background refetch
      gcTime: 1000 * 60 * 30,           // 30 minutes cache retention
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
    mutations: {
      retry: 0,
    },
  },
});

// Persists query cache to AsyncStorage for offline-first experience
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'EVOLVEAI_QUERY_CACHE',
  throttleTime: 1000,
});
