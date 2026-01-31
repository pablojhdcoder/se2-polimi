import * as Location from 'expo-location';

// Lazy load react-native-sensors (not available in Expo Go; only in development builds)
let _sensorsModule = undefined;
function getSensorsModule() {
  if (_sensorsModule === undefined) {
    try {
      _sensorsModule = require('react-native-sensors');
    } catch (e) {
      console.warn('Sensors not available (e.g. Expo Go). Accelerometer/gyroscope disabled.', e?.message);
      _sensorsModule = null;
    }
  }
  return _sensorsModule;
}

function _isSensorsAvailable() {
  return getSensorsModule() !== null;
}

class SensorManager {
  constructor() {
    this.accelerometerSubscription = null;
    this.gyroscopeSubscription = null;
    this.gpsSubscription = null;
    this.isMonitoring = false;

    this.accelerometerData = null;
    this.gyroscopeData = null;
    this.gpsData = null;

    this.callbacks = {
      accelerometer: [],
      gyroscope: [],
      gps: [],
    };
  }

  // Request permissions
  async requestPermissions() {
    try {
      // Request location permission
      const locationPermission = await this.requestLocationPermission();
      
      if (!locationPermission) {
        throw new Error('Location permission denied');
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  // Start monitoring accelerometer (no-op if native sensors not available, e.g. Expo Go)
  startAccelerometer(callback) {
    const sensors = getSensorsModule();
    if (!sensors) return;

    if (this.accelerometerSubscription) {
      this.stopAccelerometer();
    }

    if (callback) {
      this.callbacks.accelerometer.push(callback);
    }

    try {
      const { accelerometer, setUpdateIntervalForType, SensorTypes } = sensors;
      setUpdateIntervalForType(SensorTypes.accelerometer, 100);
      this.accelerometerSubscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
        this.accelerometerData = { x, y, z, timestamp };
        this.callbacks.accelerometer.forEach(cb => cb({ x, y, z, timestamp }));
      });
    } catch (e) {
      console.warn('Accelerometer not available:', e?.message);
    }
  }

  // Start monitoring gyroscope (no-op if native sensors not available)
  startGyroscope(callback) {
    const sensors = getSensorsModule();
    if (!sensors) return;

    if (this.gyroscopeSubscription) {
      this.stopGyroscope();
    }

    if (callback) {
      this.callbacks.gyroscope.push(callback);
    }

    try {
      const { gyroscope, setUpdateIntervalForType, SensorTypes } = sensors;
      setUpdateIntervalForType(SensorTypes.gyroscope, 100);
      this.gyroscopeSubscription = gyroscope.subscribe(({ x, y, z, timestamp }) => {
        this.gyroscopeData = { x, y, z, timestamp };
        this.callbacks.gyroscope.forEach(cb => cb({ x, y, z, timestamp }));
      });
    } catch (e) {
      console.warn('Gyroscope not available:', e?.message);
    }
  }

  // Start monitoring GPS
  async startGPS(callback, options = {}) {
    if (this.gpsSubscription) {
      this.stopGPS();
    }

    if (callback) {
      this.callbacks.gps.push(callback);
    }

    const defaultOptions = {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 1,
      ...options,
    };

    try {
      this.gpsSubscription = await Location.watchPositionAsync(
        defaultOptions,
        (location) => {
          const gpsData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude || null,
            accuracy: location.coords.accuracy || null,
            heading: location.coords.heading || null,
            speed: location.coords.speed || null,
            timestamp: location.timestamp,
          };
          
          this.gpsData = gpsData;
          this.callbacks.gps.forEach(cb => cb(gpsData));
        }
      );
    } catch (error) {
      console.error('GPS error:', error);
      this.callbacks.gps.forEach(cb => {
        if (cb.onError) cb.onError(error);
      });
    }
  }

  // Stop monitoring accelerometer
  stopAccelerometer() {
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.unsubscribe();
      this.accelerometerSubscription = null;
    }
    this.callbacks.accelerometer = [];
  }

  // Stop monitoring gyroscope
  stopGyroscope() {
    if (this.gyroscopeSubscription) {
      this.gyroscopeSubscription.unsubscribe();
      this.gyroscopeSubscription = null;
    }
    this.callbacks.gyroscope = [];
  }

  // Stop monitoring GPS
  stopGPS() {
    if (this.gpsSubscription) {
      this.gpsSubscription.remove();
      this.gpsSubscription = null;
    }
    this.callbacks.gps = [];
  }

  // Start all sensors
  async startAll(callbacks = {}) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Permissions not granted');
    }

    if (callbacks.accelerometer) {
      this.startAccelerometer(callbacks.accelerometer);
    }
    if (callbacks.gyroscope) {
      this.startGyroscope(callbacks.gyroscope);
    }
    if (callbacks.gps) {
      this.startGPS(callbacks.gps);
    }

    this.isMonitoring = true;
  }

  // Stop all sensors
  stopAll() {
    this.stopAccelerometer();
    this.stopGyroscope();
    this.stopGPS();
    this.isMonitoring = false;
  }

  // Get current sensor data
  getCurrentData() {
    return {
      accelerometer: this.accelerometerData,
      gyroscope: this.gyroscopeData,
      gps: this.gpsData,
    };
  }

  // Check if monitoring
  isMonitoringActive() {
    return this.isMonitoring;
  }
}

// Export singleton instance
export default new SensorManager();
