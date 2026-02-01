const { query } = require('../pool');

const createPath = async (path) => {
  console.log('[PathRepository] Creating path with data:', JSON.stringify(path, null, 2));
  const isPublished = path.isPublished !== false;
  const sql = `
    INSERT INTO paths (id, path_name, start_x, start_y, end_x, end_y, length, user_rating, status, posted_by_user_id, route_data, is_published,
      temperature, wind_speed, wind_degree, wind_gust, visibility, rain, clouds, duration_minutes, origin_place, destination_place, description, difficulty)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
    RETURNING *
  `;
  const res = await query(sql, [
    path.id,
    path.pathName || path.name,
    path.startX,
    path.startY,
    path.endX,
    path.endY,
    path.length,
    path.userRating || 0,
    path.status || 'optimal',
    path.postedByUserId,
    path.routeData,
    isPublished,
    path.temperature ?? null,
    path.windSpeed ?? null,
    path.windDegree ?? null,
    path.windGust ?? null,
    path.visibility ?? null,
    path.rain ?? null,
    path.clouds ?? null,
    path.durationMinutes ?? null,
    path.originPlace ?? null,
    path.destinationPlace ?? null,
    path.description ?? null,
    path.difficulty ?? null,
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
  const { search, searchByPlace, limit = 100, offset = 0 } = options;
  let sql = 'SELECT * FROM paths WHERE is_published = true';
  const params = [];

  if (search && typeof search === 'string' && search.trim()) {
    const term = `%${search.trim()}%`;
    if (searchByPlace) {
      sql += ' AND (origin_place ILIKE $1 OR destination_place ILIKE $1)';
      params.push(term);
    } else {
      sql += ' AND path_name ILIKE $1';
      params.push(term);
    }
  }
  sql += ' ORDER BY path_name LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const res = await query(sql, params);
  return res.rows;
};

/**
 * Get all paths created by the given user ID (posted_by_user_id).
 * @param {string} userId - UUID of the user
 */
const getPathsByUserId = async (userId) => {
  const sql = `
    SELECT * FROM paths
    WHERE posted_by_user_id = $1
    ORDER BY path_name
  `;
  const res = await query(sql, [userId]);
  return res.rows;
};

/**
 * Get published paths filtered by origin and/or destination place names.
 * @param {Object} options - { origin?, destination?, limit?, offset? }
 */
const getPathsByOriginDestination = async (options = {}) => {
  const { origin, destination, limit = 20, offset = 0 } = options;
  let sql = 'SELECT * FROM paths WHERE is_published = true';
  const params = [];
  let paramIndex = 1;

  const originTerm = origin && typeof origin === 'string' && origin.trim() ? `%${origin.trim()}%` : null;
  const destTerm = destination && typeof destination === 'string' && destination.trim() ? `%${destination.trim()}%` : null;

  if (originTerm && destTerm) {
    sql += ` AND ((origin_place ILIKE $${paramIndex} AND destination_place ILIKE $${paramIndex + 1}) OR (origin_place ILIKE $${paramIndex + 1} AND destination_place ILIKE $${paramIndex}))`;
    params.push(originTerm, destTerm);
    paramIndex += 2;
  } else if (originTerm) {
    sql += ` AND (origin_place ILIKE $${paramIndex} OR destination_place ILIKE $${paramIndex})`;
    params.push(originTerm);
    paramIndex += 1;
  } else if (destTerm) {
    sql += ` AND (origin_place ILIKE $${paramIndex} OR destination_place ILIKE $${paramIndex})`;
    params.push(destTerm);
    paramIndex += 1;
  }

  sql += ` ORDER BY path_name LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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

const updatePathPublished = async (id, isPublished) => {
  const sql = `
    UPDATE paths
    SET is_published = $1
    WHERE id = $2
    RETURNING *
  `;
  const res = await query(sql, [isPublished, id]);
  return res.rows[0];
};

module.exports = {
  createPath,
  getPathById,
  getPathByName,
  getAllPaths,
  getPathsByUserId,
  getPathsByOriginDestination,
  updatePathStatus,
  updatePathRating,
  updatePathPublished
};
