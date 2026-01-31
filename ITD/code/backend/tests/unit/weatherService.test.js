const weatherService = require('../../src/services/external/weatherService');
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('WeatherService Unit Tests', () => {
    const coords = { lat: 45.4642, lon: 9.1900 };

    beforeEach(() => {
        process.env.WEATHER_API_KEY = 'test_key';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return parsed weather data on successful API call', async () => {
        const mockResponse = {
            data: {
                main: { temp: 25.5 },
                wind: { speed: 4.2, deg: 120, gust: 6.1 },
                visibility: 10000,
                clouds: { all: 20 },
                rain: { '1h': 0.5 }
            }
        };
        axios.get.mockResolvedValue(mockResponse);

        const result = await weatherService.getCurrentWeather(coords.lat, coords.lon);

        expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            params: expect.objectContaining({
                lat: coords.lat,
                lon: coords.lon,
                appid: 'test_key'
            })
        }));
        expect(result.temperature).toBe(25.5);
        expect(result.rain).toBe(0.5);
    });

    it('should return mock data if API key is missing', async () => {
        delete process.env.WEATHER_API_KEY;
        const result = await weatherService.getCurrentWeather(coords.lat, coords.lon);

        expect(axios.get).not.toHaveBeenCalled();
        expect(result.temperature).toBe(22); // Mock value
    });

    it('should return mock data if API call fails', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        const result = await weatherService.getCurrentWeather(coords.lat, coords.lon);

        expect(result.temperature).toBe(22); // Mock value fallback
    });
});
