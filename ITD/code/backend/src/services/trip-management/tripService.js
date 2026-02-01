const tripRepository = require('../../repositories/tripRepository');
const userRepository = require('../../repositories/userRepository');
const weatherService = require('../external/weatherService');
const emailService = require('../external/emailService');
const { redisClient, connectRedis } = require('../../config/redis');
const crypto = require('crypto');

/**
 * Initiates the recording process for a trip.
 */
const trip_record = async (tripId) => {
    console.log(`Starting tracking for trip session: ${tripId}`);
    await connectRedis();
    await redisClient.set(`trip:${tripId}:active`, 'true', { EX: 3600 * 12 });
    return {
        status: 'recording_started',
        startTime: new Date(),
        trackingId: tripId
    };
};

/**
 * Automatically starts a trip initiated by sensor detection.
 */
const automaticTripStart = async (userId, pathId, sensorInitialData = {}) => {
    const tripId = crypto.randomUUID();

    let weather = {};
    if (sensorInitialData.latitude && sensorInitialData.longitude) {
        weather = await weatherService.getCurrentWeather(sensorInitialData.latitude, sensorInitialData.longitude);
    }

    const tripData = {
        id: tripId,
        userId,
        pathId,
        tripDate: new Date(),
        tripLength: 0,
        temperature: weather.temperature || sensorInitialData.temperature,
        windSpeed: weather.windSpeed || sensorInitialData.windSpeed,
        windDegree: weather.windDegree || sensorInitialData.windDegree,
        windGust: weather.windGust || sensorInitialData.windGust,
        visibility: weather.visibility || sensorInitialData.visibility,
        rain: weather.rain || sensorInitialData.rain,
        clouds: weather.clouds || sensorInitialData.clouds
    };

    const trip = await tripRepository.createTrip(tripData);
    await trip_record(tripId);
    return trip;
};

/**
 * Manually starts a trip.
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
    await trip_record(tripId);
    return trip;
};

/**
 * Updates the recorded trace for an ongoing or finished trip using Redis as a cache.
 */
const updateTripTrack = async (tripId, routeData = {}) => {
    await connectRedis();

    if (routeData && routeData.coordinates && routeData.coordinates.length > 0) {
        await redisClient.rPush(`trip:${tripId}:coords`, JSON.stringify(routeData.coordinates));
    }

    if (routeData && routeData.metadata && routeData.metadata.isFinal) {
        console.log(`[TripService] Finalizing trip ${tripId}. Flushing Redis to Postgres...`);

        const allCoordsRaw = await redisClient.lRange(`trip:${tripId}:coords`, 0, -1);
        const allCoords = allCoordsRaw.map(chunk => JSON.parse(chunk)).flat();

        const finalRouteData = {
            ...routeData,
            coordinates: allCoords
        };

        const tripLength = routeData.metadata?.tripLength ?? routeData.metadata?.durationMinutes ?? null;
        const updatedTrip = await tripRepository.updateTripRoute(tripId, finalRouteData, {
            tripLength: tripLength != null ? Number(tripLength) : null
        });

        // Email Summary
        try {
            const user = await userRepository.getUserById(updatedTrip.user_id);
            if (user && user.email) {
                emailService.sendTripSummary(user.email, updatedTrip).catch(err =>
                    console.error('[TripService] Summary email failed:', err)
                );
            }
        } catch (err) {
            console.error('[TripService] Could not fetch user for email notification:', err);
        }

        // Cleanup Redis
        await redisClient.del([`trip:${tripId}:coords`, `trip:${tripId}:active`]);

        return updatedTrip;
    }

    return { status: 'cached', tripId };
};

module.exports = {
    automaticTripStart,
    manualTripStart,
    updateTripTrack,
    trip_record
};
