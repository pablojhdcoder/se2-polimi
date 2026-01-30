const { query } = require('../pool');

const createPath = async (path) => {
  const sql = `
    INSERT INTO paths (id, path_name, start_x, start_y, end_x, end_y, length, user_rating, status, posted_by_username)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const res = await query(sql, [
    path.id,
    path.pathName,
    path.startX,
    path.startY,
    path.endX,
    path.endY,
    path.length,
    path.userRating,
    path.status,
    path.postedByUsername
  ]);
  return res.rows[0];
};

const getPathById = async (id) => {
  const sql = `
    SELECT *
    FROM paths
    WHERE id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0];
};

const getAllPaths = async () => {
  const sql = `SELECT * FROM paths`;
  const res = await query(sql);
  return res.rows;
};

const updatePathStatus = async (id, status) => {
  const sql = `
    UPDATE paths
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;
  const res = await query(sql, [status, id]);
  return res.rows[0];
};

const updatePathRating = async (id, rating) => {
  const sql = `
    UPDATE paths
    SET user_rating = $1
    WHERE id = $2
    RETURNING *
  `;
  const res = await query(sql, [rating, id]);
  return res.rows[0];
};

module.exports = {
  createPath,
  getPathById,
  getAllPaths,
  updatePathStatus,
  updatePathRating
};
