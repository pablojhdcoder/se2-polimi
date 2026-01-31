/**
 * User / profile API (F1.3 - get_user_data).
 * Uses GET /auth/me (backend returns user without password).
 */

import apiClient from './api';

const USER_ENDPOINT = '/auth/me';

/**
 * Fetches current user data (profile refresh).
 * @returns {Promise<Object>} User object
 */
export async function getMe() {
  const response = await apiClient.get(USER_ENDPOINT);
  return response.data;
}

/**
 * Get current user profile (alias for getMe).
 * @returns {Promise<Object>}
 */
export async function getCurrentUser() {
  try {
    return await getMe();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Update user profile. Not supported by backend yet.
 * @param {Object} userData
 * @throws {Error} Always throws "Profile update is not supported."
 */
export function updateProfile(userData) {
  console.warn('Profile update is not supported.', userData);
  throw new Error('Profile update is not supported.');
}

/**
 * Delete user account. Not supported by backend yet.
 * @throws {Error} Always throws "Account deletion is not supported."
 */
export function deleteAccount() {
  console.warn('Account deletion is not supported.');
  throw new Error('Account deletion is not supported.');
}

/**
 * Search for users. Not supported by backend yet.
 * @param {string} query
 * @throws {Error} Always throws "User search is not supported."
 */
export function searchUsers(query) {
  console.warn('User search is not supported.', query);
  throw new Error('User search is not supported.');
}
