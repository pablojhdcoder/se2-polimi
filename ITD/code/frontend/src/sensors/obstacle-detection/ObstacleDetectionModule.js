/**
 * Obstacle Detection Module
 *
 * Uses SensorManager (accelerometer and gyroscope) to detect obstacle-like events
 * (bumps, curbs, sudden braking). Exposes a clear interface for the UI to react.
 *
 * Usage:
 *   import ObstacleDetectionModule from '../sensors/obstacle-detection/ObstacleDetectionModule';
 *   const listener = (event) => { ... };
 *   ObstacleDetectionModule.addObstacleListener(listener);
 *   ObstacleDetectionModule.start();
 *   ObstacleDetectionModule.removeObstacleListener(listener);
 *   ObstacleDetectionModule.stop();
 */

import SensorManager from '../../services/sensors/SensorManager';

const DEFAULT_CONFIG = {
  /** Sample interval (ms) */
  sampleIntervalMs: 50,
  /** Acceleration threshold (m/s²) above baseline to consider a bump */
  accelThreshold: 4.0,
  /** Gyro threshold (rad/s) to consider sharp turn */
  gyroThreshold: 2.0,
  /** Time window (ms) to avoid firing two events in a row (debounce) */
  debounceMs: 800,
  /** Number of samples to smooth baseline */
  baselineSamples: 20,
};

class ObstacleDetectionModuleClass {
  constructor() {
    this._config = { ...DEFAULT_CONFIG };
    this._listeners = new Set();
    this._running = false;
    this._accelBaseline = { x: 0, y: 0, z: 0 };
    this._gyroBaseline = { x: 0, y: 0, z: 0 };
    this._accelSamples = [];
    this._gyroSamples = [];
    this._lastEventTime = 0;
    this._sampleTimer = null;
  }

  /**
   * Optional configuration. Call before start() if needed.
   */
  configure(overrides) {
    this._config = { ...this._config, ...overrides };
  }

  /**
   * Adds a listener that will receive events { type, severity, timestamp, accel?, gyro? }.
   */
  addObstacleListener(callback) {
    if (typeof callback === 'function') {
      this._listeners.add(callback);
    }
  }

  /**
   * Removes a previously added listener.
   */
  removeObstacleListener(callback) {
    this._listeners.delete(callback);
  }

  _updateBaseline(accel, gyro) {
    if (accel) {
      this._accelSamples.push(accel);
      if (this._accelSamples.length > this._config.baselineSamples) {
        this._accelSamples.shift();
      }
      if (this._accelSamples.length >= 3) {
        const n = this._accelSamples.length;
        this._accelBaseline = {
          x: this._accelSamples.reduce((s, p) => s + p.x, 0) / n,
          y: this._accelSamples.reduce((s, p) => s + p.y, 0) / n,
          z: this._accelSamples.reduce((s, p) => s + p.z, 0) / n,
        };
      }
    }
    if (gyro) {
      this._gyroSamples.push(gyro);
      if (this._gyroSamples.length > this._config.baselineSamples) {
        this._gyroSamples.shift();
      }
      if (this._gyroSamples.length >= 3) {
        const n = this._gyroSamples.length;
        this._gyroBaseline = {
          x: this._gyroSamples.reduce((s, p) => s + p.x, 0) / n,
          y: this._gyroSamples.reduce((s, p) => s + p.y, 0) / n,
          z: this._gyroSamples.reduce((s, p) => s + p.z, 0) / n,
        };
      }
    }
  }

  _dispatch(event) {
    const now = Date.now();
    if (now - this._lastEventTime < this._config.debounceMs) {
      return;
    }
    this._lastEventTime = now;
    this._listeners.forEach(cb => {
      try {
        cb({ ...event, timestamp: now });
      } catch (err) {
        console.warn('ObstacleDetection listener error:', err);
      }
    });
  }

  _sample() {
    if (!this._running) return;

    const data = SensorManager.getCurrentData();
    const accel = data.accelerometer;
    const gyro = data.gyroscope;

    this._updateBaseline(accel, gyro);

    if (accel) {
      const dx = accel.x - this._accelBaseline.x;
      const dy = accel.y - this._accelBaseline.y;
      const dz = accel.z - this._accelBaseline.z;
      const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (magnitude >= this._config.accelThreshold) {
        const severity = Math.min(1, magnitude / (this._config.accelThreshold * 2));
        this._dispatch({
          type: 'bump',
          severity,
          accel: { x: accel.x, y: accel.y, z: accel.z },
          deltaMagnitude: magnitude,
        });
      }
    }

    if (gyro) {
      const dx = gyro.x - this._gyroBaseline.x;
      const dy = gyro.y - this._gyroBaseline.y;
      const dz = gyro.z - this._gyroBaseline.z;
      const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (magnitude >= this._config.gyroThreshold) {
        const severity = Math.min(1, magnitude / (this._config.gyroThreshold * 2));
        this._dispatch({
          type: 'rotation_spike',
          severity,
          gyro: { x: gyro.x, y: gyro.y, z: gyro.z },
          deltaMagnitude: magnitude,
        });
      }
    }
  }

  /**
   * Starts obstacle detection. Requires sensors to be active (e.g. already started by TripDetectionEngine).
   * If not active, they are started here.
   */
  async start() {
    if (this._running) return;

    if (!SensorManager.isMonitoringActive()) {
      const hasPermission = await SensorManager.requestPermissions();
      if (!hasPermission) {
        throw new Error('ObstacleDetection: permission denied');
      }
      await SensorManager.startAll({
        accelerometer: () => {},
        gyroscope: () => {},
        gps: () => {},
      });
    }

    this._running = true;
    this._accelSamples = [];
    this._gyroSamples = [];
    this._lastEventTime = 0;

    this._sampleTimer = setInterval(() => {
      this._sample();
    }, this._config.sampleIntervalMs);
  }

  /**
   * Stops detection. Does not stop SensorManager (in case Trip Detection uses it);
   * only stops sampling and firing events.
   */
  stop() {
    this._running = false;
    if (this._sampleTimer) {
      clearInterval(this._sampleTimer);
      this._sampleTimer = null;
    }
  }

  /**
   * Returns whether the module is active.
   */
  isActive() {
    return this._running;
  }
}

const ObstacleDetectionModule = new ObstacleDetectionModuleClass();
export default ObstacleDetectionModule;
