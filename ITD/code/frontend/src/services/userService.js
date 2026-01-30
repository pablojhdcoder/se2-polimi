import apiClient from './api';

/**
 * User Service
 * Handles frontend interactions for user profile and management.
 */

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/users/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

/**
 * Update user profile
 * @param {Object} userData 
 */
export const updateProfile = async (userData) => {
    try {
        const response = await apiClient.put('/users/profile', userData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

/**
 * Delete user account
 */
export const deleteAccount = async () => {
    try {
        const response = await apiClient.delete('/users/profile');
        return response.data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};

/**
 * Search for users
 * @param {string} query 
 */
export const searchUsers = async (query) => {
    try {
        const response = await apiClient.get(`/users/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

export default {
    getCurrentUser,
    updateProfile,
    deleteAccount,
    searchUsers
};
