/**
 * Client integration tests for syncQueue (storage).
 * Mocks AsyncStorage; tests getSyncQueue, addToSyncQueue, removeFromSyncQueue, etc.
 */

const mockStorage = {};
const mockAsyncStorage = {
  getItem: jest.fn((key) => Promise.resolve(mockStorage[key] ?? null)),
  setItem: jest.fn((key, value) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    delete mockStorage[key];
    return Promise.resolve();
  }),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: mockAsyncStorage,
}));

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const {
  getSyncQueue,
  setSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
  incrementSyncRetry,
  clearSyncQueue,
} = require('../../src/storage/syncQueue');

describe('syncQueue', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  describe('getSyncQueue', () => {
    it('returns empty array when no data', async () => {
      const queue = await getSyncQueue();
      expect(queue).toEqual([]);
    });

    it('returns parsed array when data exists', async () => {
      const items = [{ id: '1', method: 'POST', url: '/trips', body: {}, createdAt: 1 }];
      await AsyncStorage.setItem('@bbp/syncQueue', JSON.stringify(items));
      const queue = await getSyncQueue();
      expect(queue).toEqual(items);
    });

    it('returns empty array when stored value is not array', async () => {
      await AsyncStorage.setItem('@bbp/syncQueue', JSON.stringify({ invalid: true }));
      const queue = await getSyncQueue();
      expect(queue).toEqual([]);
    });
  });

  describe('addToSyncQueue', () => {
    it('adds item with id and createdAt', async () => {
      const item = await addToSyncQueue({ method: 'POST', url: '/trips', body: { track: [] } });
      expect(item.id).toBeDefined();
      expect(item.id).toMatch(/^sync_/);
      expect(item.method).toBe('POST');
      expect(item.url).toBe('/trips');
      expect(item.body).toEqual({ track: [] });
      expect(item.createdAt).toBeDefined();
      expect(item.retryCount).toBe(0);
    });

    it('persists to storage', async () => {
      await addToSyncQueue({ method: 'POST', url: '/paths' });
      const queue = await getSyncQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0].method).toBe('POST');
      expect(queue[0].url).toBe('/paths');
    });
  });

  describe('removeFromSyncQueue', () => {
    it('returns false when id not in queue', async () => {
      const removed = await removeFromSyncQueue('nonexistent');
      expect(removed).toBe(false);
    });

    it('removes item and returns true', async () => {
      const added = await addToSyncQueue({ method: 'POST', url: '/trips', body: {} });
      const removed = await removeFromSyncQueue(added.id);
      expect(removed).toBe(true);
      const queue = await getSyncQueue();
      expect(queue).toHaveLength(0);
    });
  });

  describe('incrementSyncRetry', () => {
    it('returns false when id not found', async () => {
      const result = await incrementSyncRetry('nonexistent');
      expect(result).toBe(false);
    });

    it('increments retryCount and returns true', async () => {
      const added = await addToSyncQueue({ method: 'POST', url: '/trips', body: {} });
      const result = await incrementSyncRetry(added.id);
      expect(result).toBe(true);
      const queue = await getSyncQueue();
      expect(queue[0].retryCount).toBe(1);
    });
  });

  describe('clearSyncQueue', () => {
    it('removes key from storage', async () => {
      await addToSyncQueue({ method: 'POST', url: '/trips' });
      await clearSyncQueue();
      const queue = await getSyncQueue();
      expect(queue).toEqual([]);
      expect(mockAsyncStorage.removeItem).toHaveBeenCalled();
    });
  });
});
