const tripService = require('../services/trip-management/tripService');

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
    updateTrack
};
