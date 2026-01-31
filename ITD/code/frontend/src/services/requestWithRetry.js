/**
 * Runs a request with retries on network error or 5xx.
 * Does not modify backend; client-side logic only.
 *
 * @param {Function} requestFn - Function that returns a promise (e.g. () => api.get('/paths'))
 * @param {Object} options - { maxRetries?: number, baseDelayMs?: number }
 * @returns {Promise} Request result
 */
export async function requestWithRetry(requestFn, options = {}) {
  const { maxRetries = 2, baseDelayMs = 1000 } = options;
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      lastError = err;
      const isNetworkError = !err.response;
      const isServerError = err.response?.status >= 500;
      const shouldRetry =
        attempt < maxRetries && (isNetworkError || isServerError);
      if (!shouldRetry) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}
