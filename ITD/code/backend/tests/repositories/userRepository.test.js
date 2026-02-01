const userRepository = require('../../src/repositories/userRepository');
const { query } = require('../../src/pool');

// Mock the database pool
jest.mock('../../src/pool', () => ({
    query: jest.fn()
}));

describe('User Repository Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserById', () => {
        it('should return a user when found', async () => {
            const mockUser = { id: 'user-1', username: 'test' };
            query.mockResolvedValue({ rows: [mockUser] });

            const result = await userRepository.getUserById('user-1');

            expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users'), ['user-1']);
            expect(result).toEqual(mockUser);
        });

        it('should return undefined when not found', async () => {
            query.mockResolvedValue({ rows: [] });

            const result = await userRepository.getUserById('user-none');

            expect(result).toBeUndefined();
        });
    });

    describe('createUser', () => {
        it('should insert user successfully', async () => {
            const newUser = {
                id: 'new-id',
                username: 'newuser',
                passwordHash: 'hash',
                fullName: 'New User',
                phoneNumber: null,
                email: 'new@test.com',
                profilePicture: null
            };
            // createUser returns the result of the query directly
            query.mockResolvedValue({ rowCount: 1 });

            await userRepository.createUser(newUser);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                expect.arrayContaining(['new-id', 'newuser', 'hash'])
            );
        });
    });
});
