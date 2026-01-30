const ratingRepository = require('../../repositories/ratingRepository');
const pathService = require('../path-management/pathService');
const crypto = require('crypto');

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
    await pathService.updatePathStats(ratingData.pathId);

    return newRating;
};

/**
 * Removes a rating from a path and updates path's average rating.
 * @param {string} ratingId ID of the rating to remove
 * @returns {Promise<Object>} Deleted rating
 */
const removeRating = async (ratingId) => {
    const deletedRating = await ratingRepository.deleteRating(ratingId);

    if (deletedRating) {
        await pathService.updatePathStats(deletedRating.path_id);
    }

    return deletedRating;
};

module.exports = {
    addRating,
    removeRating
};
