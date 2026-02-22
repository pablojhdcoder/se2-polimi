import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Sync queue entry.
 * @typedef {Object} SyncQueueItem
 * @property {string} id - Unique identifier
 * @property {string} method - GET, POST, PUT, PATCH, DELETE
 * @property {string} url - Relative path (e.g. /paths, /trips)
 * @property {Object} [body] - Body for POST/PUT/PATCH
 * @property {number} createdAt - Creation timestamp
 * @property {number} [retryCount] - Retry count
 */

/**
 * Reads the sync queue from AsyncStorage.
 * @returns {Promise<SyncQueueItem[]>}
 */
export async function getSyncQueue() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('syncQueue.getSyncQueue error:', e);
    return [];
  }
}

/**
 * Saves the sync queue to AsyncStorage.
 * @param {SyncQueueItem[]} queue
 * @returns {Promise<void>}
 */
export async function setSyncQueue(queue) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.warn('syncQueue.setSyncQueue error:', e);
  }
}

/**
 * Adds an operation to the sync queue (to resend when connection is available).
 * @param {Object} item - { method, url, body? }
 * @returns {Promise<SyncQueueItem>} Item with id and createdAt
 */
export async function addToSyncQueue({ method, url, body }) {
  const queue = await getSyncQueue();
  const id = `sync_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const item = {
    id,
    method: (method || 'POST').toUpperCase(),
    url: url || '',
    body: body ?? null,
    createdAt: Date.now(),
    retryCount: 0,
  };
  queue.push(item);
  await setSyncQueue(queue);
  return item;
}

/**
 * Removes an item from the queue by id.
 * @param {string} id
 * @returns {Promise<boolean>} true if removed
 */
export async function removeFromSyncQueue(id) {
  const queue = await getSyncQueue();
  const filtered = queue.filter((i) => i.id !== id);
  if (filtered.length === queue.length) return false;
  await setSyncQueue(filtered);
  return true;
}

/**
 * Marks an item for retry (increments retryCount and leaves it in the queue).
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function incrementSyncRetry(id) {
  const queue = await getSyncQueue();
  const index = queue.findIndex((i) => i.id === id);
  if (index === -1) return false;
  queue[index].retryCount = (queue[index].retryCount || 0) + 1;
  await setSyncQueue(queue);
  return true;
}

/**
 * Clears the sync queue (useful after successful sync or reset).
 * @returns {Promise<void>}
 */
export async function clearSyncQueue() {
  await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
}
