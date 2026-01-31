/**
 * Trip Detection Engine - Detects trip start/end using SensorManager (GPS + accelerometer/gyroscope).
 * States: IDLE | RECORDING | TRIP_STARTED | TRIP_ENDED
 * Exports: startRecording(), stopRecording(), getState(), getCurrentTripData(), start(), stop(), getCurrentTripDurationMs(), TripState.
 * Callbacks: onStateChange(cb), removeOnStateChange(cb), onTripStart(cb), removeOnTripStart(cb), onTripEnd(cb), removeOnTripEnd(cb).
 */

import SensorManager from '../../services/sensors/SensorManager';

const STATE_IDLE = 'IDLE';
const STATE_RECORDING = 'RECORDING';
const STATE_TRIP_STARTED = 'TRIP_STARTED';
const STATE_TRIP_ENDED = 'TRIP_ENDED';

/** Aliases for RecordTripScreen: IDLE, DETECTING (= RECORDING), IN_TRIP (= TRIP_STARTED), STOPPING (= TRIP_ENDED) */
export const TripState = {
  IDLE: STATE_IDLE,
  DETECTING: STATE_RECORDING,
  IN_TRIP: STATE_TRIP_STARTED,
  STOPPING: STATE_TRIP_ENDED,
};

// Speed threshold (m/s) to consider "in motion"
const SPEED_THRESHOLD = 0.5;
const IDLE_SECONDS_TO_END = 30;
const MOVEMENT_SECONDS_TO_START = 3;

class TripDetectionEngine {
  constructor() {
    this.state = STATE_IDLE;
    this.track = [];
    this.tripStartTime = null;
    this.tripEndTime = null;
    this.onStateChangeCallbacks = [];
    this.onTripStartCallbacks = [];
    this.onTripEndCallbacks = [];
    this._movementCount = 0;
    this._idleCount = 0;
    this._gpsUnsubscribe = null;
  }

  _emitStateChange() {
    this.onStateChangeCallbacks.forEach((cb) => cb(this.state));
  }

  onStateChange(callback) {
    if (typeof callback === 'function') this.onStateChangeCallbacks.push(callback);
  }

  removeOnStateChange(callback) {
    this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter((cb) => cb !== callback);
  }

  removeOnTripStart(callback) {
    this.onTripStartCallbacks = this.onTripStartCallbacks.filter((cb) => cb !== callback);
  }

  removeOnTripEnd(callback) {
    this.onTripEndCallbacks = this.onTripEndCallbacks.filter((cb) => cb !== callback);
  }

  getState() {
    return this.state;
  }

  /**
   * Returns current trip duration in ms (since trip start). Returns 0 if not in trip.
   */
  getCurrentTripDurationMs() {
    if (!this.tripStartTime || this.state !== STATE_TRIP_STARTED) return 0;
    return Date.now() - this.tripStartTime;
  }

  /**
   * Start detection (alias for startRecording). For RecordTripScreen.
   */
  async start() {
    return this.startRecording();
  }

  /**
   * Stop detection (alias for stopRecording). For RecordTripScreen.
   */
  stop() {
    return this.stopRecording();
  }

  /**
   * End trip manually (same as stopRecording). For RecordTripScreen.
   */
  stopTripManually() {
    return this.stopRecording();
  }

  /**
   * Returns current or last trip data: track (array of { lat, lng, timestamp }), startTime, endTime.
   */
  getCurrentTripData() {
    return {
      track: [...this.track],
      startTime: this.tripStartTime,
      endTime: this.tripEndTime,
      state: this.state,
    };
  }

  onTripStart(callback) {
    if (typeof callback === 'function') this.onTripStartCallbacks.push(callback);
  }

  onTripEnd(callback) {
    if (typeof callback === 'function') this.onTripEndCallbacks.push(callback);
  }

  _emitTripStart() {
    this.state = STATE_TRIP_STARTED;
    this.tripStartTime = Date.now();
    this._emitStateChange();
    const data = this.getCurrentTripData();
    this.onTripStartCallbacks.forEach((cb) => cb(data));
  }

  _emitTripEnd() {
    this.state = STATE_TRIP_ENDED;
    this.tripEndTime = Date.now();
    this._emitStateChange();
    const data = this.getCurrentTripData();
    this.onTripEndCallbacks.forEach((cb) => cb(data));
  }

  /**
   * Starts recording: requests permissions, starts GPS (and optionally acc/gyro) and begins accumulating track.
   * Trip is considered "started" when sustained movement is detected; "ended" on prolonged stop or stopRecording().
   */
  async startRecording() {
    if (this.state !== STATE_IDLE && this.state !== STATE_TRIP_ENDED) return;
    const hasPermission = await SensorManager.requestPermissions();
    if (!hasPermission) throw new Error('Location permission denied');

    this.state = STATE_RECORDING;
    this.track = [];
    this.tripStartTime = null;
    this.tripEndTime = null;
    this._movementCount = 0;
    this._idleCount = 0;
    this._emitStateChange();

    const self = this;
    await SensorManager.startGPS((gpsData) => {
      const point = {
        lat: gpsData.latitude,
        lng: gpsData.longitude,
        timestamp: gpsData.timestamp || Date.now(),
      };
      self.track.push(point);
      const speed = gpsData.speed != null ? gpsData.speed : 0;
      if (speed >= SPEED_THRESHOLD) {
        self._idleCount = 0;
        self._movementCount++;
        if (self.state === STATE_RECORDING && self._movementCount >= MOVEMENT_SECONDS_TO_START) {
          self._emitTripStart();
        }
      } else {
        self._movementCount = 0;
        if (self.state === STATE_TRIP_STARTED) {
          self._idleCount++;
          if (self._idleCount >= IDLE_SECONDS_TO_END) {
            self._emitTripEnd();
          }
        }
      }
    });
    // Optional: accelerometer/gyroscope to improve detection (Agent 3 can extend)
    SensorManager.startAccelerometer(() => {});
    SensorManager.startGyroscope(() => {});
  }

  /**
   * Stops recording, emits trip end if started, and returns trip data.
   */
  stopRecording() {
    if (this.state === STATE_IDLE) return this.getCurrentTripData();
    if (this.state === STATE_TRIP_STARTED && !this.tripEndTime) this._emitTripEnd();
    SensorManager.stopAll();
    this.state = STATE_IDLE;
    this._emitStateChange();
    return this.getCurrentTripData();
  }
}

/**
 * Detects a trip automatically based on sensor data.
 * @param {Object} sensorData - Current sensor readings (e.g., accelerometer, GPS).
 * @param {Object} options - Configuration and callbacks.
 * @param {Function} options.onTripDetected - Callback when a trip start is detected.
 * @param {Object} options.storage - Abstract storage interface.
 */
export const detectTripAutomatically = (sensorData, { onTripDetected, storage }) => {
  const MOVEMENT_THRESHOLD = 5.0; // Acceleration threshold (m/s^2)
  const SPEED_THRESHOLD = 2.0;   // Speed threshold (m/s)

  const isMoving = sensorData.acceleration > MOVEMENT_THRESHOLD || sensorData.speed > SPEED_THRESHOLD;

  if (isMoving) {
    console.log('Trip start detected automatically.');

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
  recordEvent(_eventType, _data) {
    throw new Error('recordEvent must be implemented');
  }

  saveData(_data) {
    throw new Error('saveData must be implemented');
  }
}

const engine = new TripDetectionEngine();
export default engine;
export { STATE_IDLE, STATE_RECORDING, STATE_TRIP_STARTED, STATE_TRIP_ENDED };