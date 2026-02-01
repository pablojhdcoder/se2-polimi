const ratingRepository = require('../../repositories/ratingRepository');
const pathService = require('../path-management/pathService');
const crypto = require('crypto');

/**
 * List ratings, optionally filtered by pathId (for GET /reviews?pathId= and GET /ratings?pathId=).
 * Returns enriched shape for UI: pathName, userName, comment, rating.
 * @param {Object} params - { pathId?: string, limit?: number }
 * @returns {Promise<Array>}
 */
const getRatings = async (params = {}) => {
    if (params.pathId) {
        return ratingRepository.getRatingsByPathIdEnriched(params.pathId);
    }
    return ratingRepository.getRatingsEnriched(params.limit || 100);
};

/**
 * Get a single rating by id (for GET /reviews/:id and GET /ratings/:id).
 * Returns enriched shape for UI: pathName, userName, comment, rating.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getRatingById = async (id) => {
    return ratingRepository.getRatingByIdEnriched(id);
};

/**
 * Adds a rating to a path and updates path's average rating.
 * Accepts pathId, points (or rating), opinion (or comment), reportedStatus.
 * @param {Object} ratingData Data for the new rating
 * @returns {Promise<Object>} Created rating
 */
const addRating = async (ratingData) => {
    const ratingId = crypto.randomUUID();
    const pointsRaw = ratingData.points ?? ratingData.rating ?? 5;
    const points = Math.min(5, Math.max(1, parseInt(pointsRaw, 10) || 5));
    const opinion = ratingData.opinion ?? ratingData.comment ?? null;
    const rating = {
        id: ratingId,
        userId: ratingData.userId,
        pathId: ratingData.pathId,
        points,
        opinion: opinion != null ? String(opinion) : null,
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
    getRatings,
    getRatingById,
    addRating,
    removeRating
};
