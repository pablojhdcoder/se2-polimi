const { query } = require('../pool');

const createPothole = async (pothole) => {
    const sql = `
    INSERT INTO potholes (id, path_id, location_x, location_y, detected_date, size)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
    const res = await query(sql, [
        pothole.id,
        pothole.pathId,
        pothole.locationX,
        pothole.locationY,
        pothole.detectedDate,
        pothole.size
    ]);
    return res.rows[0];
};

const getPotholesByPathId = async (pathId) => {
    const sql = `
    SELECT *
    FROM potholes
    WHERE path_id = $1
    ORDER BY detected_date DESC
  `;
    const res = await query(sql, [pathId]);
    return res.rows;
};

module.exports = {
    createPothole,
    getPotholesByPathId
};
