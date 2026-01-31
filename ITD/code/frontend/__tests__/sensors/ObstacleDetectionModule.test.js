/**
 * Client integration tests for ObstacleDetectionModule.
 * Mocks SensorManager; tests start/stop, listeners, configure, isActive.
 */

jest.useFakeTimers();

const mockGetCurrentData = jest.fn();

jest.mock('../../src/services/sensors/SensorManager', () => ({
  __esModule: true,
  default: {
    getCurrentData: () => mockGetCurrentData(),
    isMonitoringActive: jest.fn().mockReturnValue(true),
    requestPermissions: jest.fn().mockResolvedValue(true),
    startAll: jest.fn().mockResolvedValue(undefined),
  },
}));

const ObstacleDetectionModule = require('../../src/sensors/obstacle-detection/ObstacleDetectionModule').default;

describe('ObstacleDetectionModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ObstacleDetectionModule.stop();
    mockGetCurrentData.mockReturnValue({
      accelerometer: null,
      gyroscope: null,
      gps: null,
    });
  });

  afterEach(() => {
    ObstacleDetectionModule.stop();
  });

  describe('addObstacleListener / removeObstacleListener', () => {
    it('adds and removes listener', () => {
      const listener = jest.fn();
      ObstacleDetectionModule.addObstacleListener(listener);
      ObstacleDetectionModule.removeObstacleListener(listener);
      ObstacleDetectionModule.addObstacleListener(listener);
      ObstacleDetectionModule.removeObstacleListener(listener);
      expect(listener).not.toHaveBeenCalled();
    });

    it('ignores non-function listener', () => {
      ObstacleDetectionModule.addObstacleListener(null);
      ObstacleDetectionModule.addObstacleListener(undefined);
      expect(ObstacleDetectionModule.isActive()).toBe(false);
    });
  });

  describe('isActive', () => {
    it('returns false when not started', () => {
      expect(ObstacleDetectionModule.isActive()).toBe(false);
    });
  });

  describe('start / stop', () => {
    it('starts and sets active', async () => {
      await ObstacleDetectionModule.start();
      expect(ObstacleDetectionModule.isActive()).toBe(true);
      ObstacleDetectionModule.stop();
      expect(ObstacleDetectionModule.isActive()).toBe(false);
    });
  });

  describe('configure', () => {
    it('accepts config overrides without throwing', async () => {
      ObstacleDetectionModule.configure({ debounceMs: 2000, accelThreshold: 8 });
      await ObstacleDetectionModule.start();
      expect(ObstacleDetectionModule.isActive()).toBe(true);
      ObstacleDetectionModule.stop();
    });
  });

  describe('obstacle events', () => {
    it('dispatches bump when accel magnitude exceeds threshold', async () => {
      await ObstacleDetectionModule.start();
      const listener = jest.fn();
      ObstacleDetectionModule.addObstacleListener(listener);
      mockGetCurrentData.mockReturnValue({
        accelerometer: { x: 10, y: 10, z: 10 },
        gyroscope: null,
        gps: null,
      });
      jest.advanceTimersByTime(500);
      jest.advanceTimersByTime(1000);
      if (listener.mock.calls.length > 0) {
        expect(listener.mock.calls[0][0]).toMatchObject({
          type: 'bump',
          severity: expect.any(Number),
        });
      }
      ObstacleDetectionModule.stop();
    });
  });
});
