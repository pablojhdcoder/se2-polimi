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
     * @param {Object} updateData - Fields to update (full_name, email, phone_number, profile_picture)
     * @returns {Promise<Object>} Updated user profile (without password)
     */
    updateUserProfile: async (userId, updateData) => {
        if (!userId) throw new Error('User ID is required');
        const allowed = ['full_name', 'email', 'phone_number', 'profile_picture'];
        const fields = {};
        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(updateData, key)) {
                fields[key] = updateData[key];
            }
        }
        if (fields.email) {
            const existing = await userRepository.getUserByEmail(fields.email);
            if (existing && existing.id !== userId) {
                throw new Error('Email already registered');
            }
        }
        const updatedUser = await userRepository.updateUser(userId, fields);
        if (!updatedUser) return null;
        const { password_hash: _, ...profile } = updatedUser;
        return profile;
    }
};

module.exports = userService;
