/**
 * Handles real-time tracking of trip metrics such as time, length, and position.
 */
export const trip_record = (tripId) => {
    console.log(`[Frontend] Initializing real-time tracking for trip: ${tripId}`);

    let startTime = Date.now();
    let totalLength = 0;
    let currentPosition = null;
    let isTracking = true;

    // Simulate tracking process
    const trackingInterval = setInterval(() => {
        if (!isTracking) {
            clearInterval(trackingInterval);
            return;
        }

        // Mocking position update
        currentPosition = {
            latitude: Math.random() * 90,
            longitude: Math.random() * 180
        };

        // Mocking length increment
        totalLength += Math.random();

        console.log(`[Trip ${tripId}] Tracking: 
      Time: ${(Date.now() - startTime) / 1000}s 
      Length: ${totalLength.toFixed(2)}km 
      Position: (${currentPosition.latitude.toFixed(4)}, ${currentPosition.longitude.toFixed(4)})`);
    }, 5000);

    return {
        stop: () => {
            isTracking = false;
            console.log(`[Frontend] Tracking stopped for trip: ${tripId}`);
            return {
                tripId,
                totalTime: (Date.now() - startTime) / 1000,
                totalLength,
                finalPosition: currentPosition
            };
        }
    };
};

export default trip_record;
