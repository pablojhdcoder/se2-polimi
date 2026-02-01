/**
 * Client integration tests: RegisterScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../../src/pages/RegisterScreen/RegisterScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
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
  useAuth: () => ({ setToken: mockSetToken, setUser: mockSetUser }),
}));

const api = require('../../src/services/api').default;

describe('RegisterScreen', () => {
  const navigation = { navigate: mockNavigate, goBack: mockGoBack };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders register form with title and inputs', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <RegisterScreen navigation={navigation} />
    );
    expect(getAllByText('Register').length).toBeGreaterThanOrEqual(1);
    expect(getByPlaceholderText('Your name')).toBeTruthy();
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getAllByText('Back')[0]).toBeTruthy();
  });

  it('shows error when email/password empty', async () => {
    const { getAllByText, getByText } = render(<RegisterScreen navigation={navigation} />);
    const registerButtons = getAllByText('Register');
    fireEvent.press(registerButtons[registerButtons.length - 1]);
    await waitFor(() => {
      expect(getByText('Enter email and password.')).toBeTruthy();
    });
  });

  it('shows error when password too short', async () => {
    const { getByPlaceholderText, getAllByText, getByText } = render(
      <RegisterScreen navigation={navigation} />
    );
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'a@b.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '12345');
    const registerButtons = getAllByText('Register');
    fireEvent.press(registerButtons[registerButtons.length - 1]);
    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters.')).toBeTruthy();
    });
  });

  it('calls register then login and sets session on success', async () => {
    api.post
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({
        data: { token: 't1', user: { email: 'x@y.com' } },
      });

    const { getByPlaceholderText, getAllByText } = render(
      <RegisterScreen navigation={navigation} />
    );
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'x@y.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'secret12');
    const registerButtons = getAllByText('Register');
    fireEvent.press(registerButtons[registerButtons.length - 1]);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', expect.any(Object));
      expect(api.post).toHaveBeenCalledWith('/auth/login', expect.any(Object));
      expect(mockSetToken).toHaveBeenCalledWith('t1');
      expect(mockSetUser).toHaveBeenCalledWith({ email: 'x@y.com' });
    });
  });

  it('Back button calls goBack', () => {
    const { getByText } = render(<RegisterScreen navigation={navigation} />);
    fireEvent.press(getByText('Back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
