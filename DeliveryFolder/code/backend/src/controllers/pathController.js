const pathService = require('../services/path-management/pathService');
const pathRepository = require('../repositories/pathRepository');
const savedPathRepository = require('../repositories/savedPathRepository');

/**
 * Handle path creation
 */
const createPath = async (req, res, next) => {
    try {
        const pathData = req.body;
        // Use user ID from auth middleware (req.user should have id)
        if (req.user && req.user.id) {
            pathData.postedByUserId = req.user.id;
        }
        pathData.isPublished = req.body.publish ?? req.body.isPublished ?? true;

        const path = await pathService.addPath(pathData);
        res.status(201).json({
            message: 'Path created successfully',
            path
        });
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'paths_path_name_key') {
            return res.status(409).json({
                error: 'A path with this name already exists.',
                code: 'PATH_NAME_DUPLICATE'
            });
        }
        next(error);
    }
};

/**
 * Handle getting all paths. Query: search (path name or place), searchByPlace, limit, offset.
 */
const getPaths = async (req, res, next) => {
    try {
        const { search, searchByPlace, limit, offset } = req.query;
        const paths = await pathService.getAllPaths({
            search,
            searchByPlace: searchByPlace === 'true' || searchByPlace === '1',
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
        const userId = req.user.id;
        await savedPathRepository.savePath(userId, id);
        res.status(201).json({ message: 'Path saved.', path_id: id });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Path already saved.' });
        }
        next(error);
    }
};

/**
 * List paths saved by the authenticated user (favorites)
 */
const getSavedPaths = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const paths = await savedPathRepository.getSavedPathsByUserId(userId);
        res.status(200).json(paths);
    } catch (error) {
        next(error);
    }
};

/**
 * Remove a path from the authenticated user's saved list
 */
const unsavePath = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deleted = await savedPathRepository.deleteSavedPath(userId, id);
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
 * Paths between two points (origin/destination). Filters by origin_place / destination_place when provided.
 */
const getRelatedPaths = async (req, res, next) => {
    try {
        let { origin, destination } = req.query;
        if (typeof origin === 'string') {
            try { origin = JSON.parse(origin); } catch (_) { /* use as-is */ }
        }
        if (typeof destination === 'string') {
            try { destination = JSON.parse(destination); } catch (_) { /* use as-is */ }
        }
        const hasPlaceFilter = (origin && String(origin).trim()) || (destination && String(destination).trim());
        const paths = hasPlaceFilter
            ? await pathService.getPathsByOriginDestination({
                origin: origin ? String(origin).trim() : undefined,
                destination: destination ? String(destination).trim() : undefined,
                limit: 20,
                offset: 0
            })
            : await pathService.getAllPaths({ limit: 20, offset: 0 });
        res.status(200).json(paths);
    } catch (error) {
        next(error);
    }
};

/**
 * List paths created by the authenticated user (includes drafts and published).
 */
const getMyPaths = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const paths = await pathService.getPathsByUserId(userId);
        res.status(200).json(paths);
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH path (owner only). Supports { publish: boolean } to set is_published.
 */
const patchPath = async (req, res, next) => {
    try {
        const { id } = req.params;
        const path = await pathService.getPathById(id);
        if (!path) {
            return res.status(404).json({ error: 'Path not found' });
        }
        if (path.posted_by_user_id !== req.user.id) {
            return res.status(403).json({ error: 'Only the path owner can update it' });
        }
        const publish = req.body.publish ?? req.body.isPublished;
        if (typeof publish !== 'boolean') {
            return res.status(400).json({ error: 'Body must include publish (boolean)' });
        }
        const updated = await pathService.updatePathPublished(id, publish);
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPath,
    getPaths,
    getPathById,
    getSavedPaths,
    getMyPaths,
    patchPath,
    getNearbyPaths,
    getRelatedPaths,
    savePath,
    unsavePath
};
