const pathRepository = require('../../repositories/pathRepository');
const ratingRepository = require('../../repositories/ratingRepository');
const userRepository = require('../../repositories/userRepository');
const weatherService = require('../external/weatherService');
const crypto = require('crypto');

/**
 * Adds a new path to the system. Fetches weather at origin (start coords) and stores it.
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
        routeData: pathData.routeData ?? null,
        isPublished: pathData.isPublished !== false && pathData.publish !== false,
        durationMinutes: pathData.durationMinutes != null ? parseInt(pathData.durationMinutes, 10) : null,
        originPlace: pathData.startPoint != null && String(pathData.startPoint).trim() ? String(pathData.startPoint).trim() : null,
        destinationPlace: pathData.endPoint != null && String(pathData.endPoint).trim() ? String(pathData.endPoint).trim() : null
    };
    if (path.durationMinutes != null && Number.isNaN(path.durationMinutes)) {
        path.durationMinutes = null;
    }

    const hasWeatherFromFrontend = pathData.temperature != null || pathData.windSpeed != null;
    if (hasWeatherFromFrontend) {
        path.temperature = pathData.temperature != null ? Math.round(Number(pathData.temperature)) : null;
        path.windSpeed = pathData.windSpeed != null ? Math.round(Number(pathData.windSpeed)) : null;
        path.windDegree = pathData.windDegree != null ? Math.round(Number(pathData.windDegree)) : null;
        path.windGust = pathData.windGust != null ? Number(pathData.windGust) : null;
        path.visibility = pathData.visibility != null ? Math.round(Number(pathData.visibility)) : null;
        path.rain = pathData.rain != null ? Number(pathData.rain) : null;
        path.clouds = pathData.clouds != null ? Math.round(Number(pathData.clouds)) : null;
    } else {
        const startX = path.startX != null ? Number(path.startX) : NaN;
        const startY = path.startY != null ? Number(path.startY) : NaN;
        if (!Number.isNaN(startX) && !Number.isNaN(startY)) {
            try {
                const weather = await weatherService.getCurrentWeather(startY, startX);
                path.temperature = weather.temperature != null ? Math.round(weather.temperature) : null;
                path.windSpeed = weather.windSpeed != null ? Math.round(weather.windSpeed) : null;
                path.windDegree = weather.windDegree != null ? Math.round(weather.windDegree) : null;
                path.windGust = weather.windGust != null ? Number(weather.windGust) : null;
                path.visibility = weather.visibility != null ? Math.round(weather.visibility) : null;
                path.rain = weather.rain != null ? Number(weather.rain) : null;
                path.clouds = weather.clouds != null ? Math.round(weather.clouds) : null;
            } catch (err) {
                console.warn('[PathService] Weather fetch failed, path created without weather:', err.message);
            }
        }
    }

    const createdPath = await pathRepository.createPath(path);
    const creator = await userRepository.getUserByUsername(path.postedByUsername);
    if (creator && createdPath && createdPath.id) {
        try {
            await ratingRepository.createRating({
                id: crypto.randomUUID(),
                userId: creator.id,
                pathId: createdPath.id,
                points: 5,
                opinion: 'great path',
                reportedStatus: 'optimal'
            });
        } catch (err) {
            console.warn('[PathService] Default rating creation failed:', err.message);
        }
        await pathRepository.updatePathRating(createdPath.id, 5);
        const pathWithRating = await pathRepository.getPathById(createdPath.id);
        return pathWithRating || createdPath;
    }
    return createdPath;
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

    console.log(`[PathService] Stats updated for path ${pathId}: Rating=${roundedRating}`);
    return updatedPath;
};

/**
 * Get all paths, optionally filtered by search (path_name or origin/destination place) and difficulty.
 * @param {Object} params - { search?: string, searchByPlace?: boolean, limit?: number, offset?: number }
 */
const getAllPaths = async (params = {}) => {
    return await pathRepository.getAllPaths(params);
};

/**
 * Get published paths filtered by origin and/or destination place names.
 * @param {Object} params - { origin?: string, destination?: string, limit?: number, offset?: number }
 */
const getPathsByOriginDestination = async (params = {}) => {
    return await pathRepository.getPathsByOriginDestination(params);
};

/**
 * Get path by ID
 */
const getPathById = async (id) => {
    return await pathRepository.getPathById(id);
};

/**
 * Get all paths created by the given username (includes drafts and published).
 */
const getPathsByUsername = async (username) => {
    return await pathRepository.getPathsByUsername(username);
};

/**
 * Update path published flag (owner only; enforced in controller).
 * @param {string} pathId Path ID
 * @param {boolean} isPublished
 * @returns {Promise<Object|null>} Updated path or null
 */
const updatePathPublished = async (pathId, isPublished) => {
    return await pathRepository.updatePathPublished(pathId, isPublished);
};

module.exports = {
    addPath,
    updatePathStats,
    getAllPaths,
    getPathsByOriginDestination,
    getPathById,
    getPathsByUsername,
    updatePathPublished
};
