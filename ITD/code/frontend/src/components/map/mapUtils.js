/**
 * Pure map helpers: zoom level to region delta for react-native-maps.
 */

/**
 * Convert zoom level (0–20) to latitudeDelta/longitudeDelta for MapView region.
 * @param {number} zoom - Zoom level
 * @returns {{ latitudeDelta: number, longitudeDelta: number }}
 */
export function zoomToDelta(zoom) {
  const span = 360 / Math.pow(2, zoom);
  return { latitudeDelta: span, longitudeDelta: span };
}
