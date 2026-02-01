const tripRepository = require('../../src/repositories/tripRepository');
const { query } = require('../../src/pool');

// Mock the database pool
jest.mock('../../src/pool', () => ({
    query: jest.fn()
}));

describe('Trip Repository Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getTripById', () => {
        it('should return a trip when found', async () => {
            const mockTrip = { id: 'trip-1', path_id: 'path-A' };
            query.mockResolvedValue({ rows: [mockTrip] });

            const result = await tripRepository.getTripById('trip-1');

            expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM trips WHERE id'), ['trip-1']);
            expect(result).toEqual(mockTrip);
        });

        it('should return undefined when not found', async () => {
            query.mockResolvedValue({ rows: [] });
            const result = await tripRepository.getTripById('trip-999');
            expect(result).toBeUndefined();
        });
    });

    describe('createTrip', () => {
        it('should insert and return the new trip', async () => {
            const newTrip = {
                id: 't1', userId: 'u1', pathId: 'p1', tripDate: new Date(),
                tripLength: 10, personalRating: 5, temperature: 20,
                windSpeed: 5, windDegree: 100, windGust: 10,
                visibility: 10000, rain: 0, clouds: 0, recordedRoute: {}
            };
            query.mockResolvedValue({ rows: [newTrip] });

            const result = await tripRepository.createTrip(newTrip);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO trips'),
                expect.arrayContaining(['t1', 'u1', 'p1'])
            );
            expect(result).toEqual(newTrip);
        });
    });
});
