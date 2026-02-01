const authService = require('../../src/services/user-management/authService');
const userRepository = require('../../src/repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../src/repositories/userRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/services/user-management/redisClient', () => ({
    connectRedis: jest.fn(),
    redisClient: {
        set: jest.fn(),
        del: jest.fn()
    }
}));


describe('AuthService Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        const userData = {
            username: 'testadmin',
            password: 'Password123!',
            fullName: 'Test Admin',
            email: 'admin@test.com'
        };

        it('should throw an error if username is already taken', async () => {
            userRepository.getUserByUsername.mockResolvedValue({ id: 'existing-id' });
            // Should also check email
            userRepository.getUserByEmail.mockResolvedValue(null);

            await expect(authService.register(userData))
                .rejects.toThrow('Username already taken');
        });

        it('should correctly hash password and create user', async () => {
            userRepository.getUserByUsername.mockResolvedValue(null);
            userRepository.getUserByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_password');
            userRepository.createUser.mockResolvedValue({ rowCount: 1 });

            const result = await authService.register(userData);

            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(userRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
                username: userData.email, // authService uses email as username internally
                email: userData.email,
                passwordHash: 'hashed_password'
            }));
            expect(result).not.toHaveProperty('passwordHash');
        });
    });

    describe('login', () => {
        const loginData = { username: 'testuser', password: 'Password123!' };
        const mockUser = { id: 'user-id', username: 'testuser', password_hash: 'hashed_password' };

        it('should throw "Invalid credentials" if user is not found', async () => {
            userRepository.getUserByUsername.mockResolvedValue(null);
            userRepository.getUserByEmail.mockResolvedValue(null);

            await expect(authService.login(loginData.username, loginData.password))
                .rejects.toThrow('Invalid credentials');
        });

        it('should throw "Invalid credentials" if password does not match', async () => {
            userRepository.getUserByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login(loginData.username, loginData.password))
                .rejects.toThrow('Invalid credentials');
        });

        it('should return token and user if login is successful', async () => {
            userRepository.getUserByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mock-jwt-token');

            const result = await authService.login(loginData.username, loginData.password);

            expect(result.token).toBe('mock-jwt-token');
            expect(result.user.username).toBe('testuser');
            expect(result.user).not.toHaveProperty('password_hash');
        });
    });
});
