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
 * Adds a rating to a path and updates path's average rating.
 * @param {Object} ratingData Data for the new rating
 * @returns {Promise<Object>} Created rating
 */
const addRating = async (ratingData) => {
    const ratingId = crypto.randomUUID();
    const rating = {
        id: ratingId,
        ...ratingData,
        reportedStatus: ratingData.reportedStatus || 'optimal'
    };

    const newRating = await ratingRepository.createRating(rating);

    // Update path information
    await updatePathStats(ratingData.pathId);

    return newRating;
};

/**
 * Removes a rating from a path and updates path's average rating.
 * @param {string} ratingId ID of the rating to remove
 * @returns {Promise<Object>} Deleted rating
 */
const removeRating = async (ratingId) => {
    // We need the pathId to update stats after deletion
    // Getting all ratings for a path might be needed or just get the one being deleted first
    const ratings = await ratingRepository.getRatingsByPathId(); // This is not efficient, we should find by ratingId
    // Actually, I should add getRatingById to repository, but I can use deleteRating 
    // which returns the deleted row.

    const deletedRating = await ratingRepository.deleteRating(ratingId);

    if (deletedRating) {
        await updatePathStats(deletedRating.path_id);
    }

    return deletedRating;
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

module.exports = {
    addPath,
    addRating,
    removeRating,
    updatePathStats
};
