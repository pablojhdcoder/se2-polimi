const userRepository = require('../../repositories/userRepository');

/**
 * Service to handle user profile management.
 */
const userService = {
    /**
     * Retrieves a user's profile by ID.
     * @param {string} userId
     * @returns {Promise<Object|null>} User object without sensitive data
     */
    getUserProfile: async (userId) => {
        if (!userId) throw new Error('User ID is required');
        const user = await userRepository.getUserById(userId);
        if (!user) return null;
        const { password_hash, ...profile } = user;
        return profile;
    },

    /**
     * Updates a user's profile.
     * @param {string} userId
     * @param {Object} updateData - Fields to update
     * @returns {Promise<Object>} Updated user profile
     */
    updateUserProfile: async (userId, updateData) => {
        if (!userId) throw new Error('User ID is required');
        // This assumes update functionality exists in repository or needs to be orchestrated
        // For now, we'll just mock the orchestration
        // const updatedUser = await userRepository.updateUser(userId, updateData);
        // return updatedUser;
        throw new Error('Not implemented');
    }
};

module.exports = userService;
