/**
 * Client integration tests: LoginScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/pages/LoginScreen/LoginScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockGetParent = jest.fn(() => ({ navigate: jest.fn() }));
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
  }),
}));

const api = require('../../src/services/api').default;

describe('LoginScreen', () => {
  const navigation = {
    navigate: mockNavigate,
    goBack: mockGoBack,
    getParent: mockGetParent,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with title and inputs', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={navigation} />
    );
    expect(getByText('Log in')).toBeTruthy();
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Enter')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('shows error when email and password are empty on submit', async () => {
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText('Enter'));
    await waitFor(() => {
      expect(getByText('Enter email and password.')).toBeTruthy();
    });
  });

  it('calls API and sets session on successful login', async () => {
    api.post.mockResolvedValueOnce({
      data: { token: 'jwt123', user: { email: 'u@test.com' } },
    });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
    );
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'u@test.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'pass123');
    fireEvent.press(getByText('Enter'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'u@test.com',
        password: 'pass123',
      });
    });
    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith('jwt123');
      expect(mockSetUser).toHaveBeenCalledWith({ email: 'u@test.com' });
    });
  });

  it('Back button calls goBack', () => {
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText('Back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
