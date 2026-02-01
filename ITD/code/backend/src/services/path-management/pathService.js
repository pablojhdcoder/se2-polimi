const pathRepository = require('../../repositories/pathRepository');
const ratingRepository = require('../../repositories/ratingRepository');
const userRepository = require('../../repositories/userRepository');
const tripRepository = require('../../repositories/tripRepository');
const weatherService = require('../external/weatherService');
const crypto = require('crypto');

/**
 * Adds a new path to the system. Fetches weather at origin (start coords) and stores it.
 * @param {Object} pathData Data for the new path
 * @returns {Promise<Object>} Created path
 */
const addPath = async (pathData) => {
    console.log('[PathService] ========== ADD PATH START ==========');
    console.log('[PathService] Input data:', JSON.stringify(pathData, null, 2));
    
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
        destinationPlace: pathData.endPoint != null && String(pathData.endPoint).trim() ? String(pathData.endPoint).trim() : null,
        description: pathData.description != null && String(pathData.description).trim() !== '' ? String(pathData.description).trim() : null,
        difficulty: pathData.difficulty != null && String(pathData.difficulty).trim() !== '' ? String(pathData.difficulty).trim() : null
    };
    if (path.durationMinutes != null && Number.isNaN(path.durationMinutes)) {
        path.durationMinutes = null;
    }

    console.log('[PathService] Normalized path object:', JSON.stringify(path, null, 2));

    const hasWeatherFromFrontend = pathData.temperature != null || pathData.windSpeed != null;
    if (hasWeatherFromFrontend) {
        console.log('[PathService] Using weather from frontend');
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
            console.log('[PathService] Fetching weather for coords:', startX, startY);
            try {
                const weather = await weatherService.getCurrentWeather(startY, startX);
                console.log('[PathService] Weather fetched:', weather);
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

    console.log('[PathService] Calling pathRepository.createPath...');
    const createdPath = await pathRepository.createPath(path);
    console.log('[PathService] Path created in DB:', createdPath ? createdPath.id : 'NULL');
    
    const creator = await userRepository.getUserById(path.postedByUserId);
    console.log('[PathService] Creator found:', creator ? creator.id : 'NULL');
    
    if (creator && createdPath && createdPath.id) {
        try {
            console.log('[PathService] Creating default rating...');
            await ratingRepository.createRating({
                id: crypto.randomUUID(),
                userId: creator.id,
                pathId: createdPath.id,
                points: 5,
                opinion: 'great path',
                reportedStatus: 'optimal'
            });
            console.log('[PathService] Default rating created');
        } catch (err) {
            console.warn('[PathService] Default rating creation failed:', err.message);
        }
        console.log('[PathService] Updating path rating to 5...');
        await pathRepository.updatePathRating(createdPath.id, 5);
        
        // Create associated trip automatically
        try {
            console.log('[PathService] Creating associated trip for path...');
            const tripData = {
                id: crypto.randomUUID(),
                userId: creator.id,
                pathId: createdPath.id,
                tripDate: new Date(),
                tripLength: path.durationMinutes ?? 0,
                personalRating: null,
                temperature: path.temperature ?? null,
                windSpeed: path.windSpeed ?? null,
                windDegree: path.windDegree ?? null,
                windGust: path.windGust ?? null,
                visibility: path.visibility ?? null,
                rain: path.rain ?? null,
                clouds: path.clouds ?? null,
                recordedRoute: path.routeData ?? null
            };
            await tripRepository.createTrip(tripData);
            console.log('[PathService] Associated trip created successfully');
        } catch (err) {
            console.warn('[PathService] Associated trip creation failed:', err.message);
        }
        
        const pathWithRating = await pathRepository.getPathById(createdPath.id);
        console.log('[PathService] ========== ADD PATH END (SUCCESS) ==========');
        return pathWithRating || createdPath;
    }
    console.log('[PathService] ========== ADD PATH END (NO RATING) ==========');
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
 * Get all paths created by the given user ID (includes drafts and published).
 */
const getPathsByUserId = async (userId) => {
    return await pathRepository.getPathsByUserId(userId);
};

/**
 * Update the published state of a path.
 * @param {string} id - Path ID
 * @param {boolean} isPublished
 * @returns {Promise<Object>} Updated path
 */
const updatePathPublished = async (id, isPublished) => {
    return await pathRepository.updatePathPublished(id, isPublished);
};

module.exports = {
    addPath,
    updatePathStats,
    getAllPaths,
    getPathsByOriginDestination,
    getPathById,
    getPathsByUserId,
    updatePathPublished
};
