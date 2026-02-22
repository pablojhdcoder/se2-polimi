// tests/jest.setup.js
require('dotenv').config({ path: '.env.test' });

// Global Mocks for External Services
jest.mock('../src/services/external/weatherService', () => ({
    getCurrentWeather: jest.fn().mockResolvedValue({
        temperature: 20,
        windSpeed: 5,
        windDegree: 180,
        visibility: 10000,
        rain: 0,
        clouds: 0
    })
}));

// Mock RabbitMQ and Redis to avoid infrastructure dependence in unit tests
jest.mock('../src/config/rabbitmq', () => ({
    connectRabbitMQ: jest.fn().mockResolvedValue(true),
    sendToQueue: jest.fn()
}));

jest.mock('../src/config/redis', () => ({
    redisClient: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        connect: jest.fn(),
        on: jest.fn(),
        rPush: jest.fn(),
        lRange: jest.fn(),
    },
    connectRedis: jest.fn().mockResolvedValue(true)
}));

// Set long timeout for integration tests if needed
jest.setTimeout(30000);
