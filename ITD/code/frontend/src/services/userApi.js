/**
 * User / profile API (F1.3 - get_user_data).
 * Expected endpoint: GET /me (or GET /user; adjust path if backend differs).
 */

import apiClient from './api';

const USER_ENDPOINT = '/me';

/**
 * Fetches current user data (profile refresh).
 * @returns {Promise<Object>} User object
 */
export async function getMe() {
  const response = await apiClient.get(USER_ENDPOINT);
  return response.data;
}
