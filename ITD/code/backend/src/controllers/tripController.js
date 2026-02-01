const tripService = require('../services/trip-management/tripService');
const tripRepository = require('../repositories/tripRepository');

/**
 * Handle manual trip start
 */
const startManualTrip = async (req, res, next) => {
    try {
        const { pathId } = req.body;
        const userId = req.user.id;

        const trip = await tripService.manualTripStart(userId, pathId);
        res.status(201).json({
            message: 'Trip started manually',
            trip
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle automatic trip start (usually by sensor detection)
 */
const startAutomaticTrip = async (req, res, next) => {
    try {
        const { pathId, sensorData } = req.body;
        const userId = req.user.id;

        const trip = await tripService.automaticTripStart(userId, pathId, sensorData);
        res.status(201).json({
            message: 'Trip started automatically',
            trip
        });
    } catch (error) {
        next(error);
    }
};

/**
 * List trips for the authenticated user
 */
const getMyTrips = async (req, res, next) => {
    try {
        console.log('[TripController] ========== GET MY TRIPS ==========');
        const userId = req.user.id;
        console.log('[TripController] User ID:', userId);
        
        const trips = await tripRepository.getTripsByUserId(userId);
        console.log('[TripController] Found', trips.length, 'trips');
        
        if (trips.length > 0) {
            console.log('[TripController] First trip sample:', JSON.stringify(trips[0], null, 2));
        }
        
        res.status(200).json({ data: trips });
        console.log('[TripController] ========== END GET MY TRIPS ==========');
    } catch (error) {
        console.error('[TripController] ERROR getting trips:', error);
        next(error);
    }
};

/**
 * Get a single trip by id (must belong to the user)
 */
const getTripById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const trip = await tripRepository.getTripById(id);
        if (!trip || trip.user_id !== userId) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.status(200).json({ data: trip });
    } catch (error) {
        next(error);
    }
};

/**
 * Update the recorded route data for a trip
 */
const updateTrack = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Handle both nested { routeData: { ... } } and flat { coordinates: ... } structures
        const routeData = req.body.routeData || req.body;

        const updatedTrip = await tripService.updateTripTrack(id, routeData);
        res.status(200).json({
            message: 'Trip track updated',
            trip: updatedTrip
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    startManualTrip,
    startAutomaticTrip,
    getMyTrips,
    getTripById,
    updateTrack
};
