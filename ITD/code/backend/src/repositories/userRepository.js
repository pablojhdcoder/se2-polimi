const { query } = require('../pool');

const createUser = async (user) => {
    const sql = `
    INSERT INTO users (id, username, password_hash, full_name, phone_number, email, profile_picture)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
    return query(sql, [
        user.id,
        user.username,
        user.passwordHash,
        user.fullName,
        user.phoneNumber,
        user.email,
        user.profilePicture
    ]);
};

const getUserByUsername = async (username) => {
    const sql = `
    SELECT *
    FROM users
    WHERE username = $1
  `;
    const res = await query(sql, [username]);
    return res.rows[0];
};

const getUserById = async (id) => {
    const sql = `
    SELECT *
    FROM users
    WHERE id = $1
  `;
    const res = await query(sql, [id]);
    return res.rows[0];
};

const getAllUsers = async () => {
    const sql = `SELECT * FROM users`;
    const res = await query(sql);
    return res.rows;
};

module.exports = {
    createUser,
    getUserByUsername,
    getUserById,
    getAllUsers
};