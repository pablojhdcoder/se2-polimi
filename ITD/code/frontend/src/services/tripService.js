import apiClient from './api';
import { trip_record } from '../sensors/trip-detection/tripRecorder';

/**
 * Trip Service
 * Handles frontend interactions for trip-related data.
 */

/**
 * Start a trip (manual or automatic)
 * @param {Object} tripData 
 */
export const startTrip = async (tripData) => {
    try {
        const response = await apiClient.post('/trips/start', tripData);
        const startedTrip = response.data;

        // Trigger real-time tracking on the frontend
        if (startedTrip && startedTrip.id) {
            trip_record(startedTrip.id);
        }

        return startedTrip;
    } catch (error) {
        console.error('Error starting trip:', error);
        throw error;
    }
};

/**
 * Get all trips for the current user
 */
export const getMyTrips = async () => {
    try {
        const response = await apiClient.get('/trips/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
};

/**
 * Get a specific trip by ID
 * @param {string} tripId 
 */
export const getTripById = async (tripId) => {
    try {
        const response = await apiClient.get(`/trips/${tripId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching trip:', error);
        throw error;
    }
};

/**
 * Remove a trip (delete)
 * @param {string} tripId 
 */
export const removeTrip = async (tripId) => {
    try {
        const response = await apiClient.delete(`/trips/${tripId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing trip:', error);
        throw error;
    }
};

export default {
    startTrip,
    getMyTrips,
    getTripById,
    removeTrip
};
