/**
 * Obstacle Detection – public exports
 *
 * ObstacleDetectionModule: uses SensorManager (accelerometer, gyroscope) to
 * detect obstacle-like events (bumps, sharp turns). UI can subscribe with
 * addObstacleListener() and react to events.
 *
 * Usage:
 *   import ObstacleDetectionModule from '@/sensors/obstacle-detection';
 *   ObstacleDetectionModule.addObstacleListener((event) => { ... });
 *   await ObstacleDetectionModule.start();
 *   ObstacleDetectionModule.stop();
 */

import ObstacleDetectionModule from './ObstacleDetectionModule';
export { ObstacleDetectionModule };
export default ObstacleDetectionModule;
