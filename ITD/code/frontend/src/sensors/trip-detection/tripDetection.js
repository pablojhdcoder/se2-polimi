/**
 * Detects a trip automatically based on sensor data.
 * @param {Object} sensorData - Current sensor readings (e.g., accelerometer, GPS).
 * @param {Object} options - Configuration and callbacks.
 * @param {Function} options.onTripDetected - Callback when a trip start is detected.
 * @param {Object} options.storage - Abstract storage interface.
 */
export const detectTripAutomatically = (sensorData, { onTripDetected, storage }) => {
    const MOVEMENT_THRESHOLD = 5.0; // Acceleration threshold (m/s^2)
    const SPEED_THRESHOLD = 2.0;    // Speed threshold (m/s)

    // Abstract logic to determine if a trip has started
    const isMoving = sensorData.acceleration > MOVEMENT_THRESHOLD || sensorData.speed > SPEED_THRESHOLD;

    if (isMoving) {
        console.log('Trip start detected automatically.');

        // Abstract storage logic
        if (storage && typeof storage.recordEvent === 'function') {
            storage.recordEvent('TRIP_START_DETECTED', sensorData);
        }

        if (onTripDetected) {
            onTripDetected(sensorData);
        }

        return true;
    }

    return false;
};

/**
 * Interface for storing sensor data during trip detection.
 * Users of detectTripAutomatically should provide an implementation of this.
 */
export class AbstractTripStorage {
    recordEvent(eventType, data) {
        throw new Error('recordEvent must be implemented');
    }

    saveData(data) {
        throw new Error('saveData must be implemented');
    }
}
