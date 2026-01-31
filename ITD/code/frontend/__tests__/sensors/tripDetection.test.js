/**
 * Unit tests for tripDetection: detectTripAutomatically, callbacks, storage, AbstractTripStorage.
 * Mock SensorManager so loading trip-detection (TripDetectionEngine) does not pull in expo-location.
 */
jest.mock('../../src/services/sensors/SensorManager', () => ({}));

const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

const { detectTripAutomatically, AbstractTripStorage } = require('../../src/sensors/trip-detection');

describe('tripDetection', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('detectTripAutomatically', () => {
    it('returns false when sensor data indicates no movement (low acceleration and speed)', () => {
      const sensorData = { acceleration: 1, speed: 0.5 };
      const result = detectTripAutomatically(sensorData, {});
      expect(result).toBe(false);
    });

    it('returns true when acceleration exceeds threshold', () => {
      const sensorData = { acceleration: 6, speed: 0 };
      const result = detectTripAutomatically(sensorData, {});
      expect(result).toBe(true);
    });

    it('returns true when speed exceeds threshold', () => {
      const sensorData = { acceleration: 0, speed: 3 };
      const result = detectTripAutomatically(sensorData, {});
      expect(result).toBe(true);
    });

    it('calls onTripDetected callback when trip is detected', () => {
      const sensorData = { acceleration: 6, speed: 0 };
      const onTripDetected = jest.fn();
      detectTripAutomatically(sensorData, { onTripDetected });
      expect(onTripDetected).toHaveBeenCalledTimes(1);
      expect(onTripDetected).toHaveBeenCalledWith(sensorData);
    });

    it('does not call onTripDetected when no trip detected', () => {
      const sensorData = { acceleration: 1, speed: 0 };
      const onTripDetected = jest.fn();
      detectTripAutomatically(sensorData, { onTripDetected });
      expect(onTripDetected).not.toHaveBeenCalled();
    });

    it('calls storage.recordEvent when trip detected and storage provided', () => {
      const sensorData = { acceleration: 6, speed: 0 };
      const storage = { recordEvent: jest.fn() };
      detectTripAutomatically(sensorData, { storage });
      expect(storage.recordEvent).toHaveBeenCalledTimes(1);
      expect(storage.recordEvent).toHaveBeenCalledWith('TRIP_START_DETECTED', sensorData);
    });

    it('does not call storage.recordEvent when no trip detected', () => {
      const sensorData = { acceleration: 1, speed: 0 };
      const storage = { recordEvent: jest.fn() };
      detectTripAutomatically(sensorData, { storage });
      expect(storage.recordEvent).not.toHaveBeenCalled();
    });

    it('does not throw when storage is missing', () => {
      const sensorData = { acceleration: 6, speed: 0 };
      expect(() => detectTripAutomatically(sensorData, {})).not.toThrow();
    });

    it('does not call storage.recordEvent when storage has no recordEvent function', () => {
      const sensorData = { acceleration: 6, speed: 0 };
      const storage = {};
      expect(() => detectTripAutomatically(sensorData, { storage })).not.toThrow();
    });
  });

  describe('AbstractTripStorage', () => {
    it('recordEvent throws when not overridden', () => {
      const storage = new AbstractTripStorage();
      expect(() => storage.recordEvent('EVENT', {})).toThrow('recordEvent must be implemented');
    });

    it('saveData throws when not overridden', () => {
      const storage = new AbstractTripStorage();
      expect(() => storage.saveData({})).toThrow('saveData must be implemented');
    });

    it('allows subclass to implement recordEvent and saveData', () => {
      class MockStorage extends AbstractTripStorage {
        recordEvent(eventType, data) {
          return { eventType, data };
        }
        saveData(data) {
          return data;
        }
      }
      const storage = new MockStorage();
      expect(storage.recordEvent('START', { x: 1 })).toEqual({ eventType: 'START', data: { x: 1 } });
      expect(storage.saveData({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });
  });
});
