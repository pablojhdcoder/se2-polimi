/**
 * Unit tests for MapService. Mocks axios and expo-location.
 */

const mockRequestPermissions = jest.fn();
const mockGetCurrentPosition = jest.fn();

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: (...args) => mockRequestPermissions(...args),
  getCurrentPositionAsync: (...args) => mockGetCurrentPosition(...args),
  Accuracy: { High: 4 },
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const axiosModule = require('axios');
const axiosGet = axiosModule.default?.get ?? axiosModule.get;
const originalEnv = process.env;

describe('MapService', () => {
  let MapServiceModule;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: 'test-token' };
    jest.isolateModules(() => {
      MapServiceModule = require('../../../src/services/map/MapService').default;
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getCurrentLocation', () => {
    it('returns latitude, longitude and timestamp when permission granted', async () => {
      mockRequestPermissions.mockResolvedValue({ status: 'granted' });
      mockGetCurrentPosition.mockResolvedValue({
        coords: { latitude: 45.5, longitude: 9.2 },
        timestamp: 1234567890,
      });

      const result = await MapServiceModule.getCurrentLocation();

      expect(result).toEqual({
        latitude: 45.5,
        longitude: 9.2,
        timestamp: 1234567890,
      });
      expect(mockRequestPermissions).toHaveBeenCalled();
      expect(mockGetCurrentPosition).toHaveBeenCalledWith({ accuracy: 4 });
    });

    it('throws when permission denied', async () => {
      mockRequestPermissions.mockResolvedValue({ status: 'denied' });

      await expect(MapServiceModule.getCurrentLocation()).rejects.toThrow(
        'Permission to access location was denied'
      );
      expect(mockGetCurrentPosition).not.toHaveBeenCalled();
    });

    it('throws when getCurrentPositionAsync rejects', async () => {
      mockRequestPermissions.mockResolvedValue({ status: 'granted' });
      mockGetCurrentPosition.mockRejectedValue(new Error('Location unavailable'));

      await expect(MapServiceModule.getCurrentLocation()).rejects.toThrow('Location unavailable');
    });
  });

  describe('searchPlaces', () => {
    it('returns features from axios response when token is set', async () => {
      const features = [
        { id: '1', place_name: 'Milan', geometry: { coordinates: [9.19, 45.46] } },
      ];
      axiosGet.mockResolvedValue({ data: { features } });

      const result = await MapServiceModule.searchPlaces('Milan');

      expect(result).toEqual(features);
      expect(axiosGet).toHaveBeenCalledWith(
        expect.stringContaining('mapbox.places'),
        expect.objectContaining({
          params: expect.objectContaining({
            access_token: 'test-token',
            autocomplete: true,
            limit: 5,
          }),
        })
      );
    });

    it('returns empty array when token is missing', async () => {
      process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN = '';
      jest.isolateModules(() => {
        MapServiceModule = require('../../../src/services/map/MapService').default;
      });

      const result = await MapServiceModule.searchPlaces('Milan');

      expect(result).toEqual([]);
      expect(axiosGet).not.toHaveBeenCalled();
    });

    it('returns empty array when axios throws', async () => {
      axiosGet.mockRejectedValue(new Error('Network error'));

      const result = await MapServiceModule.searchPlaces('Milan');

      expect(result).toEqual([]);
    });
  });

  describe('getDirections', () => {
    it('returns transformed route when axios resolves with valid data', async () => {
      const routeData = {
        routes: [
          {
            distance: 5000,
            duration: 1200,
            geometry: { type: 'LineString', coordinates: [[9.19, 45.46], [9.20, 45.47]] },
            legs: [
              {
                steps: [
                  {
                    maneuver: { instruction: 'Turn left', location: [9.19, 45.46] },
                    distance: 100,
                  },
                ],
              },
            ],
            summary: 'Via Example',
          },
        ],
      };
      axiosGet.mockResolvedValue({ data: routeData });

      const result = await MapServiceModule.getDirections([9.19, 45.46], [9.20, 45.47]);

      expect(result).not.toBeNull();
      expect(result.metadata).toEqual(expect.objectContaining({ provider: 'mapbox' }));
      expect(result.summary).toEqual(
        expect.objectContaining({
          distance: 5000,
          duration: 1200,
        })
      );
      expect(result.path).toEqual(routeData.routes[0].geometry);
      expect(result.checkpoints).toHaveLength(1);
      expect(result.checkpoints[0]).toHaveProperty('instruction', 'Turn left');
    });

    it('returns null when token is missing', async () => {
      process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN = '';
      jest.isolateModules(() => {
        MapServiceModule = require('../../../src/services/map/MapService').default;
      });

      const result = await MapServiceModule.getDirections([9.19, 45.46], [9.20, 45.47]);

      expect(result).toBeNull();
    });

    it('returns null when axios throws', async () => {
      axiosGet.mockRejectedValue(new Error('Directions error'));

      const result = await MapServiceModule.getDirections([9.19, 45.46], [9.20, 45.47]);

      expect(result).toBeNull();
    });
  });

  describe('formatRecordedRoute', () => {
    it('returns object with metadata and path (LineString)', () => {
      const coordinates = [[9.19, 45.46], [9.20, 45.47]];
      const metadata = { startTime: 123 };

      const result = MapServiceModule.formatRecordedRoute(coordinates, metadata);

      expect(result.metadata).toMatchObject({
        provider: 'app_gps',
        version: '1.0',
        startTime: 123,
      });
      expect(result.path).toEqual({
        type: 'LineString',
        coordinates,
      });
    });

    it('works with empty metadata', () => {
      const coordinates = [[0, 0]];

      const result = MapServiceModule.formatRecordedRoute(coordinates);

      expect(result.metadata).toHaveProperty('provider', 'app_gps');
      expect(result.metadata).toHaveProperty('recordedAt');
      expect(result.path.coordinates).toEqual([[0, 0]]);
    });
  });
});
