import apiClient from './api';

/**
 * Path Service
 * Handles frontend interactions for path discovery and management.
 */

/**
 * Get all available paths
 */
export const getPaths = async () => {
    try {
        const response = await apiClient.get('/paths');
        return response.data;
    } catch (error) {
        console.error('Error fetching paths:', error);
        throw error;
    }
};

/**
 * Get a specific path by ID
 * @param {string} pathId 
 */
export const getPathById = async (pathId) => {
    try {
        const response = await apiClient.get(`/paths/${pathId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching path:', error);
        throw error;
    }
};

/**
 * Save a path to user's favorites
 * @param {string} pathId 
 */
export const savePath = async (pathId) => {
    try {
        const response = await apiClient.post(`/paths/${pathId}/save`);
        return response.data;
    } catch (error) {
        console.error('Error saving path:', error);
        throw error;
    }
};

/**
 * Remove a saved path
 * @param {string} pathId 
 */
export const unsavePath = async (pathId) => {
    try {
        const response = await apiClient.delete(`/paths/${pathId}/save`);
        return response.data;
    } catch (error) {
        console.error('Error unsaving path:', error);
        throw error;
    }
};

/**
 * Create a new path
 * @param {Object} pathData 
 */
export const createPath = async (pathData) => {
    try {
        const response = await apiClient.post('/paths', pathData);
        return response.data;
    } catch (error) {
        console.error('Error creating path:', error);
        throw error;
    }
};

export default {
    getPaths,
    getPathById,
    savePath,
    unsavePath,
    createPath
};
