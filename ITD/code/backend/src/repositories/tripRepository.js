const { query } = require('../pool');

const createTrip = async (trip) => {
  const sql = `
    INSERT INTO trips (
      id, user_id, path_id, trip_date, trip_length, personal_rating, 
      temperature, wind_speed, wind_degree, wind_gust, visibility, rain, clouds,
      recorded_route
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `;
  const res = await query(sql, [
    trip.id,
    trip.userId,
    trip.pathId,
    trip.tripDate,
    trip.tripLength,
    trip.personalRating,
    trip.temperature,
    trip.windSpeed,
    trip.windDegree,
    trip.windGust,
    trip.visibility,
    trip.rain,
    trip.clouds,
    trip.recordedRoute
  ]);
  return res.rows[0];
};

const getTripsByUserId = async (userId) => {
  const sql = `
    SELECT *
    FROM trips
    WHERE user_id = $1
    ORDER BY trip_date DESC
  `;
  const res = await query(sql, [userId]);
  return res.rows;
};

const getTripById = async (id) => {
  const sql = `
    SELECT *
    FROM trips
    WHERE id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0];
};

/**
 * Updates the recorded route and optionally trip_length when finalizing a trip.
 * @param {string} id - Trip ID
 * @param {Object} recordedRoute - JSONB route data (coordinates, metadata, etc.)
 * @param {Object} options - { tripLength?: number } duration/length in minutes to persist
 */
const updateTripRoute = async (id, recordedRoute, options = {}) => {
  const tripLength = options.tripLength != null ? Number(options.tripLength) : null;
  if (tripLength != null && !Number.isNaN(tripLength)) {
    const sql = `
      UPDATE trips
      SET recorded_route = $1, trip_length = $2
      WHERE id = $3
      RETURNING *
    `;
    const res = await query(sql, [recordedRoute, Math.round(tripLength), id]);
    return res.rows[0];
  }
  const sql = `
    UPDATE trips
    SET recorded_route = $1
    WHERE id = $2
    RETURNING *
  `;
  const res = await query(sql, [recordedRoute, id]);
  return res.rows[0];
};

module.exports = {
  createTrip,
  getTripsByUserId,
  getTripById,
  updateTripRoute
};
