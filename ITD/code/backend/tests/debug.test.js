// tests/debug.test.js
const tripService = require('../src/services/trip-management/tripService');

describe('Debug Test', () => {
    it('should load tripService', () => {
        expect(tripService).toBeDefined();
    });
});
