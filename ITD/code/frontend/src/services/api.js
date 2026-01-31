import axios from 'axios';
import { getToken, clearSession } from '../storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Callbacks for UI integration (offline, errors). NetworkStatusProvider registers them.
let networkStatusCallbacks = null;

/**
 * Registers callbacks to notify network/error state to the UI.
 * @param {{ setOffline?: () => void, setOnline?: () => void, setError?: (msg: string) => void }} cbs
 */
export function setNetworkStatusCallbacks(cbs) {
  networkStatusCallbacks = cbs;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token from storage service
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally; 401 clears session via storage
apiClient.interceptors.response.use(
  (response) => {
    if (networkStatusCallbacks?.setOnline) {
      networkStatusCallbacks.setOnline();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired: clear session via storage service
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await clearSession();
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }

    // Network error: notify UI (offline)
    if (!error.response) {
      console.error('Network error:', error.message);
      if (networkStatusCallbacks?.setOffline) {
        networkStatusCallbacks.setOffline();
      }
      if (networkStatusCallbacks?.setError) {
        networkStatusCallbacks.setError(
          'No connection. Check your network and try again.'
        );
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
