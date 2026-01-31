/**
 * Unit tests for tripRecorder.js: trip_record, stop, output format.
 */

jest.useFakeTimers();

const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

const { trip_record } = require('../../src/sensors/trip-detection/tripRecorder');

describe('tripRecorder (trip_record)', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('returns an object with a stop function', () => {
    const controller = trip_record('trip-1');
    expect(controller).toBeDefined();
    expect(typeof controller.stop).toBe('function');
  });

  it('stop returns object with tripId, totalTime, totalLength, finalPosition', () => {
    const controller = trip_record('trip-42');
    jest.advanceTimersByTime(100);
    const result = controller.stop();
    expect(result).toHaveProperty('tripId', 'trip-42');
    expect(result).toHaveProperty('totalTime');
    expect(typeof result.totalTime).toBe('number');
    expect(result.totalTime).toBeGreaterThanOrEqual(0);
    expect(result).toHaveProperty('totalLength');
    expect(typeof result.totalLength).toBe('number');
    expect(result).toHaveProperty('finalPosition');
    expect(result.finalPosition).toBeNull(); // may be null before first interval (5s)
  });

  it('after one interval, finalPosition is an object with latitude and longitude', () => {
    const controller = trip_record('trip-2');
    jest.advanceTimersByTime(6000);
    const result = controller.stop();
    expect(result.finalPosition).not.toBeNull();
    expect(result.finalPosition).toHaveProperty('latitude');
    expect(result.finalPosition).toHaveProperty('longitude');
    expect(typeof result.finalPosition.latitude).toBe('number');
    expect(typeof result.finalPosition.longitude).toBe('number');
  });

  it('totalTime is in seconds', () => {
    const controller = trip_record('trip-3');
    jest.advanceTimersByTime(2500);
    const result = controller.stop();
    expect(result.totalTime).toBeGreaterThanOrEqual(2);
    expect(result.totalTime).toBeLessThan(3);
  });

  it('calling stop multiple times does not throw', () => {
    const controller = trip_record('trip-4');
    const r1 = controller.stop();
    const r2 = controller.stop();
    expect(r1).toHaveProperty('tripId', 'trip-4');
    expect(r2).toHaveProperty('tripId', 'trip-4');
  });

  it('logs when initializing and when stopping', () => {
    trip_record('trip-log');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Initializing real-time tracking'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('trip-log'));
    const controller = trip_record('trip-log2');
    controller.stop();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Tracking stopped'));
  });
});
