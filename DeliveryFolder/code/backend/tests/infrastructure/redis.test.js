const { connectRedis, redisClient } = require('../../src/config/redis');

// Mock the redis package itself to test our wrapper logic if needed
// Or just test the wrapper assuming mocks works.
// Since we can't run real redis, we mock the underlying redis client.

jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        on: jest.fn(),
        connect: jest.fn().mockResolvedValue(undefined),
        isOpen: true,
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn()
    }))
}));

describe('Redis Infrastructure', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should connect to redis successfully', async () => {
        await connectRedis();
        expect(redisClient.isOpen).toBe(true);
    });
});
