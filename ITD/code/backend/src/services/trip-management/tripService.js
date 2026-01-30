const tripRepository = require('../../repositories/tripRepository');
const crypto = require('crypto');

/**
 * Initiates the recording process for a trip.
 * This function handles the logic for starting the tracking of trip metrics.
 * 
 * @param {string} tripId - The ID of the trip to record.
 */
const trip_record = (tripId) => {
    console.log(`Starting tracking for trip session: ${tripId}`);
    // In a real implementation, this might start a background job,
    // initialize a cache for real-time coordinates, or notify other services.
    return {
        status: 'recording_started',
        startTime: new Date(),
        trackingId: tripId
    };
};

/**
 * Automatically starts a trip initiated by sensor detection.
 * 
 * @param {string} userId - ID of the user starting the trip.
 * @param {string} pathId - ID of the path being taken.
 * @param {Object} sensorInitialData - Initial data from sensors (weather, etc).
 * @returns {Promise<Object>} The created trip record.
 */
const automaticTripStart = async (userId, pathId, sensorInitialData = {}) => {
    const tripId = crypto.randomUUID();

    const tripData = {
        id: tripId,
        userId,
        pathId,
        tripDate: new Date(),
        tripLength: 0,
        temperature: sensorInitialData.temperature,
        windSpeed: sensorInitialData.windSpeed,
        windDegree: sensorInitialData.windDegree,
        windGust: sensorInitialData.windGust,
        visibility: sensorInitialData.visibility,
        rain: sensorInitialData.rain,
        clouds: sensorInitialData.clouds
    };

    const trip = await tripRepository.createTrip(tripData);

    // Trigger tracking recording
    trip_record(tripId);

    return trip;
};

/**
 * Manually starts a trip.
 * 
 * @param {string} userId - ID of the user starting the trip.
 * @param {string} pathId - ID of the path being taken.
 * @returns {Promise<Object>} The created trip record.
 */
const manualTripStart = async (userId, pathId) => {
    const tripId = crypto.randomUUID();

    const tripData = {
        id: tripId,
        userId,
        pathId,
        tripDate: new Date(),
        tripLength: 0
    };

    const trip = await tripRepository.createTrip(tripData);

    // Trigger tracking recording
    trip_record(tripId);

    return trip;
};

module.exports = {
    automaticTripStart,
    manualTripStart,
    trip_record
};
