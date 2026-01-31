/**
 * Client integration tests: storageService (token, user, session, offline data).
 */

const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const {
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
  hasPendingSync,
  getSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
  clearSyncQueue,
} = require('../../src/storage/storageService');

describe('storageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('token', () => {
    it('getToken returns null when not set', async () => {
      expect(await getToken()).toBeNull();
    });

    it('setToken and getToken round-trip', async () => {
      await setToken('abc123');
      expect(await getToken()).toBe('abc123');
      await setToken('');
      expect(await getToken()).toBeNull();
    });

    it('setToken with empty clears key', async () => {
      await setToken('x');
      await setToken(null);
      expect(await getToken()).toBeNull();
    });
  });

  describe('user', () => {
    it('getUser returns null when not set', async () => {
      expect(await getUser()).toBeNull();
    });

    it('setUser and getUser round-trip', async () => {
      const user = { id: 1, email: 'u@test.com' };
      await setUser(user);
      expect(await getUser()).toEqual(user);
      await setUser(null);
      expect(await getUser()).toBeNull();
    });
  });

  describe('session', () => {
    it('setSession saves token and user', async () => {
      await setSession('token1', { email: 'a@b.com' });
      expect(await getToken()).toBe('token1');
      expect(await getUser()).toEqual({ email: 'a@b.com' });
    });

    it('clearSession removes token and user', async () => {
      await setSession('t', { id: 1 });
      await clearSession();
      expect(await getToken()).toBeNull();
      expect(await getUser()).toBeNull();
    });
  });

  describe('offline data', () => {
    it('getOfflineData returns {} when not set', async () => {
      expect(await getOfflineData()).toEqual({});
    });

    it('setOfflineData and getOfflineData round-trip', async () => {
      const data = { paths: [1, 2], trips: [] };
      await setOfflineData(data);
      expect(await getOfflineData()).toEqual(data);
    });

    it('setOfflineDataKey merges key into existing data', async () => {
      await setOfflineData({ paths: [] });
      await setOfflineDataKey('trips', [{ id: 1 }]);
      expect(await getOfflineData()).toEqual({ paths: [], trips: [{ id: 1 }] });
    });

    it('clearOfflineData removes offline data', async () => {
      await setOfflineData({ x: 1 });
      await clearOfflineData();
      expect(await getOfflineData()).toEqual({});
    });
  });

  describe('sync queue (re-export)', () => {
    it('hasPendingSync returns false when queue is empty', async () => {
      await clearSyncQueue();
      expect(await hasPendingSync()).toBe(false);
    });

    it('hasPendingSync returns true after addToSyncQueue', async () => {
      await clearSyncQueue();
      await addToSyncQueue({ method: 'POST', url: '/trips', body: {} });
      expect(await hasPendingSync()).toBe(true);
      const queue = await getSyncQueue();
      await removeFromSyncQueue(queue[0].id);
      expect(await hasPendingSync()).toBe(false);
    });
  });
});
