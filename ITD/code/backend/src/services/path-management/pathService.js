const pathRepository = require('../../repositories/pathRepository');
const ratingRepository = require('../../repositories/ratingRepository');
const crypto = require('crypto');

/**
 * Adds a new path to the system.
 * @param {Object} pathData Data for the new path
 * @returns {Promise<Object>} Created path
 */
const addPath = async (pathData) => {
    const path = {
        id: crypto.randomUUID(),
        ...pathData,
        userRating: pathData.userRating || 0,
        status: pathData.status || 'optimal'
    };
    return await pathRepository.createPath(path);
};

/**
 * Updates the average rating of a path based on its ratings.
 * @param {string} pathId ID of the path to update
 * @returns {Promise<Object>} Updated path
 */
const updatePathStats = async (pathId) => {
    const avgRating = await ratingRepository.getAverageRatingForPath(pathId);
    // AVG returns a string or null usually in pg, convert to float/int
    const roundedRating = avgRating ? Math.round(parseFloat(avgRating)) : 0;

    return await pathRepository.updatePathRating(pathId, roundedRating);
};

/**
 * Get all paths
 */
const getAllPaths = async () => {
    return await pathRepository.getAllPaths();
};

/**
 * Get path by ID
 */
const getPathById = async (id) => {
    return await pathRepository.getPathById(id);
};

module.exports = {
    addPath,
    updatePathStats,
    getAllPaths,
    getPathById
};
