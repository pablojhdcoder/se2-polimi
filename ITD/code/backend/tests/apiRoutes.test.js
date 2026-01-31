/**
 * API route integration tests: GET /auth/me, GET /trips/me, GET /trips/:id.
 * Uses supertest against the Express app with mocked repositories and valid JWT.
 */

const jwt = require('jsonwebtoken');
const request = require('supertest');

// Mock infrastructure and repositories before app is loaded
jest.mock('../src/config/redis', () => ({
  connectRedis: jest.fn().mockResolvedValue(undefined),
  redisClient: { set: jest.fn(), get: jest.fn(), del: jest.fn(), isOpen: true }
}));
jest.mock('../src/config/rabbitmq', () => ({
  connectRabbitMQ: jest.fn().mockResolvedValue(undefined),
  sendToQueue: jest.fn()
}));
jest.mock('../src/services/information-merging/statsConsumer', () => ({
  startStatsConsumer: jest.fn().mockResolvedValue(undefined)
}));

const userRepository = require('../src/repositories/userRepository');
const tripRepository = require('../src/repositories/tripRepository');

jest.mock('../src/repositories/userRepository');
jest.mock('../src/repositories/tripRepository');

const app = require('../src/app');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

function makeToken(payload = { id: 'user-123', username: 'testuser' }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('returns 200 and service status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('bbp-backend');
    });
  });

  describe('GET /auth/me', () => {
    it('returns 401 when no token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);
      expect(res.body.error).toMatch(/token|denied/i);
    });

    it('returns 403 when token is invalid', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);
    });

    it('returns 200 and user without password when token is valid', async () => {
      const token = makeToken({ id: 'user-456', username: 'meuser' });
      const dbUser = {
        id: 'user-456',
        username: 'meuser',
        email: 'me@test.com',
        password_hash: 'hashed'
      };
      userRepository.getUserById.mockResolvedValue(dbUser);

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).not.toHaveProperty('password_hash');
      expect(res.body.username).toBe('meuser');
      expect(res.body.email).toBe('me@test.com');
      expect(userRepository.getUserById).toHaveBeenCalledWith('user-456');
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

  describe('GET /trips/me', () => {
    it('returns 401 when no token', async () => {
      await request(app).get('/api/v1/trips/me').expect(401);
    });

    it('returns 200 and list of trips for authenticated user', async () => {
      const token = makeToken({ id: 'user-789' });
      const mockTrips = [
        { id: 'trip-1', user_id: 'user-789', path_id: 'path-1' },
        { id: 'trip-2', user_id: 'user-789', path_id: 'path-2' }
      ];
      tripRepository.getTripsByUserId.mockResolvedValue(mockTrips);

      const res = await request(app)
        .get('/api/v1/trips/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data).toEqual(mockTrips);
      expect(tripRepository.getTripsByUserId).toHaveBeenCalledWith('user-789');
    });
  });

  describe('GET /trips/:id', () => {
    it('returns 401 when no token', async () => {
      await request(app).get('/api/v1/trips/trip-123').expect(401);
    });

    it('returns 200 and trip when owned by user', async () => {
      const token = makeToken({ id: 'user-789' });
      const mockTrip = { id: 'trip-123', user_id: 'user-789', path_id: 'path-1' };
      tripRepository.getTripById.mockResolvedValue(mockTrip);

      const res = await request(app)
        .get('/api/v1/trips/trip-123')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data).toEqual(mockTrip);
      expect(tripRepository.getTripById).toHaveBeenCalledWith('trip-123');
    });

    it('returns 404 when trip not found', async () => {
      const token = makeToken({ id: 'user-789' });
      tripRepository.getTripById.mockResolvedValue(null);

      await request(app)
        .get('/api/v1/trips/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
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
