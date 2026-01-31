/**
 * Client integration tests: HomeScreen.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../src/pages/HomeScreen/HomeScreen';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('../../src/navigation/useAuth', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

describe('HomeScreen', () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('when not authenticated shows title and Log in / Register buttons', () => {
    const { getByText } = render(
      <HomeScreen navigation={navigation} isAuthenticated={false} user={null} />
    );
    expect(getByText('Best Bike Paths')).toBeTruthy();
    expect(getByText(/Find and share bike paths/)).toBeTruthy();
    expect(getByText('Log in')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('Log in button navigates to Login', () => {
    const { getByText } = render(
      <HomeScreen navigation={navigation} isAuthenticated={false} user={null} />
    );
    fireEvent.press(getByText('Log in'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('Register button navigates to Register', () => {
    const { getByText } = render(
      <HomeScreen navigation={navigation} isAuthenticated={false} user={null} />
    );
    fireEvent.press(getByText('Register'));
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('when authenticated shows welcome and Log out', () => {
    const { getByText } = render(
      <HomeScreen
        navigation={navigation}
        isAuthenticated={true}
        user={{ email: 'u@test.com' }}
      />
    );
    expect(getByText('Best Bike Paths')).toBeTruthy();
    expect(getByText(/Hello,/)).toBeTruthy();
    expect(getByText('Log out')).toBeTruthy();
  });

  it('Log out button calls logout', () => {
    const { getByText } = render(
      <HomeScreen
        navigation={navigation}
        isAuthenticated={true}
        user={{ name: 'User' }}
      />
    );
    fireEvent.press(getByText('Log out'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
