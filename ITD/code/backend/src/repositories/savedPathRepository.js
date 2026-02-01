const { query } = require('../pool');

const savePath = async (userId, pathId) => {
    const sql = `
    INSERT INTO saved_paths (user_id, path_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, path_id) DO NOTHING
    RETURNING *
  `;
    const res = await query(sql, [userId, pathId]);
    return res.rows[0];
};

const getSavedPathsByUserId = async (userId) => {
    const sql = `
    SELECT sp.*, p.*
    FROM saved_paths sp
    JOIN paths p ON sp.path_id = p.id
    WHERE sp.user_id = $1
    ORDER BY sp.saved_at DESC
  `;
    const res = await query(sql, [userId]);
    return res.rows;
};

const deleteSavedPath = async (userId, pathId) => {
    const sql = `
    DELETE FROM saved_paths
    WHERE user_id = $1 AND path_id = $2
    RETURNING *
  `;
    const res = await query(sql, [userId, pathId]);
    return res.rows[0];
};

module.exports = {
    savePath,
    getSavedPathsByUserId,
    deleteSavedPath
};
