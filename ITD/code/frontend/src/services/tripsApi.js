/**
 * Trips API - aligned with backend: POST /trips/manual, POST /trips/automatic,
 * GET /trips/me, GET /trips/:id, PATCH /trips/:id/route.
 * When backend is unavailable, can enqueue in sync and save offline.
 */

import apiClient from './api';
import { requestWithRetry } from './requestWithRetry';

const TRIPS_BASE = '/trips';

/**
 * Normalizes a raw trip from the backend (snake_case) to the format used by the UI.
 * Backend: trip_date, trip_length, recorded_route (JSONB with coordinates), path_id.
 * UI expects: startTime, track (array for points count), pathId; duration from trip_length or endTime.
 * @param {Object} raw - Raw trip from API (id, trip_date, trip_length, recorded_route, path_id, ...)
 * @returns {Object} - { id, startTime, endTime, track, pathId, path, tripLength, ...rest }
 */
export function normalizeTrip(raw) {
  if (raw == null) return null;
  const coordinates = raw.recorded_route?.coordinates ?? raw.recordedRoute?.coordinates;
  const track = Array.isArray(coordinates) ? coordinates : [];
  const tripDate = raw.trip_date != null ? raw.trip_date : raw.startTime ?? raw.start_time;
  const ts = typeof tripDate === 'string' ? new Date(tripDate).getTime() : tripDate;
  return {
    ...raw,
    id: raw.id,
    startTime: ts ?? raw.startTime ?? raw.start_time,
    endTime: raw.endTime ?? raw.end_time ?? null,
    track,
    pathId: raw.path_id ?? raw.pathId,
    path: raw.path,
    tripLength: raw.trip_length ?? raw.tripLength,
  };
}

/**
 * Start a trip (manual or automatic).
 * @param {Object} tripData - { pathId: string, sensorData?: object } for automatic; { pathId: string } for manual
 * @returns {Promise<Object>} The created trip (response.data.trip)
 */
export async function startTrip(tripData) {
  try {
    const { pathId, sensorData } = tripData || {};
    const isAutomatic = sensorData != null && Object.keys(sensorData).length > 0;

    const url = isAutomatic ? `${TRIPS_BASE}/automatic` : `${TRIPS_BASE}/manual`;
    const body = isAutomatic ? { pathId, sensorData } : { pathId };
    const response = await requestWithRetry(() => apiClient.post(url, body));
    const trip = response.data?.trip;

    return trip;
  } catch (error) {
    console.error('Error starting trip:', error);
    throw error;
  }
}

/**
 * Creates a trip (automatic insertion from recording).
 * Backend: POST /trips/automatic with { pathId?, sensorData }.
 * Track is sent separately via updateTripRoute (PATCH /trips/:id/route).
 * @param {Object} body - { pathId?: string, sensorData?: object }
 * @returns {Promise<Object>} response.data.trip
 */
export async function createTrip(body) {
  const response = await requestWithRetry(() =>
    apiClient.post(`${TRIPS_BASE}/automatic`, {
      pathId: body.pathId || null,
      sensorData: body.sensorData || {}
    })
  );
  return response.data.trip;
}

/**
 * Lists trips for the authenticated user.
 * Backend: GET /trips/me returns { data: trips } with snake_case fields.
 * Returns { data: normalizedTrips } so UI gets startTime, track, pathId, tripLength, etc.
 * @returns {Promise<{ data: Array }>}
 */
export async function getTrips() {
  const response = await requestWithRetry(() =>
    apiClient.get(`${TRIPS_BASE}/me`)
  );
  const raw = response.data;
  const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.trips ?? [];
  const normalized = list.map(normalizeTrip).filter(Boolean);
  return { data: normalized };
}

/**
 * Gets a trip by id.
 * Backend: GET /trips/:id returns { data: trip }. Returns normalized trip for UI.
 * @param {string} id
 * @returns {Promise<Object>} { data: normalizedTrip }
 */
export async function getTripById(id) {
  const response = await requestWithRetry(() =>
    apiClient.get(`${TRIPS_BASE}/${id}`)
  );
  const raw = response.data?.data ?? response.data;
  return { data: normalizeTrip(raw) ?? raw };
}

/**
 * Converts frontend track [{ lat, lng, timestamp }] to backend routeData.coordinates.
 * Backend expects coordinates as array (e.g. [lng, lat] per point).
 * @param {Array<{ lat: number, lng: number, timestamp?: number }>} track
 * @returns {Array<[number, number]>}
 */
export function trackToCoordinates(track) {
  if (!Array.isArray(track) || track.length === 0) return [];
  return track.map((p) => [Number(p.lng), Number(p.lat)]);
}

/**
 * Updates trip route (track) on the backend.
 * Backend: PATCH /trips/:id/route with body { routeData: { coordinates, metadata?, potholes? } }.
 * @param {string} tripId
 * @param {Object} options - { track: Array, isFinal?: boolean, potholes?: Array }
 * @returns {Promise<Object>} response.data.trip
 */
export async function updateTripRoute(tripId, options = {}) {
  const { track = [], isFinal = false, potholes = [] } = options;
  const coordinates = trackToCoordinates(track);
  const routeData = {
    coordinates,
    metadata: { isFinal },
    ...(potholes.length > 0 && { potholes }),
  };
  const response = await requestWithRetry(() =>
    apiClient.patch(`${TRIPS_BASE}/${tripId}/route`, { routeData })
  );
  return response.data?.trip ?? response.data;
}

/**
 * Remove a trip (delete). Backend does not support deletion yet.
 * @param {string} tripId
 * @throws {Error} Always throws "Trip deletion is not supported."
 */
export function removeTrip(tripId) {
  console.warn('Trip deletion is not supported.', tripId);
  throw new Error('Trip deletion is not supported.');
}
