/**
 * E2E-style client tests: Auth flow (register → login → home).
 * No real backend; API and storage are mocked.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from '../../src/navigation/AuthContext';
import HomeScreen from '../../src/pages/HomeScreen/HomeScreen';
import LoginScreen from '../../src/pages/LoginScreen/LoginScreen';
import RegisterScreen from '../../src/pages/RegisterScreen/RegisterScreen';

jest.mock('../../src/services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    request: jest.fn(),
  },
}));

jest.mock('../../src/storage', () => ({
  setSession: jest.fn(() => Promise.resolve()),
  getToken: jest.fn(() => Promise.resolve(null)),
  getUser: jest.fn(() => Promise.resolve(null)),
  clearSession: jest.fn(() => Promise.resolve()),
}));

const Stack = createStackNavigator();

function renderAuthStack(initialRoute = 'Home') {
  return render(
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

describe('E2E Auth flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const storage = require('../../src/storage');
    storage.getToken.mockResolvedValue(null);
    storage.getUser.mockResolvedValue(null);
  });

  it('shows Home (unauthenticated) with Log in and Register buttons', () => {
    const { getByText } = renderAuthStack();
    expect(getByText('Best Bike Paths')).toBeTruthy();
    expect(getByText('Log in')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('navigates to Login when Log in is pressed', () => {
    const { getByText } = renderAuthStack();
    fireEvent.press(getByText('Log in'));
    expect(getByText('Log in')).toBeTruthy();
    expect(getByText('Enter')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('navigates to Register when Register is pressed', () => {
    const { getByText } = renderAuthStack();
    fireEvent.press(getByText('Register'));
    expect(getByText('Back')).toBeTruthy();
  });

  it('login flow: submit with valid credentials calls API and setSession', async () => {
    const api = require('../../src/services/api').default;
    const storage = require('../../src/storage');
    api.post.mockResolvedValueOnce({
      data: { token: 'fake-token', user: { email: 'u@test.com' } },
    });

    const { getByText, getByPlaceholderText } = renderAuthStack('Login');
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'u@test.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'secret123');
    fireEvent.press(getByText('Enter'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'u@test.com',
        password: 'secret123',
      });
    });
    await waitFor(() => {
      expect(storage.setSession).toHaveBeenCalledWith('fake-token', { email: 'u@test.com' });
    });
  });

  it('login flow: shows error when email/password empty', async () => {
    const { getByText } = renderAuthStack('Login');
    fireEvent.press(getByText('Enter'));
    await waitFor(() => {
      expect(getByText('Enter email and password.')).toBeTruthy();
    });
  });

  it('register flow: submit calls register then login and setSession', async () => {
    const api = require('../../src/services/api').default;
    const storage = require('../../src/storage');
    api.post
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({
        data: { token: 'new-token', user: { email: 'new@test.com' } },
      });

    const { getAllByText, getByPlaceholderText } = renderAuthStack('Register');
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'new@test.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password6');
    fireEvent.press(getAllByText('Register').pop());

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', expect.any(Object));
    });
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'new@test.com',
        password: 'password6',
      });
    });
    await waitFor(() => {
      expect(storage.setSession).toHaveBeenCalledWith('new-token', { email: 'new@test.com' });
    });
  });

  it('register flow: shows error when password too short', async () => {
    const { getByText, getAllByText, getByPlaceholderText } = renderAuthStack('Register');
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'a@b.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '12345');
    fireEvent.press(getAllByText('Register').pop());
    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters.')).toBeTruthy();
    });
  });

  it('Back from Login returns to previous screen', () => {
    const { getByText } = renderAuthStack();
    fireEvent.press(getByText('Log in'));
    fireEvent.press(getByText('Back'));
    expect(getByText('Best Bike Paths')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });
});
