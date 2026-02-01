const request = require('supertest');
const app = require('../../src/app');

// Mock dependencies to avoid side effects during health check
jest.mock('../../src/config/redis', () => ({
    connectRedis: jest.fn().mockResolvedValue(undefined),
    redisClient: { isOpen: true }
}));
jest.mock('../../src/config/rabbitmq', () => ({
    connectRabbitMQ: jest.fn().mockResolvedValue(undefined)
}));

describe('Server Infrastructure', () => {
    describe('GET /health', () => {
        it('returns 200 and service status', async () => {
            const res = await request(app)
                .get('/health')
                .expect(200);
            expect(res.body.status).toBe('ok');
            expect(res.body.service).toBe('bbp-backend');
        });
    });
});
