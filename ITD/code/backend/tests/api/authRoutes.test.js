const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const userRepository = require('../../src/repositories/userRepository');

// Mock dependencies
jest.mock('../../src/config/redis', () => ({
    connectRedis: jest.fn().mockResolvedValue(undefined),
    redisClient: { set: jest.fn(), get: jest.fn(), del: jest.fn(), isOpen: true }
}));
jest.mock('../../src/config/rabbitmq', () => ({
    connectRabbitMQ: jest.fn().mockResolvedValue(undefined),
    sendToQueue: jest.fn()
}));
jest.mock('../../src/repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

function makeToken(payload = { id: 'user-123', username: 'testuser' }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

describe('Auth API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /auth/me', () => {
        it('returns 401 when no token', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me')
                .expect(401);
            expect(res.body.error).toMatch(/token|denied/i);
        });

        it('returns 200 and user without password when token is valid', async () => {
            const token = makeToken({ id: 'user-456', username: 'meuser' });
            const dbUser = {
                id: 'user-456',
                username: 'meuser',
                email: 'me@test.com',
                password_hash: 'hashed'
            };
            userRepository.getUserById.mockResolvedValue(dbUser); // Ensure mock is called on the repo used by app

            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).not.toHaveProperty('password_hash');
            expect(res.body.username).toBe('meuser');
            expect(res.body.email).toBe('me@test.com');
        });

        it('returns 404 when user not found', async () => {
            const token = makeToken({ id: 'nonexistent' });
            userRepository.getUserById.mockResolvedValue(null);

            await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });
});
