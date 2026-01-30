const ratingService = require('../services/rating/ratingService');

/**
 * Handle rating creation
 */
const addRating = async (req, res, next) => {
    try {
        const ratingData = req.body;
        // Assume userId comes from auth middleware
        if (req.user && req.user.id) {
            ratingData.userId = req.user.id;
        }

        const rating = await ratingService.addRating(ratingData);
        res.status(201).json({
            message: 'Rating added successfully',
            rating
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle rating removal
 */
const removeRating = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await ratingService.removeRating(id);
        res.status(200).json({
            message: 'Rating removed successfully',
            result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addRating,
    removeRating
};
