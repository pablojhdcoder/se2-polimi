/**
 * Client integration tests for syncQueueProcessor.
 * Mocks api and storage; tests processSyncQueue behaviour.
 */

const mockGetSyncQueue = jest.fn();
const mockRemoveFromSyncQueue = jest.fn();
const mockApiRequest = jest.fn();

jest.mock('../../src/services/api', () => ({
  __esModule: true,
  default: {
    request: (...args) => mockApiRequest(...args),
  },
}));

jest.mock('../../src/storage', () => ({
  getSyncQueue: (...args) => mockGetSyncQueue(...args),
  removeFromSyncQueue: (...args) => mockRemoveFromSyncQueue(...args),
}));

const { processSyncQueue } = require('../../src/services/syncQueueProcessor');

describe('syncQueueProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRemoveFromSyncQueue.mockResolvedValue(true);
  });

  it('does nothing when queue is empty', async () => {
    mockGetSyncQueue.mockResolvedValue([]);
    await processSyncQueue();
    expect(mockApiRequest).not.toHaveBeenCalled();
    expect(mockRemoveFromSyncQueue).not.toHaveBeenCalled();
  });

  it('sends each item to api and removes on success', async () => {
    mockGetSyncQueue.mockResolvedValue([
      { id: 'sync_1', method: 'POST', url: '/trips', body: { track: [] }, createdAt: 1 },
    ]);
    mockApiRequest.mockResolvedValue({ data: {} });
    await processSyncQueue();
    expect(mockApiRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/trips',
      data: { track: [] },
    });
    expect(mockRemoveFromSyncQueue).toHaveBeenCalledWith('sync_1');
  });

  it('leaves item in queue when api fails', async () => {
    mockGetSyncQueue.mockResolvedValue([
      { id: 'sync_1', method: 'POST', url: '/trips', body: { track: [] }, createdAt: 1 },
    ]);
    mockApiRequest.mockRejectedValue(new Error('Network error'));
    await processSyncQueue();
    expect(mockApiRequest).toHaveBeenCalled();
    expect(mockRemoveFromSyncQueue).not.toHaveBeenCalled();
  });

  it('removes item on 401 (unauthorized)', async () => {
    const err = Object.assign(new Error('Unauthorized'), { response: { status: 401 } });
    mockGetSyncQueue.mockResolvedValue([
      { id: 'sync_1', method: 'POST', url: '/paths', body: {}, createdAt: 1 },
    ]);
    mockApiRequest.mockRejectedValue(err);
    await processSyncQueue();
    expect(mockRemoveFromSyncQueue).toHaveBeenCalledWith('sync_1');
  });

  it('includes body for POST request', async () => {
    const item = {
      id: 'sync_2',
      method: 'POST',
      url: '/trips',
      body: { track: [{ lat: 45, lng: 9 }], startTime: 1, endTime: 2 },
      createdAt: 2,
    };
    mockGetSyncQueue.mockResolvedValue([item]);
    mockApiRequest.mockResolvedValue({});
    await processSyncQueue();
    expect(mockApiRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/trips',
      data: item.body,
    });
  });
});
