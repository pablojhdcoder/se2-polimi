const userService = require('../../src/services/user-management/userService');
const userRepository = require('../../src/repositories/userRepository');

jest.mock('../../src/repositories/userRepository');

describe('UserService Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserProfile', () => {
        it('should return user profile without sensitive data', async () => {
            const mockUser = {
                id: 'u1',
                username: 'alice',
                email: 'alice@test.com',
                password_hash: 'secret',
                fullName: 'Alice InWonderland'
            };
            userRepository.getUserById.mockResolvedValue(mockUser);

            const result = await userService.getUserProfile('u1');

            expect(userRepository.getUserById).toHaveBeenCalledWith('u1');
            expect(result).toEqual({
                id: 'u1',
                username: 'alice',
                email: 'alice@test.com',
                fullName: 'Alice InWonderland'
            });
            expect(result).not.toHaveProperty('password_hash');
        });

        it('should return null if user not found', async () => {
            userRepository.getUserById.mockResolvedValue(null);
            const result = await userService.getUserProfile('u999');
            expect(result).toBeNull();
        });

        it('should throw error if userId is missing', async () => {
            await expect(userService.getUserProfile(null)).rejects.toThrow('User ID is required');
        });
    });

    describe('updateUserProfile', () => {
        it('should verify userId is provided', async () => {
            await expect(userService.updateUserProfile(null, {})).rejects.toThrow('User ID is required');
        });

        // Since implementation is pending, we might expect it to throw "Not implemented"
        it('should throw Not Implemented for now', async () => {
            await expect(userService.updateUserProfile('u1', { name: 'Bob' })).rejects.toThrow('Not implemented');
        });
    });
});
