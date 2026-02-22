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

const getUserByEmail = async (email) => {
    const sql = `
    SELECT *
    FROM users
    WHERE email = $1
  `;
    const res = await query(sql, [email]);
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

/**
 * Update user profile fields. Only updates columns present in fields.
 * @param {string} userId
 * @param {Object} fields - Allowed: full_name, email, phone_number, profile_picture
 */
const updateUser = async (userId, fields) => {
    const allowed = ['full_name', 'email', 'phone_number', 'profile_picture'];
    const setClauses = [];
    const values = [];
    let paramIndex = 1;
    for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
            setClauses.push(`${key} = $${paramIndex}`);
            values.push(fields[key] === '' ? null : fields[key]);
            paramIndex += 1;
        }
    }
    if (setClauses.length === 0) {
        const user = await getUserById(userId);
        return user;
    }
    setClauses.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);
    const sql = `
        UPDATE users
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
    `;
    const res = await query(sql, values);
    return res.rows[0] || null;
};

module.exports = {
    createUser,
    getUserByUsername,
    getUserByEmail,
    getUserById,
    getAllUsers,
    updateUser
};