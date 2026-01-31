import api from './api';
import { getSyncQueue, removeFromSyncQueue } from '../storage';

/**
 * Processes the sync queue: resends each operation to the server and removes it on success.
 * Should be called when the app detects connection (e.g. from NetworkStatusProvider).
 * Does not modify backend; reuses existing endpoints.
 */
export async function processSyncQueue() {
  const queue = await getSyncQueue();
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      const config = { method: item.method, url: item.url };
      if (item.body && ['POST', 'PUT', 'PATCH'].includes(item.method)) {
        config.data = item.body;
      }
      await api.request(config);
      await removeFromSyncQueue(item.id);
    } catch (err) {
      // On failure (network or server), leave in queue for next attempt
      if (err.response?.status === 401) {
        await removeFromSyncQueue(item.id);
      }
    }
  }
}
