/**
 * Unified Local Storage service (token, user, offline data, sync queue).
 * Use this module instead of AsyncStorage directly for auth and app data.
 *
 * Usage:
 * - getToken / setToken / getUser / setUser / clearSession / setSession → authentication
 * - getOfflineData / setOfflineData / setOfflineDataKey / clearOfflineData → offline data
 * - getSyncQueue / addToSyncQueue / removeFromSyncQueue / clearSyncQueue / hasPendingSync → sync queue
 */
export {
  getToken,
  setToken,
  getUser,
  setUser,
  clearSession,
  setSession,
  getOfflineData,
  setOfflineData,
  setOfflineDataKey,
  clearOfflineData,
  getSyncQueue,
  setSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
  clearSyncQueue,
  hasPendingSync,
} from './storageService';

export { STORAGE_KEYS, OFFLINE_DATA_KEYS } from './constants';

export {
  getSyncQueue as getSyncQueueRaw,
  setSyncQueue as setSyncQueueRaw,
  addToSyncQueue as addToSyncQueueRaw,
  removeFromSyncQueue as removeFromSyncQueueRaw,
  incrementSyncRetry,
} from './syncQueue';
