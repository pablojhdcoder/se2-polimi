const pathService = require('../services/path-management/pathService');

/**
 * Handle path creation
 */
const createPath = async (req, res, next) => {
    try {
        const pathData = req.body;
        // Assume username comes from auth middleware
        if (req.user && req.user.username) {
            pathData.postedByUsername = req.user.username;
        }

        const path = await pathService.addPath(pathData);
        res.status(201).json({
            message: 'Path created successfully',
            path
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle getting all paths
 */
const getPaths = async (req, res, next) => {
    try {
        const paths = await pathService.getAllPaths();
        res.status(200).json(paths);
    } catch (error) {
        next(error);
    }
};

/**
 * Handle getting a path by ID
 */
const getPathById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const path = await pathService.getPathById(id);
        if (!path) {
            return res.status(404).json({ error: 'Path not found' });
        }
        res.status(200).json(path);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPath,
    getPaths,
    getPathById
};
