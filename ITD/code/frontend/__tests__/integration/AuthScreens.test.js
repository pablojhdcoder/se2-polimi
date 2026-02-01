import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/pages/LoginScreen/LoginScreen';
import RegisterScreen from '../../src/pages/RegisterScreen/RegisterScreen';
import HomeScreen from '../../src/pages/HomeScreen/HomeScreen';

// --- Mocks ---
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReplace = jest.fn();
const mockLogout = jest.fn();
const mockSetToken = jest.fn();
const mockSetUser = jest.fn();

jest.mock('../../src/services/api', () => ({
    __esModule: true,
    default: { post: jest.fn() },
}));

jest.mock('../../src/storage', () => ({
    setSession: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../src/navigation/useAuth', () => ({
    useAuth: () => ({
        setToken: mockSetToken,
        setUser: mockSetUser,
        logout: mockLogout,
    }),
}));

const api = require('../../src/services/api').default;

describe('Authentication Screens', () => {
    const navigation = {
        navigate: mockNavigate,
        goBack: mockGoBack,
        replace: mockReplace,
        getParent: () => ({ navigate: jest.fn() })
    };

    beforeEach(() => jest.clearAllMocks());

    describe('HomeScreen (Entry Point)', () => {
        it('shows login/register when unauthenticated', () => {
            const { getByText } = render(<HomeScreen navigation={navigation} isAuthenticated={false} />);
            expect(getByText('Log in')).toBeTruthy();
            fireEvent.press(getByText('Log in'));
            expect(mockNavigate).toHaveBeenCalledWith('Login');
        });

        it('shows logout when authenticated', () => {
            const { getByText } = render(<HomeScreen navigation={navigation} isAuthenticated={true} user={{ name: 'Test' }} />);
            expect(getByText('Log out')).toBeTruthy();
            fireEvent.press(getByText('Log out'));
            expect(mockLogout).toHaveBeenCalled();
        });
    });

    describe('LoginScreen', () => {
        it('validates empty inputs', async () => {
            const { getByText } = render(<LoginScreen navigation={navigation} />);
            fireEvent.press(getByText('Enter'));
            await waitFor(() => expect(getByText(/Enter email/)).toBeTruthy());
        });

        // Success path is now purely in Flows, but we check the form rendering here
        it('renders login form', () => {
            const { getByPlaceholderText } = render(<LoginScreen navigation={navigation} />);
            expect(getByPlaceholderText(/email/)).toBeTruthy();
            expect(getByPlaceholderText(/Password/)).toBeTruthy();
        });
    });

    describe('RegisterScreen', () => {
        it('validates password length', async () => {
            const { getByPlaceholderText, getAllByText, getByText } = render(<RegisterScreen navigation={navigation} />);
            fireEvent.changeText(getByPlaceholderText(/email/), 'a@b.com');
            fireEvent.changeText(getByPlaceholderText(/Password/), '12345');
            const regBtn = getAllByText('Register').pop();
            fireEvent.press(regBtn);
            await waitFor(() => expect(getByText(/at least 6 characters/)).toBeTruthy());
        });
    });
});
