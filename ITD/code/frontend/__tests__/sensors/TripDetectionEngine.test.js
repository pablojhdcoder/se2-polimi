/**
 * Client integration tests for TripDetectionEngine.
 * Mocks SensorManager; tests state, start/stop, callbacks, getCurrentTripData.
 */

const mockGpsCallback = { current: null };

jest.mock('../../src/services/sensors/SensorManager', () => ({
  __esModule: true,
  default: {
    requestPermissions: jest.fn().mockResolvedValue(true),
    startGPS: jest.fn().mockImplementation((cb) => {
      mockGpsCallback.current = cb;
      return Promise.resolve();
    }),
    stopAll: jest.fn(),
    startAccelerometer: jest.fn(),
    startGyroscope: jest.fn(),
  },
}));

const tripDetection = require('../../src/sensors/trip-detection');
const TripDetectionEngine = tripDetection.default;
const {
  STATE_IDLE,
  STATE_RECORDING,
  STATE_TRIP_STARTED,
  STATE_TRIP_ENDED,
  TripState,
} = tripDetection;

describe('TripDetectionEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    TripDetectionEngine.stopRecording();
  });

  afterEach(() => {
    TripDetectionEngine.stopRecording();
  });

  describe('getState', () => {
    it('returns IDLE initially', () => {
      expect(TripDetectionEngine.getState()).toBe(STATE_IDLE);
    });
  });

  describe('getCurrentTripData', () => {
    it('returns empty track and null times when idle', () => {
      const data = TripDetectionEngine.getCurrentTripData();
      expect(data.track).toEqual([]);
      expect(data.startTime).toBeNull();
      expect(data.endTime).toBeNull();
      expect(data.state).toBe(STATE_IDLE);
    });
  });

  describe('getCurrentTripDurationMs', () => {
    it('returns 0 when not in trip', () => {
      expect(TripDetectionEngine.getCurrentTripDurationMs()).toBe(0);
    });
  });

  describe('startRecording / start', () => {
    it('throws when permission denied', async () => {
      const SensorManager = require('../../src/services/sensors/SensorManager').default;
      SensorManager.requestPermissions.mockResolvedValueOnce(false);
      await expect(TripDetectionEngine.start()).rejects.toThrow('Location permission denied');
    });

    it('moves to RECORDING and starts GPS when permission granted', async () => {
      await TripDetectionEngine.start();
      expect(TripDetectionEngine.getState()).toBe(STATE_RECORDING);
      const SensorManager = require('../../src/services/sensors/SensorManager').default;
      expect(SensorManager.startGPS).toHaveBeenCalled();
    });

    it('accumulates track points when GPS callback is invoked', async () => {
      await TripDetectionEngine.start();
      expect(mockGpsCallback.current).not.toBeNull();
      mockGpsCallback.current({
        latitude: 45.5,
        longitude: 9.2,
        speed: 0,
        timestamp: 1000,
      });
      const data = TripDetectionEngine.getCurrentTripData();
      expect(data.track).toHaveLength(1);
      expect(data.track[0]).toEqual({ lat: 45.5, lng: 9.2, timestamp: 1000 });
    });
  });

  describe('stopRecording / stop', () => {
    it('returns current trip data when already idle', () => {
      TripDetectionEngine.stopRecording();
      const data = TripDetectionEngine.stopRecording();
      expect(data.state).toBe(STATE_IDLE);
      expect(Array.isArray(data.track)).toBe(true);
    });

    it('calls SensorManager.stopAll when was recording', async () => {
      await TripDetectionEngine.start();
      const SensorManager = require('../../src/services/sensors/SensorManager').default;
      TripDetectionEngine.stopRecording();
      expect(SensorManager.stopAll).toHaveBeenCalled();
      expect(TripDetectionEngine.getState()).toBe(STATE_IDLE);
    });
  });

  describe('aliases', () => {
    it('start() is alias for startRecording()', async () => {
      await TripDetectionEngine.start();
      expect(TripDetectionEngine.getState()).toBe(STATE_RECORDING);
      TripDetectionEngine.stop();
    });

    it('stop() is alias for stopRecording()', async () => {
      await TripDetectionEngine.start();
      TripDetectionEngine.stop();
      expect(TripDetectionEngine.getState()).toBe(STATE_IDLE);
    });

    it('stopTripManually() ends trip like stopRecording()', async () => {
      await TripDetectionEngine.start();
      TripDetectionEngine.stopTripManually();
      expect(TripDetectionEngine.getState()).toBe(STATE_IDLE);
    });
  });

  describe('TripState', () => {
    it('exposes IDLE, DETECTING, IN_TRIP, STOPPING', () => {
      expect(TripState.IDLE).toBe(STATE_IDLE);
      expect(TripState.DETECTING).toBe(STATE_RECORDING);
      expect(TripState.IN_TRIP).toBe(STATE_TRIP_STARTED);
      expect(TripState.STOPPING).toBe(STATE_TRIP_ENDED);
    });
  });

  describe('onTripEnd assignable callback', () => {
    it('invokes onTripEnd when stopRecording after trip started', async () => {
      const onEnd = jest.fn();
      TripDetectionEngine.onTripEnd = onEnd;
      await TripDetectionEngine.start();
      for (let i = 0; i < 3; i++) {
        mockGpsCallback.current({ latitude: 45, longitude: 9, speed: 1, timestamp: Date.now() });
      }
      TripDetectionEngine.stopRecording();
      expect(onEnd).toHaveBeenCalled();
      const callData = onEnd.mock.calls[0][0];
      expect(callData).toHaveProperty('track');
      expect(callData).toHaveProperty('startTime');
      expect(callData).toHaveProperty('endTime');
      TripDetectionEngine.onTripEnd = null;
    });
  });
});
