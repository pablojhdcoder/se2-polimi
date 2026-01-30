const { query } = require('../pool');

const savePath = async (username, pathName) => {
    const sql = `
    INSERT INTO saved_paths (username, path_name)
    VALUES ($1, $2)
    RETURNING *
  `;
    const res = await query(sql, [username, pathName]);
    return res.rows[0];
};

const getSavedPathsByUsername = async (username) => {
    const sql = `
    SELECT *
    FROM saved_paths
    WHERE username = $1
  `;
    const res = await query(sql, [username]);
    return res.rows;
};

const deleteSavedPath = async (username, pathName) => {
    const sql = `
    DELETE FROM saved_paths
    WHERE username = $1 AND path_name = $2
    RETURNING *
  `;
    const res = await query(sql, [username, pathName]);
    return res.rows[0];
};

module.exports = {
    savePath,
    getSavedPathsByUsername,
    deleteSavedPath
};
