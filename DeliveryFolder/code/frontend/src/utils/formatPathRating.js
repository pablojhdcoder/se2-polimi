/**
 * Formats path rating for display: integer when whole (e.g. 4), one decimal when not (e.g. 4.3).
 * @param {number|string|null|undefined} rating - Path user_rating
 * @returns {string} Formatted rating or '—' when null/undefined
 */
export function formatPathRating(rating) {
  if (rating == null || rating === '') return '—';
  const n = Number(rating);
  if (Number.isNaN(n)) return '—';
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
