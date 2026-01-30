const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../../repositories/userrepository');
const { redisClient, connectRedis } = require('./redisClient');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = 3600 * 24; // 24 hours in seconds

/**
 * Handles user registration
 * @param {Object} userData - User details (username, password, fullName, email, etc.)
 */
const register = async (userData) => {
    const { username, password, fullName, email, phoneNumber, profilePicture } = userData;

    // Check if user already exists
    const existingUser = await userRepository.getUserByUsername(username);
    if (existingUser) {
        throw new Error('Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user object
    const newUser = {
        id: crypto.randomUUID(),
        username,
        passwordHash,
        fullName,
        email,
        phoneNumber,
        profilePicture
    };

    await userRepository.createUser(newUser);

    // Remove passwordHash from return object
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * Handles user login and session creation in Redis
 * @param {string} username 
 * @param {string} password 
 */
const login = async (username, password) => {
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'your_fallback_secret',
        { expiresIn: '24h' }
    );

    // Store session in Redis
    await connectRedis();
    const sessionKey = `session:${user.id}`;
    await redisClient.set(sessionKey, token, {
        EX: TOKEN_EXPIRY
    });

    const { password_hash: _, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token
    };
};

/**
 * Handles user logout by removing session from Redis
 * @param {string} userId 
 */
const logout = async (userId) => {
    await connectRedis();
    const sessionKey = `session:${userId}`;
    await redisClient.del(sessionKey);
    return { message: 'Logged out successfully' };
};

module.exports = {
    register,
    login,
    logout
};
