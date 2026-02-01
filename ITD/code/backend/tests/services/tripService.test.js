const tripService = require('../../src/services/trip-management/tripService');
const weatherService = require('../../src/services/external/weatherService');
const tripRepository = require('../../src/repositories/tripRepository');

// Mock dependencies
jest.mock('../../src/repositories/tripRepository');
jest.mock('../../src/repositories/userRepository', () => ({
    getUserById: jest.fn().mockResolvedValue(null)
}));
jest.mock('../../src/services/external/weatherService');
jest.mock('../../src/config/redis', () => ({
    connectRedis: jest.fn().mockResolvedValue(undefined),
    redisClient: {
        set: jest.fn().mockResolvedValue(undefined),
        rPush: jest.fn().mockResolvedValue(undefined),
        lRange: jest.fn().mockResolvedValue([]),
        del: jest.fn().mockResolvedValue(undefined),
        isOpen: true
    }
}));

describe('TripService Integration Tests', () => {
    const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
    const mockPathId = '660e8400-e29b-41d4-a716-446655440011';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('automaticTripStart', () => {
        it('should fetch weather data if coordinates are provided', async () => {
            const sensorData = { latitude: 40.7128, longitude: -74.0060 };
            const mockWeather = { temperature: 25, rain: 0 };

            weatherService.getCurrentWeather.mockResolvedValue(mockWeather);
            tripRepository.createTrip.mockResolvedValue({ id: 'trip-123' });

            await tripService.automaticTripStart(mockUserId, mockPathId, sensorData);

            expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(40.7128, -74.0060);
            expect(tripRepository.createTrip).toHaveBeenCalledWith(expect.objectContaining({
                temperature: 25
            }));
        });

        it('should reject when weather fetch fails (no fallback)', async () => {
            weatherService.getCurrentWeather.mockRejectedValue(new Error('API Down'));
            tripRepository.createTrip.mockResolvedValue({ id: 'trip-123' });

            const sensorData = { latitude: 10, longitude: 10, temperature: 18 };
            await expect(
                tripService.automaticTripStart(mockUserId, mockPathId, sensorData)
            ).rejects.toThrow('API Down');
            expect(tripRepository.createTrip).not.toHaveBeenCalled();
        });
    });

    describe('updateTripTrack', () => {
        it('should call updateTripRoute when isFinal is true', async () => {
            const tripId = 'trip-123';
            const intermediateRoute = { metadata: { isFinal: false }, coordinates: [] };
            const finalRoute = { metadata: { isFinal: true }, coordinates: [] };

            tripRepository.updateTripRoute.mockResolvedValue({ id: tripId, path_id: 'path-xyz' });

            // 1. Partial update (no finalization)
            await tripService.updateTripTrack(tripId, intermediateRoute);
            expect(tripRepository.updateTripRoute).not.toHaveBeenCalled();

            // 2. Final update (flush to DB)
            await tripService.updateTripTrack(tripId, finalRoute);
            expect(tripRepository.updateTripRoute).toHaveBeenCalled();
        });
    });
});
