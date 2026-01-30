const { query } = require('../pool');

const createTrip = async (trip) => {
    const sql = `
    INSERT INTO trips (
      id, user_id, path_id, trip_date, trip_length, personal_rating, 
      temperature, wind_speed, wind_degree, wind_gust, visibility, rain, clouds
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
        trip.clouds
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

module.exports = {
    createTrip,
    getTripsByUserId,
    getTripById
};
