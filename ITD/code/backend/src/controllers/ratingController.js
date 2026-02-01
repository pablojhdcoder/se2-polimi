const ratingService = require('../services/rating/ratingService');

/**
 * List ratings (GET /ratings or GET /reviews). Optional query: pathId.
 */
const getRatings = async (req, res, next) => {
    try {
        const { pathId } = req.query;
        const list = await ratingService.getRatings({ pathId });
        res.status(200).json(Array.isArray(list) ? list : []);
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single rating by id (GET /ratings/:id or GET /reviews/:id).
 */
const getRatingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rating = await ratingService.getRatingById(id);
        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }
        res.status(200).json(rating);
    } catch (error) {
        next(error);
    }
};

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
    getRatings,
    getRatingById,
    addRating,
    removeRating
};
