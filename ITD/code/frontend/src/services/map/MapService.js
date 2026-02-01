/**
 * MapService: geocoding, reverse geocoding, and directions via Mapbox HTTP APIs.
 * The map view in the app uses react-native-maps (MapboxMap component); this service
 * only provides data (places, routes, current location) for the UI to display.
 */
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

            return this._transformRoute(response.data);
        } catch (error) {
            console.error('Error getting directions:', error);
            return null;
        }
    }

    /**
     * Transforms provider-specific directions into a provider-agnostic format
     * @private
     * @param {Object} data Raw data from map provider
     */
    _transformRoute(data) {
        if (!data || !data.routes || data.routes.length === 0) return null;

        const route = data.routes[0];

        // This is our Abstract Route Format
        return {
            metadata: {
                provider: 'mapbox',
                version: '1.0',
                generatedAt: new Date().toISOString(),
            },
            summary: {
                distance: route.distance, // in meters
                duration: route.duration, // in seconds
                mainRoads: route.summary,
            },
            path: route.geometry, // GeoJSON LineString
            checkpoints: route.legs[0].steps.map(step => ({
                instruction: step.maneuver.instruction,
                location: step.maneuver.location, // [lng, lat]
                distance: step.distance
            }))
        };
    }

    /**
     * Standardizes a recorded GPS trace into the internal route format
     * @param {Array<Array<number>>} coordinates Array of [longitude, latitude]
     * @param {Object} metadata Optional metadata (startTime, device info, etc)
     * @returns {Object} Internal route format
     */
    formatRecordedRoute(coordinates, metadata = {}) {
        return {
            metadata: {
                provider: 'app_gps',
                version: '1.0',
                recordedAt: new Date().toISOString(),
                ...metadata
            },
            path: {
                type: 'LineString',
                coordinates: coordinates
            }
        };
    }
}

export default new MapService();
