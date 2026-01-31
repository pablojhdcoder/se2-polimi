/**
 * Trips API contract - UC4 automatic insertion.
 * Expected endpoints: POST /trips, GET /trips, GET /trips/:id
 * When backend is unavailable, can enqueue in sync and save offline.
 */

import apiClient from './api';
import { requestWithRetry } from './requestWithRetry';

const TRIPS_BASE = '/trips';

/**
 * Creates a trip (UC4 - automatic insertion from recording).
 * @param {Object} body - { track: [{ lat, lng, timestamp }], startTime, endTime, pathId? }
 * @returns {Promise<Object>}
 */
export async function createTrip(body) {
  const response = await requestWithRetry(() =>
    apiClient.post(TRIPS_BASE, body)
  );
  return response.data;
}

/**
 * Lists user trips (optional filters).
 * @param {Object} params - { limit?, offset?, pathId? }
 * @returns {Promise<{ data: Array }>}
 */
export async function getTrips(params = {}) {
  const response = await requestWithRetry(() =>
    apiClient.get(TRIPS_BASE, { params })
  );
  return response.data;
}

/**
 * Gets a trip by id.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getTripById(id) {
  const response = await requestWithRetry(() =>
    apiClient.get(`${TRIPS_BASE}/${id}`)
  );
  return response.data;
}
