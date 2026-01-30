import * as Location from 'expo-location';
import axios from 'axios';

// Mapbox base URLs
const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const MAPBOX_DIRECTIONS_URL = 'https://api.mapbox.com/directions/v5/mapbox/cycling';

class MapService {
    constructor() {
        this.accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
    }

    /**
     * Request location permissions and get current user location
     * @returns {Promise<{latitude: number, longitude: number}>}
     */
    async getCurrentLocation() {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                throw new Error('Permission to access location was denied');
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                timestamp: location.timestamp,
            };
        } catch (error) {
            console.error('Error getting current location:', error);
            throw error;
        }
    }

    /**
     * Search for places using Mapbox Geocoding API
     * @param {string} query Search text
     * @param {Object} options Search options (proximity, bbox, etc.)
     * @returns {Promise<Array>} List of features
     */
    async searchPlaces(query, options = {}) {
        if (!this.accessToken) {
            console.warn('Mapbox access token not found. Geocoding will not work.');
            return [];
        }

        try {
            const response = await axios.get(`${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json`, {
                params: {
                    access_token: this.accessToken,
                    autocomplete: true,
                    limit: 5,
                    ...options,
                },
            });

            return response.data.features;
        } catch (error) {
            console.error('Error searching places:', error);
            return [];
        }
    }

    /**
     * Reverse geocode coordinates to get an address
     * @param {number} latitude 
     * @param {number} longitude 
     * @returns {Promise<string>} Formatted address
     */
    async reverseGeocode(latitude, longitude) {
        if (!this.accessToken) return null;

        try {
            const response = await axios.get(`${MAPBOX_GEOCODING_URL}/${longitude},${latitude}.json`, {
                params: {
                    access_token: this.accessToken,
                    limit: 1,
                },
            });

            if (response.data.features && response.data.features.length > 0) {
                return response.data.features[0].place_name;
            }
            return null;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return null;
        }
    }

    /**
     * Get directions between two points using Mapbox Directions API (Cycling profile)
     * @param {Array<number>} start [longitude, latitude]
     * @param {Array<number>} end [longitude, latitude]
     * @returns {Promise<Object>} Directions data including geometry
     */
    async getDirections(start, end) {
        if (!this.accessToken) return null;

        try {
            const response = await axios.get(
                `${MAPBOX_DIRECTIONS_URL}/${start[0]},${start[1]};${end[0]},${end[1]}`,
                {
                    params: {
                        access_token: this.accessToken,
                        geometries: 'geojson',
                        overview: 'full',
                        steps: true,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error getting directions:', error);
            return null;
        }
    }
}

export default new MapService();
