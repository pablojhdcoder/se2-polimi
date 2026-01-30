const authService = require('../services/user-management/authService');

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
 * Handle user login
 */
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
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

module.exports = {
    register,
    login,
    logout
};
