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
        ...pathData,
        id: pathData.id || crypto.randomUUID(),
        userRating: pathData.userRating ?? 0,
        status: pathData.status || 'optimal',
        length: pathData.length ?? pathData.distance ?? 0,
        startX: pathData.startX ?? null,
        startY: pathData.startY ?? null,
        endX: pathData.endX ?? null,
        endY: pathData.endY ?? null,
        routeData: pathData.routeData ?? null
    };
    return await pathRepository.createPath(path);
};

/**
 * Updates the average rating and other statistics of a path.
 * @param {string} pathId ID of the path to update
 * @returns {Promise<Object>} Updated path
 */
const updatePathStats = async (pathId) => {
    // 1. Calculate Average Rating
    const avgRating = await ratingRepository.getAverageRatingForPath(pathId);
    const roundedRating = avgRating ? Math.round(parseFloat(avgRating)) : 0;

    // 2. Additional Stats: Total Trips (This could be cached or queried)
    // For now, let's assume we want to store this in the path's dynamic metadata
    const path = await pathRepository.getPathById(pathId);
    if (!path) return null;

    // Update the path with new rating
    const updatedPath = await pathRepository.updatePathRating(pathId, roundedRating);

    // NOTE: Further complex logic like trend analysis or 
    // "pothole density" could be added here by querying potholeRepository

    console.log(`[PathService] Stats updated for path ${pathId}: Rating=${roundedRating}`);
    return updatedPath;
};

/**
 * Get all paths, optionally filtered by search (path_name) and difficulty.
 * @param {Object} params - { search?: string, difficulty?: string, limit?: number, offset?: number }
 */
const getAllPaths = async (params = {}) => {
    return await pathRepository.getAllPaths(params);
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
