import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from '../../src/navigation/AuthContext';
import { NetworkStatusProvider } from '../../src/contexts/NetworkStatusContext';
import HomeScreen from '../../src/pages/HomeScreen/HomeScreen';
import LoginScreen from '../../src/pages/LoginScreen/LoginScreen';
import PathListScreen from '../../src/pages/PathListScreen/PathListScreen';
import PathDetailScreen from '../../src/pages/PathDetailScreen/PathDetailScreen';

// --- Mocks ---
jest.mock('../../src/services/api', () => ({
    __esModule: true,
    default: {
        post: jest.fn().mockResolvedValue({ data: {} }),
        get: jest.fn().mockResolvedValue({ data: [] }),
        request: jest.fn().mockResolvedValue({ data: {} }),
        interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
    },
    setNetworkStatusCallbacks: jest.fn(),
}));

jest.mock('../../src/storage', () => ({
    setSession: jest.fn(() => Promise.resolve()),
    getToken: jest.fn(() => Promise.resolve(null)),
    getUser: jest.fn(() => Promise.resolve(null)),
    getSyncQueue: jest.fn(() => Promise.resolve([])),
    clearSession: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../src/services/pathsApi', () => ({
    getPaths: jest.fn().mockResolvedValue([]),
    normalizePathForDisplay: (p) => p,
}));

jest.mock('../../src/services/syncQueueProcessor', () => ({
    processSyncQueue: jest.fn(() => Promise.resolve()),
}));

const Stack = createStackNavigator();

function AppFlowWrapper() {
    return (
        <AuthProvider>
            <NetworkStatusProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="PathList" component={PathListScreen} />
                        <Stack.Screen name="PathDetail" component={PathDetailScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </NetworkStatusProvider>
        </AuthProvider>
    );
}

describe('App Level Flows', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Authentication Flow: can navigate from Home to Login and back', async () => {
        const { getByText, queryByText } = render(<AppFlowWrapper />);

        // Check Home
        expect(getByText('Best Bike Paths')).toBeTruthy();

        // Navigate to Login
        fireEvent.press(getByText('Log in'));
        await waitFor(() => expect(getByText('Enter')).toBeTruthy());

        // Back to Home
        fireEvent.press(getByText('Back'));
        await waitFor(() => expect(getByText('Best Bike Paths')).toBeTruthy());
    });

    it('Sync/Offline Integration: provides context without crashing', async () => {
        // Basic render test for the complex provider tree
        const { getByText } = render(<AppFlowWrapper />);
        expect(getByText('Best Bike Paths')).toBeTruthy();
    });
});
