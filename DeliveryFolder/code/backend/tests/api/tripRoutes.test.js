const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const tripRepository = require('../../src/repositories/tripRepository');

// Mock dependencies
jest.mock('../../src/config/redis', () => ({
    connectRedis: jest.fn().mockResolvedValue(undefined),
    redisClient: { set: jest.fn(), get: jest.fn(), del: jest.fn(), isOpen: true }
}));
jest.mock('../../src/config/rabbitmq', () => ({
    connectRabbitMQ: jest.fn().mockResolvedValue(undefined),
    sendToQueue: jest.fn()
}));
jest.mock('../../src/repositories/tripRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

function makeToken(payload = { id: 'user-123', username: 'testuser' }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

describe('Trip API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /trips/me', () => {
        it('returns 200 and list of trips', async () => {
            const token = makeToken({ id: 'user-789' });
            const mockTrips = [
                { id: 'trip-1', user_id: 'user-789' }
            ];
            tripRepository.getTripsByUserId.mockResolvedValue(mockTrips);

            const res = await request(app)
                .get('/api/v1/trips/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.data).toEqual(mockTrips);
        });
    });

    describe('GET /trips/:id', () => {
        it('returns 200 and trip when owned by user', async () => {
            const token = makeToken({ id: 'user-789' });
            const mockTrip = { id: 'trip-123', user_id: 'user-789' };
            tripRepository.getTripById.mockResolvedValue(mockTrip);

            const res = await request(app)
                .get('/api/v1/trips/trip-123')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body.data).toEqual(mockTrip);
        });

        it('returns 404 when trip belongs to another user', async () => {
            const token = makeToken({ id: 'user-789' });
            tripRepository.getTripById.mockResolvedValue({ id: 'trip-other', user_id: 'other-user' });

            await request(app)
                .get('/api/v1/trips/trip-other')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });
});
