const pathService = require('../services/path-management/pathService');
const pathRepository = require('../repositories/pathRepository');
const savedPathRepository = require('../repositories/savedPathRepository');

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
 * Handle getting all paths. Query: search (path name), difficulty, limit, offset.
 */
const getPaths = async (req, res, next) => {
    try {
        const { search, limit, offset } = req.query;
        const paths = await pathService.getAllPaths({
            search,
            limit: limit ? parseInt(limit, 10) : 100,
            offset: offset ? parseInt(offset, 10) : 0
        });
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

/**
 * Save a path to the authenticated user's saved list
 */
const savePath = async (req, res, next) => {
    try {
        const { id } = req.params;
        const path = await pathRepository.getPathById(id);
        if (!path) {
            return res.status(404).json({ error: 'Path not found.' });
        }
        const username = req.user.username;
        await savedPathRepository.savePath(username, path.path_name);
        res.status(201).json({ message: 'Path saved.', path_name: path.path_name });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Path already saved.' });
        }
        next(error);
    }
};

/**
 * Remove a path from the authenticated user's saved list
 */
const unsavePath = async (req, res, next) => {
    try {
        const { id } = req.params;
        const path = await pathRepository.getPathById(id);
        if (!path) {
            return res.status(404).json({ error: 'Path not found.' });
        }
        const username = req.user.username;
        const deleted = await savedPathRepository.deleteSavedPath(username, path.path_name);
        if (!deleted) {
            return res.status(404).json({ error: 'Saved path not found.' });
        }
        res.status(200).json({ message: 'Path unsaved.' });
    } catch (error) {
        next(error);
    }
};

/**
 * Stub: paths near a location. Returns empty array until geo search is implemented.
 */
const getNearbyPaths = async (req, res, next) => {
    try {
        res.status(200).json([]);
    } catch (error) {
        next(error);
    }
};

/**
 * Stub: paths between two points. Returns empty array until route search is implemented.
 */
const getRelatedPaths = async (req, res, next) => {
    try {
        res.status(200).json([]);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPath,
    getPaths,
    getPathById,
    getNearbyPaths,
    getRelatedPaths,
    savePath,
    unsavePath
};
