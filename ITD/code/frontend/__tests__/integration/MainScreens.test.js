import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PathListScreen from '../../src/pages/PathListScreen/PathListScreen';
import PathDetailScreen from '../../src/pages/PathDetailScreen/PathDetailScreen';
import PathSearchScreen from '../../src/pages/PathSearchScreen/PathSearchScreen';
import PathCreateManualScreen from '../../src/pages/PathCreateManualScreen/PathCreateManualScreen';
import ReviewsScreen from '../../src/pages/ReviewsScreen/ReviewsScreen';
import TripStatisticsScreen from '../../src/pages/TripStatisticsScreen/TripStatisticsScreen';

// --- Global Mocks for Main Screens ---
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('../../src/services/pathsApi', () => ({
    getPaths: jest.fn().mockResolvedValue([]),
    getPathById: jest.fn().mockResolvedValue({ id: '1', name: 'Greenway', distance: 10 }),
    searchPaths: jest.fn().mockResolvedValue([]),
    createPath: jest.fn(),
    getCachedPaths: jest.fn().mockResolvedValue([]),
    normalizePathForDisplay: (p) => p,
}));
jest.mock('../../src/services/reviewsApi', () => ({ getReviews: jest.fn().mockResolvedValue([]) }));
jest.mock('../../src/services/tripsApi', () => ({ getTrips: jest.fn().mockResolvedValue([]) }));
jest.mock('../../src/contexts/NetworkStatusContext', () => ({
    useNetworkStatus: () => ({ isOnline: true }),
}));
jest.mock('../../src/storage/storageService', () => ({
    getOfflineData: jest.fn(() => Promise.resolve({ trips: [] })),
}));
jest.mock('../../src/services/map/MapService', () => ({
    __esModule: true,
    default: {
        searchPlaces: jest.fn().mockResolvedValue([]),
        getCurrentLocation: jest.fn(),
        reverseGeocode: jest.fn(),
        getDirections: jest.fn(),
        formatRecordedRoute: jest.fn(),
    },
}));
jest.mock('../../src/navigation/useAuth', () => ({
    useAuth: () => ({ user: null, token: null }),
}));

function renderWithInjectedMetrics(ui) {
    return render(
        <SafeAreaProvider initialMetrics={{ frame: { width: 400, height: 800 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
            {ui}
        </SafeAreaProvider>
    );
}

describe('Main Feature Screens', () => {
    const navigation = { navigate: mockNavigate, goBack: mockGoBack, replace: jest.fn() };

    beforeEach(() => jest.clearAllMocks());

    describe('Path Management', () => {
        it('PathListScreen: shows empty message when no paths', async () => {
            const { getByText } = render(<PathListScreen navigation={navigation} />);
            await waitFor(() => expect(getByText(/No paths/)).toBeTruthy());
        });

        it('PathDetailScreen: shows path info from route params', () => {
            const path = { id: '1', name: 'Greenway', distance: 10 };
            const { getByText } = render(<PathDetailScreen navigation={navigation} route={{ params: { pathId: '1', path } }} />);
            expect(getByText('Greenway')).toBeTruthy();
        });

        it('PathCreateManualScreen: validates name', async () => {
            const { getByText } = render(<PathCreateManualScreen navigation={navigation} />);
            fireEvent.press(getByText('Create path'));
            await waitFor(() => expect(getByText(/name is required/)).toBeTruthy());
        });
    });

    describe('User Activity & Stats', () => {
        it('ReviewsScreen: loads and displays reviews', async () => {
            const { getByText } = render(<ReviewsScreen navigation={navigation} />);
            const getReviews = require('../../src/services/reviewsApi').getReviews;
            await waitFor(() => expect(getReviews).toHaveBeenCalled());
        });

        it('TripStatisticsScreen: shows total trips section', async () => {
            const { getByText } = render(<TripStatisticsScreen navigation={navigation} />);
            await waitFor(() => expect(getByText('Total trips')).toBeTruthy());
        });
    });
});
