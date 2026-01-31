/**
 * Jest setup for React Native / Expo tests.
 * Mocks AsyncStorage (stateful) so storage and E2E-style client tests run without a device.
 */

const mockAsyncStorageStore = {};
const mockAsyncStorage = {
  getItem: jest.fn((key) => Promise.resolve(mockAsyncStorageStore[key] ?? null)),
  setItem: jest.fn((key, value) => {
    mockAsyncStorageStore[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    delete mockAsyncStorageStore[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(mockAsyncStorageStore).forEach((k) => delete mockAsyncStorageStore[k]);
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(mockAsyncStorageStore))),
  multiGet: jest.fn((keys) =>
    Promise.resolve(keys.map((k) => [k, mockAsyncStorageStore[k] ?? null]))
  ),
  multiSet: jest.fn((pairs) => {
    pairs.forEach(([k, v]) => {
      mockAsyncStorageStore[k] = v;
    });
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys) => {
    keys.forEach((k) => delete mockAsyncStorageStore[k]);
    return Promise.resolve();
  }),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: mockAsyncStorage,
}));

beforeEach(() => {
  Object.keys(mockAsyncStorageStore).forEach((k) => delete mockAsyncStorageStore[k]);
});
