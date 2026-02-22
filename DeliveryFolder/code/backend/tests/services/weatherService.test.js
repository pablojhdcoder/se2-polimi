const weatherService = require('../../src/services/external/weatherService');
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('WeatherService Tests', () => {
    const coords = { lat: 45.4642, lon: 9.1900 };

    beforeEach(() => {
        process.env.WEATHER_API_KEY = 'test_key';
        jest.clearAllMocks();
    });

    it('should call API with correct parameters including metric units', async () => {
        axios.get.mockResolvedValue({
            data: {
                main: { temp: 20 },
                wind: { speed: 1, deg: 0, gust: 2 },
                visibility: 10000,
                clouds: { all: 0 }
            }
        });

        await weatherService.getCurrentWeather(coords.lat, coords.lon);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('api.openweathermap.org'),
            expect.objectContaining({
                params: {
                    lat: coords.lat,
                    lon: coords.lon,
                    appid: 'test_key',
                    units: 'metric'
                }
            })
        );
    });

    it('should correctly map all response fields', async () => {
        const mockResponse = {
            data: {
                main: { temp: 25.5 },
                wind: { speed: 4.2, deg: 120, gust: 6.1 },
                visibility: 5000,
                clouds: { all: 20 },
                rain: { '1h': 1.5 }
            }
        };
        axios.get.mockResolvedValue(mockResponse);

        const result = await weatherService.getCurrentWeather(coords.lat, coords.lon);

        expect(result).toEqual({
            temperature: 25.5,
            windSpeed: 4.2,
            windDegree: 120,
            windGust: 6.1,
            visibility: 5000,
            rain: 1.5,
            clouds: 20
        });
    });

    it('should handle missing rain field gracefully', async () => {
        const mockResponse = {
            data: {
                main: { temp: 10 },
                wind: { speed: 2, deg: 10, gust: 3 },
                visibility: 10000,
                clouds: { all: 5 }
                // No rain
            }
        };
        axios.get.mockResolvedValue(mockResponse);

        const result = await weatherService.getCurrentWeather(coords.lat, coords.lon);
        expect(result.rain).toBe(0);
    });

    it('should fallback to mock data on axios error', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        const result = await weatherService.getCurrentWeather(coords.lat, coords.lon);

        // Assert we get the mock data structure
        expect(result).toHaveProperty('temperature');
        expect(result).toHaveProperty('windSpeed');
        expect(result).toHaveProperty('visibility');
    });

    it('should use mock data if API Key is missing', async () => {
        delete process.env.WEATHER_API_KEY;
        const result = await weatherService.getCurrentWeather(coords.lat, coords.lon);
        expect(axios.get).not.toHaveBeenCalled();
        expect(result.temperature).toBeDefined();
    });
});
