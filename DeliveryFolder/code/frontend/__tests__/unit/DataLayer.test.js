/**
 * synthesized unit tests for the data and infrastructure layer.
 */

const { STORAGE_KEYS } = require('../../src/storage/constants');
const { requestWithRetry } = require('../../src/services/requestWithRetry');
const storage = require('../../src/storage/storageService');
const syncQueue = require('../../src/storage/syncQueue');
const { processSyncQueue } = require('../../src/services/syncQueueProcessor');

// Mocks for SyncQueueProcessor
const mockApiRequest = jest.fn();
jest.mock('../../src/services/api', () => ({
    __esModule: true,
    default: { request: (...args) => mockApiRequest(...args) },
}));

describe('Data Layer Logic', () => {
    describe('Constants', () => {
        it('defines unique storage keys', () => {
            const values = Object.values(STORAGE_KEYS);
            expect(new Set(values).size).toBe(values.length);
            expect(STORAGE_KEYS.AUTH_TOKEN).toBeDefined();
        });
    });

    describe('Storage & Session', () => {
        beforeEach(() => jest.clearAllMocks());

        it('manages user session (token & user)', async () => {
            await storage.setSession('token123', { id: 1 });
            expect(await storage.getToken()).toBe('token123');
            expect(await storage.getUser()).toEqual({ id: 1 });

            await storage.clearSession();
            expect(await storage.getToken()).toBeNull();
            expect(await storage.getUser()).toBeNull();
        });

        it('manages offline data', async () => {
            await storage.setOfflineData({ paths: [1] });
            expect(await storage.getOfflineData()).toEqual({ paths: [1] });
            await storage.clearOfflineData();
            expect(await storage.getOfflineData()).toEqual({});
        });
    });

    describe('Request Logic (Retry)', () => {
        it('retries on network errors but not on 4xx', async () => {
            const requestFn = jest.fn()
                .mockRejectedValueOnce(new Error('Network Error'))
                .mockResolvedValueOnce({ data: 'ok' });

            const res = await requestWithRetry(requestFn, { maxRetries: 1, baseDelayMs: 0 });
            expect(res.data).toBe('ok');
            expect(requestFn).toHaveBeenCalledTimes(2);

            const err = Object.assign(new Error('401'), { response: { status: 401 } });
            requestFn.mockRejectedValueOnce(err);
            await expect(requestWithRetry(requestFn)).rejects.toThrow();
            expect(requestFn).toHaveBeenCalledTimes(3); // 2 from before + 1 attempted
        });
    });

    describe('Sync Queue Mechanics', () => {
        beforeEach(async () => await syncQueue.clearSyncQueue());

        it('adds, increments and removes items', async () => {
            const item = await syncQueue.addToSyncQueue({ method: 'POST', url: '/t' });
            expect(item.id).toMatch(/^sync_/);

            await syncQueue.incrementSyncRetry(item.id);
            let q = await syncQueue.getSyncQueue();
            expect(q[0].retryCount).toBe(1);

            await syncQueue.removeFromSyncQueue(item.id);
            q = await syncQueue.getSyncQueue();
            expect(q).toHaveLength(0);
        });

        it('processes queue and removes items on api success', async () => {
            await syncQueue.addToSyncQueue({ method: 'POST', url: '/ok', body: { x: 1 } });
            mockApiRequest.mockResolvedValue({ data: {} });

            // We need to point the storage mock used in processor to the same underlying store if necessary, 
            // but the project seems to use real re-exports.
            await processSyncQueue();

            const q = await syncQueue.getSyncQueue();
            expect(q).toHaveLength(0);
            expect(mockApiRequest).toHaveBeenCalledWith(expect.objectContaining({ url: '/ok' }));
        });
    });
});
