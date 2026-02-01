const pathService = require('../../src/services/path-management/pathService');
const pathRepository = require('../../src/repositories/pathRepository');
const ratingRepository = require('../../src/repositories/ratingRepository');

// Mock dependencies
jest.mock('../../src/repositories/pathRepository');
jest.mock('../../src/repositories/ratingRepository');

describe('PathService Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addPath', () => {
        it('should create a path with a generated UUID and default values', async () => {
            const pathData = { pathName: 'Test Path', startX: 1, startY: 1, endX: 2, endY: 2, length: 100 };
            pathRepository.createPath.mockResolvedValue({ id: 'uuid-123', ...pathData });

            const result = await pathService.addPath(pathData);

            expect(pathRepository.createPath).toHaveBeenCalledWith(expect.objectContaining({
                pathName: 'Test Path',
                userRating: 0,
                status: 'optimal'
            }));
            expect(result.id).toBeDefined();
        });
    });

    describe('updatePathStats', () => {
        it('should update path rating based on average from repository', async () => {
            const pathId = 'path-123';
            ratingRepository.getAverageRatingForPath.mockResolvedValue(4.6);
            pathRepository.getPathById.mockResolvedValue({ id: pathId });
            pathRepository.updatePathRating.mockResolvedValue({ id: pathId, user_rating: 5 });

            const result = await pathService.updatePathStats(pathId);

            expect(ratingRepository.getAverageRatingForPath).toHaveBeenCalledWith(pathId);
            expect(pathRepository.updatePathRating).toHaveBeenCalledWith(pathId, 5); // Rounded from 4.6
            expect(result.user_rating).toBe(5);
        });

        it('should return null if path does not exist', async () => {
            pathRepository.getPathById.mockResolvedValue(null);

            const result = await pathService.updatePathStats('invalid-id');

            expect(result).toBeNull();
        });
    });
});
