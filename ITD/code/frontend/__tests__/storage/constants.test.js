/**
 * Client integration tests: storage constants.
 */

const { STORAGE_KEYS } = require('../../src/storage/constants');

describe('storage/constants', () => {
  it('exports STORAGE_KEYS with expected keys', () => {
    expect(STORAGE_KEYS).toBeDefined();
    expect(STORAGE_KEYS.AUTH_TOKEN).toBe('@bbp/authToken');
    expect(STORAGE_KEYS.USER).toBe('@bbp/user');
    expect(STORAGE_KEYS.OFFLINE_DATA).toBe('@bbp/offlineData');
    expect(STORAGE_KEYS.SYNC_QUEUE).toBe('@bbp/syncQueue');
  });

  it('uses unique values to avoid collisions', () => {
    const values = Object.values(STORAGE_KEYS);
    expect(new Set(values).size).toBe(values.length);
  });
});
