import apiClient from './api';
import { requestWithRetry } from './requestWithRetry';
import { setOfflineDataKey, getOfflineData } from '../storage';
import { OFFLINE_DATA_KEYS } from '../storage/constants';

/**
 * Paths API contract.
 * Expected endpoints: GET /paths, GET /paths/:id, POST /paths, GET /paths?search=...
 * When backend is unavailable, calls will fail; UI can show empty list or read from OFFLINE_DATA.
 */

const PATHS_BASE = '/paths';

/**
 * Normalizes a raw path from the backend to the format expected by PathCard.
 * Backend may send path_name, start_x, start_y, end_x, end_y, length; PathCard expects name, startPoint, endPoint, distance, description, difficulty.
 * @param {Object} raw - Raw path from API (path_name, start_x, start_y, end_x, end_y, length, etc.)
 * @returns {Object} - { id, name, description, startPoint, endPoint, distance, difficulty, ...rest }
 */
export function normalizePathForDisplay(raw) {
  if (raw == null) return null;
  const startPoint =
    raw.startPoint ??
    (raw.start_x != null && raw.start_y != null ? `${raw.start_x}, ${raw.start_y}` : null);
  const endPoint =
    raw.endPoint ?? (raw.end_x != null && raw.end_y != null ? `${raw.end_x}, ${raw.end_y}` : null);
  return {
    ...raw,
    id: raw.id,
    name: raw.path_name ?? raw.name,
    description: raw.description ?? '',
    startPoint: startPoint ?? null,
    endPoint: endPoint ?? null,
    distance: raw.length ?? raw.distance,
    difficulty: raw.difficulty ?? null,
  };
}

/**
 * Lists all paths (optional query for search).
 * On success writes to OFFLINE_DATA for offline use.
 * @param {Object} params - { search?, difficulty?, limit?, offset? }
 * @returns {Promise<{ data: Array }>}
 */
export async function getPaths(params = {}) {
  const response = await requestWithRetry(() =>
    apiClient.get(PATHS_BASE, { params })
  );
  const data = response.data;
  try {
    await setOfflineDataKey(OFFLINE_DATA_KEYS.PATHS_CACHE, data);
  } catch (e) {
    console.warn('pathsApi.getPaths: failed to write cache', e);
  }
  return data;
}

/**
 * Gets a path by id.
 * On success writes to OFFLINE_DATA for offline use.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getPathById(id) {
  const response = await requestWithRetry(() =>
    apiClient.get(`${PATHS_BASE}/${id}`)
  );
  const data = response.data;
  try {
    await setOfflineDataKey(
      `${OFFLINE_DATA_KEYS.PATH_BY_ID_PREFIX}${id}`,
      data
    );
  } catch (e) {
    console.warn('pathsApi.getPathById: failed to write cache', e);
  }
  return data;
}

/**
 * Creates a path (manual insertion).
 * @param {Object} body - { name, description?, startPoint?, endPoint?, distance?, difficulty?, waypoints? }
 * @returns {Promise<Object>}
 */
export async function createPath(body) {
  const response = await requestWithRetry(() =>
    apiClient.post(PATHS_BASE, body)
  );
  return response.data;
}

/**
 * Updates a path (F3.2, post_path_update).
 * @param {string|number} id - Path id
 * @param {Object} body - Partial path fields to update (name, description?, waypoints?, etc.)
 * @returns {Promise<Object>}
 */
export async function updatePath(id, body) {
  const response = await apiClient.patch(`${PATHS_BASE}/${id}`, body);
  return response.data;
}

/**
 * Search paths by text and filters.
 * On success writes to OFFLINE_DATA for offline use.
 * @param {Object} params - { search?, difficulty?, minDistance?, maxDistance?, limit? }
 * @returns {Promise<{ data: Array }>}
 */
export async function searchPaths(params = {}) {
  const response = await requestWithRetry(() =>
    apiClient.get(PATHS_BASE, { params })
  );
  const data = response.data;
  try {
    await setOfflineDataKey(OFFLINE_DATA_KEYS.PATHS_CACHE, data);
  } catch (e) {
    console.warn('pathsApi.searchPaths: failed to write cache', e);
  }
  return data;
}

/**
 * Gets paths near a location ("nearby"). Backend stub returns [] until geo search is implemented.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} params - Optional { radius?, limit? }
 * @returns {Promise<{ data: Array }>}
 */
export async function getNearbyPaths(lat, lng, params = {}) {
  const response = await apiClient.get(`${PATHS_BASE}/nearby`, {
    params: { lat, lng, ...params },
  });
  return response.data;
}

/**
 * Requests paths between two points. Backend stub returns [] until route search is implemented.
 * @param {{ lat: number, lng: number }|string} origin - Origin point or address
 * @param {{ lat: number, lng: number }|string} destination - Destination point or address
 * @param {Object} params - Optional extra params
 * @returns {Promise<{ data: Array }>}
 */
export async function requestRelatedPaths(origin, destination, params = {}) {
  const response = await apiClient.get(`${PATHS_BASE}/related`, {
    params: { origin: JSON.stringify(origin), destination: JSON.stringify(destination), ...params },
  });
  return response.data;
}

/**
 * Gets the authenticated user's saved paths (favorites).
 * Backend: GET /paths/saved (authenticated).
 * @returns {Promise<Array>} Array of path objects
 */
export async function getSavedPaths() {
  const response = await apiClient.get(`${PATHS_BASE}/saved`);
  return Array.isArray(response.data) ? response.data : response.data?.paths ?? [];
}

/**
 * Save a path to user's favorites (requires backend POST /paths/:id/save).
 * @param {string|number} pathId
 * @returns {Promise<Object>}
 */
export async function savePath(pathId) {
  const response = await apiClient.post(`${PATHS_BASE}/${pathId}/save`);
  return response.data;
}

/**
 * Remove a path from user's favorites (requires backend DELETE /paths/:id/save).
 * @param {string|number} pathId
 * @returns {Promise<Object>}
 */
export async function unsavePath(pathId) {
  const response = await apiClient.delete(`${PATHS_BASE}/${pathId}/save`);
  return response.data;
}

/**
 * Reads cached paths list from OFFLINE_DATA (for use when offline).
 * @returns {Promise<Array>} Array of path objects, or [] if none cached
 */
export async function getCachedPaths() {
  const data = await getOfflineData();
  const raw = data[OFFLINE_DATA_KEYS.PATHS_CACHE];
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? raw?.paths ?? [];
}

/**
 * Reads a single path by id from OFFLINE_DATA (for use when offline).
 * @param {string|number} id
 * @returns {Promise<Object|null>} Path object or null if not cached
 */
export async function getCachedPathById(id) {
  const data = await getOfflineData();
  const raw = data[`${OFFLINE_DATA_KEYS.PATH_BY_ID_PREFIX}${id}`];
  if (raw == null) return null;
  return typeof raw === 'object' && raw !== null ? raw : null;
}
