const { query } = require('../pool');

const createPath = async (path) => {
  console.log('[PathRepository] Creating path with data:', JSON.stringify(path, null, 2));
  const sql = `
    INSERT INTO paths (id, path_name, start_x, start_y, end_x, end_y, length, user_rating, status, posted_by_username, route_data)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  const res = await query(sql, [
    path.id,
    path.pathName || path.name, // Try both
    path.startX,
    path.startY,
    path.endX,
    path.endY,
    path.length,
    path.userRating || 0,
    path.status || 'optimal',
    path.postedByUsername,
    path.routeData
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

const getPathByName = async (pathName) => {
  const sql = `
    SELECT *
    FROM paths
    WHERE path_name = $1
  `;
  const res = await query(sql, [pathName]);
  return res.rows[0];
};

const getAllPaths = async (options = {}) => {
  const { search, limit = 100, offset = 0 } = options;
  let sql = 'SELECT * FROM paths';
  const params = [];

  if (search && typeof search === 'string' && search.trim()) {
    sql += ' WHERE path_name ILIKE $1';
    params.push(`%${search.trim()}%`);
  }
  sql += ' ORDER BY path_name LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const res = await query(sql, params);
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
  getPathByName,
  getAllPaths,
  updatePathStatus,
  updatePathRating
};
