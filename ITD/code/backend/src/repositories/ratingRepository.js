const { query } = require('../pool');

const createRating = async (rating) => {
  const sql = `
    INSERT INTO ratings (id, user_id, path_id, points, opinion, reported_status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const res = await query(sql, [
    rating.id,
    rating.userId,
    rating.pathId,
    rating.points,
    rating.opinion,
    rating.reportedStatus
  ]);
  return res.rows[0];
};

const getRatingsByPathId = async (pathId) => {
  const sql = `
    SELECT *
    FROM ratings
    WHERE path_id = $1
  `;
  const res = await query(sql, [pathId]);
  return res.rows;
};

const getRatingByUserAndPath = async (userId, pathId) => {
  const sql = `
    SELECT *
    FROM ratings
    WHERE user_id = $1 AND path_id = $2
  `;
  const res = await query(sql, [userId, pathId]);
  return res.rows[0];
};

const getRatingById = async (id) => {
  const sql = `
    SELECT *
    FROM ratings
    WHERE id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0];
};

const getAllRatings = async (limit = 100) => {
  const sql = `
    SELECT *
    FROM ratings
    ORDER BY id
    LIMIT $1
  `;
  const res = await query(sql, [limit]);
  return res.rows;
};

const deleteRating = async (id) => {
  const sql = `
    DELETE FROM ratings
    WHERE id = $1
    RETURNING *
  `;
  const res = await query(sql, [id]);
  return res.rows[0];
};

const getAverageRatingForPath = async (pathId) => {
  const sql = `
    SELECT AVG(points) as average_rating
    FROM ratings
    WHERE path_id = $1
  `;
  const res = await query(sql, [pathId]);
  return res.rows[0].average_rating;
};

module.exports = {
  createRating,
  getRatingsByPathId,
  getRatingByUserAndPath,
  getRatingById,
  getAllRatings,
  deleteRating,
  getAverageRatingForPath
};
