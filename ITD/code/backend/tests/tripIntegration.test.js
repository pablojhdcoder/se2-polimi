const tripService = require('../src/services/trip-management/tripService');
const weatherService = require('../src/services/external/weatherService');
const tripRepository = require('../src/repositories/tripRepository');
const rabbitmq = require('../src/config/rabbitmq');

// Mock dependencies
jest.mock('../src/repositories/tripRepository');
jest.mock('../src/services/external/weatherService');
jest.mock('../src/config/rabbitmq');

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
                temperature: 25,
                rain: 0
            }));
        });

        it('should use fallback sensor data if weather fetch fails', async () => {
            weatherService.getCurrentWeather.mockRejectedValue(new Error('API Down'));
            tripRepository.createTrip.mockResolvedValue({ id: 'trip-123' });

            const sensorData = { latitude: 10, longitude: 10, temperature: 18 };
            await tripService.automaticTripStart(mockUserId, mockPathId, sensorData);

            expect(tripRepository.createTrip).toHaveBeenCalledWith(expect.objectContaining({
                temperature: 18
            }));
        });
    });

    describe('updateTripTrack', () => {
        it('should send a message to RabbitMQ only when isFinal is true', async () => {
            const tripId = 'trip-123';
            const intermediateRoute = { metadata: { isFinal: false }, path: {} };
            const finalRoute = { metadata: { isFinal: true }, path: {} };

            tripRepository.updateTripRoute.mockResolvedValue({ id: tripId, path_id: 'path-xyz' });

            // 1. Partial update
            await tripService.updateTripTrack(tripId, intermediateRoute);
            expect(rabbitmq.sendToQueue).not.toHaveBeenCalled();

            // 2. Final update
            await tripService.updateTripTrack(tripId, finalRoute);
            expect(rabbitmq.sendToQueue).toHaveBeenCalledWith('path_stats_update', { pathId: 'path-xyz' });
        });
    });
});
