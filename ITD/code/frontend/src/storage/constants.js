/**
 * AsyncStorage keys used by the storage service.
 * Centralized to avoid collisions and ease migrations.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@bbp/authToken',
  USER: '@bbp/user',
  OFFLINE_DATA: '@bbp/offlineData',
  SYNC_QUEUE: '@bbp/syncQueue',
};

/**
 * Keys used inside the OFFLINE_DATA object (path cache, etc.).
 */
export const OFFLINE_DATA_KEYS = {
  /** Cached list of paths (from getPaths / searchPaths). */
  PATHS_CACHE: 'paths',
  /** Prefix for individual path cache: path_<id> (from getPathById). */
  PATH_BY_ID_PREFIX: 'path_',
};
