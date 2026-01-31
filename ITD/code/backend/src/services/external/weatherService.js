const axios = require('axios');

/**
 * Weather Service
 * Wrapper for External Weather APIs (e.g., OpenWeatherMap)
 */
class WeatherService {
    constructor() {
        this.apiKey = process.env.WEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    /**
     * Get current weather for specific coordinates
     * @param {number} lat 
     * @param {number} lon 
     * @returns {Promise<Object>} Weather data
     */
    async getCurrentWeather(lat, lon) {
        if (!this.apiKey) {
            console.warn('Weather API key missing, returning mock data.');
            return this._getMockData();
        }

        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    lat,
                    lon,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            const data = response.data;
            return {
                temperature: data.main.temp,
                windSpeed: data.wind.speed,
                windDegree: data.wind.deg,
                windGust: data.wind.gust,
                visibility: data.visibility,
                rain: data.rain ? data.rain['1h'] : 0,
                clouds: data.clouds.all
            };
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            return this._getMockData();
        }
    }

    /**
     * Helper for prototype when no API key is provided
     * @private
     */
    _getMockData() {
        return {
            temperature: 22,
            windSpeed: 5,
            windDegree: 180,
            windGust: 7,
            visibility: 10000,
            rain: 0,
            clouds: 10
        };
    }
}

module.exports = new WeatherService();
