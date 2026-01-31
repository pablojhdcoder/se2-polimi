/**
 * Reviews API contract - UC7, UC11.
 * Expected endpoints: GET /reviews, GET /reviews/:id, POST /reviews
 */

import apiClient from './api';
import { requestWithRetry } from './requestWithRetry';

const REVIEWS_BASE = '/reviews';

export async function getReviews(params = {}) {
  const response = await requestWithRetry(() =>
    apiClient.get(REVIEWS_BASE, { params })
  );
  return response.data;
}

export async function getReviewById(id) {
  const response = await requestWithRetry(() =>
    apiClient.get(`${REVIEWS_BASE}/${id}`)
  );
  return response.data;
}

export async function createReview(body) {
  const response = await requestWithRetry(() =>
    apiClient.post(REVIEWS_BASE, body)
  );
  return response.data;
}

export async function getReviewsByPathId(pathId) {
  const response = await requestWithRetry(() =>
    apiClient.get(REVIEWS_BASE, { params: { pathId } })
  );
  return response.data;
}
