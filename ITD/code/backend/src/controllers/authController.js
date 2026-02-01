const authService = require('../services/user-management/authService');
const userRepository = require('../repositories/userRepository');
const userService = require('../services/user-management/userService');

/**
 * Handle user registration
 */
const register = async (req, res, next) => {
    try {
        const userData = req.body;
        const user = await authService.register(userData);
        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle user login. Accepts email or username (frontend sends email).
 */
const login = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const identifier = email ?? username;
        if (!identifier || !password) {
            return res.status(400).json({ error: 'Email/username and password are required.' });
        }
        const result = await authService.login(identifier, password);
        res.status(200).json({
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Handle user logout
 */
const logout = async (req, res, next) => {
    try {
        // Assuming userId is attached to req.user by an auth middleware
        const userId = req.user.id;
        const result = await authService.logout(userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Get current authenticated user (without password)
 */
const getMe = async (req, res, next) => {
    try {
        const user = await userRepository.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const { password_hash: _passwordHash, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
};

const ALLOWED_PROFILE_FIELDS = ['full_name', 'email', 'phone_number', 'profile_picture'];

/**
 * Update current user profile. Accepts only full_name, email, phone_number, profile_picture.
 */
const updateMe = async (req, res, next) => {
    try {
        const body = req.body || {};
        const updateData = {};
        for (const key of ALLOWED_PROFILE_FIELDS) {
            if (Object.prototype.hasOwnProperty.call(body, key)) {
                updateData[key] = body[key];
            }
        }
        const updated = await userService.updateUserProfile(req.user.id, updateData);
        if (!updated) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(updated);
    } catch (error) {
        if (error.message === 'Email already registered') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe,
    updateMe
};
