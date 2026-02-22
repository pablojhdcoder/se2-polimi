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

function mapRowToEnriched(row) {
  if (!row) return null;
  return {
    id: row.id,
    pathId: row.path_id,
    pathName: row.path_name,
    userId: row.user_id,
    userName: row.username || row.full_name,
    rating: row.points,
    comment: row.opinion,
    text: row.opinion,
    reportedStatus: row.reported_status
  };
}

const getRatingsEnriched = async (limit = 100) => {
  const sql = `
    SELECT r.id, r.user_id, r.path_id, r.points, r.opinion, r.reported_status,
           p.path_name, u.username, u.full_name
    FROM ratings r
    JOIN paths p ON p.id = r.path_id
    JOIN users u ON u.id = r.user_id
    ORDER BY r.id
    LIMIT $1
  `;
  const res = await query(sql, [limit]);
  return res.rows.map(mapRowToEnriched);
};

const getRatingByIdEnriched = async (id) => {
  const sql = `
    SELECT r.id, r.user_id, r.path_id, r.points, r.opinion, r.reported_status,
           p.path_name, u.username, u.full_name
    FROM ratings r
    JOIN paths p ON p.id = r.path_id
    JOIN users u ON u.id = r.user_id
    WHERE r.id = $1
  `;
  const res = await query(sql, [id]);
  return mapRowToEnriched(res.rows[0]);
};

const getRatingsByPathIdEnriched = async (pathId) => {
  const sql = `
    SELECT r.id, r.user_id, r.path_id, r.points, r.opinion, r.reported_status,
           p.path_name, u.username, u.full_name
    FROM ratings r
    JOIN paths p ON p.id = r.path_id
    JOIN users u ON u.id = r.user_id
    WHERE r.path_id = $1
    ORDER BY r.id
  `;
  const res = await query(sql, [pathId]);
  return res.rows.map(mapRowToEnriched);
};

module.exports = {
  createRating,
  getRatingsByPathId,
  getRatingByUserAndPath,
  getRatingById,
  getAllRatings,
  deleteRating,
  getAverageRatingForPath,
  getRatingsEnriched,
  getRatingByIdEnriched,
  getRatingsByPathIdEnriched
};
