/**
 * Map component (react-native-maps). Works in Expo Go.
 * Geocoding and directions use MapService (Mapbox APIs).
 *
 * API: center ([lng, lat] or { lng, lat }), zoom (0–20), routeGeoJSON (LineString
 * with coordinates [[lng, lat], ...]), markers ({ id, coords: [lng, lat], label? }),
 * showUserLocation, style.
 */
import React, { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  ROUTE_STROKE_COLOR,
  MARKER_A_COLOR,
  MARKER_B_COLOR,
  MARKER_DEFAULT_COLOR,
} from './constants';
import { zoomToDelta } from './mapUtils';

/**
 * Map component. Props:
 * @param {[number, number] | { lng: number, lat: number }} [center] - Map center [lng, lat] or { lng, lat }
 * @param {number} [zoom] - Zoom level (0–20)
 * @param {Object} [routeGeoJSON] - GeoJSON LineString { type: 'LineString', coordinates: [[lng, lat], ...] } (single route)
 * @param {Array<Object>} [routes] - Array of GeoJSON LineStrings for multiple polylines (overrides routeGeoJSON when non-empty)
 * @param {Array<{ id: string, coords: [number, number] | { lng, lat }, label?: string }>} [markers] - Markers (e.g. A/B)
 * @param {boolean} [showUserLocation] - Show user location and "my location" button
 * @param {Object} [style] - Container style
 */
export default function MapboxMap({
  center,
  zoom = DEFAULT_ZOOM,
  routeGeoJSON,
  routes = [],
  markers = [],
  showUserLocation = false,
  style,
}) {
  const mapRef = useRef(null);
  const isInitialMount = useRef(true);

  const centerCoord = useMemo(() => {
    if (!center) return DEFAULT_CENTER;
    if (Array.isArray(center)) return center;
    return [center.lng, center.lat];
  }, [center]);

  const region = useMemo(() => {
    const [lng, lat] = centerCoord;
    const delta = zoomToDelta(zoom);
    return {
      latitude: lat,
      longitude: lng,
      ...delta,
    };
  }, [centerCoord, zoom]);

  useEffect(() => {
    if (!mapRef.current || !region) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    mapRef.current.animateToRegion(region, 300);
  }, [region]);

  const routeCoords = useMemo(() => {
    if (!routeGeoJSON?.coordinates || routeGeoJSON.coordinates.length < 2) return null;
    return routeGeoJSON.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
  }, [routeGeoJSON]);

  const routesCoords = useMemo(() => {
    if (!Array.isArray(routes) || routes.length === 0) return [];
    return routes
      .filter((r) => r?.coordinates && r.coordinates.length >= 2)
      .map((r) => r.coordinates.map(([lng, lat]) => ({ latitude: lat, longitude: lng })));
  }, [routes]);

  const getMarkerColor = (label) => {
    if (label === 'A') return MARKER_A_COLOR;
    if (label === 'B') return MARKER_B_COLOR;
    return MARKER_DEFAULT_COLOR;
  };

  return (
    <MapView
      ref={mapRef}
      style={[styles.map, style]}
      initialRegion={region}
      showsUserLocation={showUserLocation}
      showsMyLocationButton={showUserLocation}
      showsCompass={false}
      mapType="standard"
    >
      {routesCoords.length > 0
        ? routesCoords.map((coords, i) => (
            <Polyline
              key={i}
              coordinates={coords}
              strokeColor={ROUTE_STROKE_COLOR}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          ))
        : routeCoords && (
            <Polyline
              coordinates={routeCoords}
              strokeColor={ROUTE_STROKE_COLOR}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          )}
      {/* pinColor applies on Android; iOS uses default pin */}
      {markers.map((m) => {
        const coord = Array.isArray(m.coords) ? m.coords : [m.coords.lng, m.coords.lat];
        const [lng, lat] = coord;
        return (
          <Marker
            key={m.id}
            coordinate={{ latitude: lat, longitude: lng }}
            title={m.label != null ? String(m.label) : m.id}
            pinColor={getMarkerColor(m.label)}
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    ...(Platform.OS === 'web' && { minHeight: 300 }),
  },
});
