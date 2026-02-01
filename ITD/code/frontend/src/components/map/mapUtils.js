/**
 * Pure map helpers: zoom level to region delta for react-native-maps.
 */

const ZOOM_MIN = 0;
const ZOOM_MAX = 20;

/**
 * Convert zoom level (0–20) to latitudeDelta/longitudeDelta for MapView region.
 * @param {number} zoom - Zoom level
 * @returns {{ latitudeDelta: number, longitudeDelta: number }}
 */
export function zoomToDelta(zoom) {
  const span = 360 / Math.pow(2, zoom);
  return { latitudeDelta: span, longitudeDelta: span };
}

/**
 * Convert latitudeDelta (from MapView region) to zoom level (0–20).
 * Used to read current zoom from onRegionChangeComplete for +/- controls.
 * @param {number} latitudeDelta - Region latitudeDelta
 * @returns {number} Zoom level clamped to [0, 20]
 */
export function deltaToZoom(latitudeDelta) {
  const zoom = Math.log2(360 / latitudeDelta);
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(zoom)));
}
