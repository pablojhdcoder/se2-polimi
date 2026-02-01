const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../../repositories/userRepository');
const emailService = require('../external/emailService');
const { redisClient, connectRedis } = require('../../config/redis');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = 3600 * 24; // 24 hours in seconds

/**
 * Handles user registration. Accepts email, password, name (frontend contract).
 * Username is derived from email for DB uniqueness.
 * @param {Object} userData - { email, password, name? } or legacy { username, password, fullName, email, ... }
 */
const register = async (userData) => {
    const email = userData.email || userData.username;
    const password = userData.password;
    const name = userData.name ?? userData.fullName ?? email ?? '';
    const username = email; // use email as username (both unique in schema)
    const fullName = name || email;
    const { phoneNumber, profilePicture } = userData;

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const existingByEmail = await userRepository.getUserByEmail(email);
    if (existingByEmail) {
        throw new Error('Email already registered');
    }

    const existingByUsername = await userRepository.getUserByUsername(username);
    if (existingByUsername) {
        throw new Error('Username already taken');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
        id: crypto.randomUUID(),
        username,
        passwordHash,
        fullName,
        email,
        phoneNumber: phoneNumber || null,
        profilePicture: profilePicture || null
    };

    await userRepository.createUser(newUser);

    if (emailService && typeof emailService.sendWelcomeEmail === 'function') {
        emailService.sendWelcomeEmail(email, fullName).catch(err =>
            console.error('[AuthService] Welcome email failed:', err)
        );
    }

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * Handles user login. Accepts email or username (frontend sends email).
 * @param {string} emailOrUsername - Email or username
 * @param {string} password
 */
const login = async (emailOrUsername, password) => {
    const user =
        (await userRepository.getUserByEmail(emailOrUsername)) ||
        (await userRepository.getUserByUsername(emailOrUsername));
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
