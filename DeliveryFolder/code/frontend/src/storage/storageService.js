import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';
import {
  getSyncQueue,
  setSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
  clearSyncQueue,
} from './syncQueue';

// --- Token ---

/**
 * @returns {Promise<string|null>}
 */
export async function getToken() {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (e) {
    console.warn('storage.getToken error:', e);
    return null;
  }
}

/**
 * @param {string} token
 * @returns {Promise<void>}
 */
export async function setToken(token) {
  try {
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  } catch (e) {
    console.warn('storage.setToken error:', e);
  }
}

// --- User ---

/**
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUser() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('storage.getUser error:', e);
    return null;
  }
}

/**
 * @param {Object|null} user
 * @returns {Promise<void>}
 */
export async function setUser(user) {
  try {
    if (user != null) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.warn('storage.setUser error:', e);
  }
}

// --- Session (token + user) ---

/**
 * Clears token and user (logout / 401).
 * @returns {Promise<void>}
 */
export async function clearSession() {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER]);
  } catch (e) {
    console.warn('storage.clearSession error:', e);
  }
}

/**
 * Saves session after successful login.
 * @param {string} token
 * @param {Object} user
 * @returns {Promise<void>}
 */
export async function setSession(token, user) {
  await setToken(token);
  await setUser(user);
}

// --- Offline data ---

/**
 * Reads the offline data object (paths, cached trips, etc.).
 * @returns {Promise<Object>} Object with the structure used by the app (e.g. { paths: [], trips: [] })
 */
export async function getOfflineData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_DATA);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.warn('storage.getOfflineData error:', e);
    return {};
  }
}

/**
 * Saves the full offline data object.
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function setOfflineData(data) {
  try {
    if (data != null && typeof data === 'object') {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_DATA, JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA);
    }
  } catch (e) {
    console.warn('storage.setOfflineData error:', e);
  }
}

/**
 * Adds or updates a key within offline data (merge).
 * @param {string} key - e.g. 'paths', 'trips'
 * @param {any} value - Value to save (serialized with JSON)
 * @returns {Promise<void>}
 */
export async function setOfflineDataKey(key, value) {
  const data = await getOfflineData();
  data[key] = value;
  await setOfflineData(data);
}

/**
 * Clears all offline data.
 * @returns {Promise<void>}
 */
export async function clearOfflineData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA);
  } catch (e) {
    console.warn('storage.clearOfflineData error:', e);
  }
}

// --- Sync queue (re-export and helpers) ---

export {
  getSyncQueue,
  setSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
  clearSyncQueue,
};

/**
 * Returns whether there are pending operations to sync.
 * @returns {Promise<boolean>}
 */
export async function hasPendingSync() {
  const queue = await getSyncQueue();
  return queue.length > 0;
}
