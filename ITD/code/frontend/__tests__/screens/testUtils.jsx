/**
 * Test utilities: mock navigation, route, and useAuth for screen tests.
 */

import React from 'react';
import { render } from '@testing-library/react-native';

export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  getParent: jest.fn(() => ({ navigate: jest.fn() })),
};

export const mockRoute = (params = {}) => ({ params });

export const mockUseAuth = (overrides = {}) => ({
  setToken: jest.fn(),
  setUser: jest.fn(),
  logout: jest.fn(),
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  ...overrides,
});

/**
 * Renders a component that uses useAuth with a mock AuthProvider value.
 */
export function renderWithAuth(ui, authValue = mockUseAuth()) {
  const AuthContext = require('../../src/navigation/AuthContext').AuthContext;
  return render(
    <AuthContext.Provider value={authValue}>
      {ui}
    </AuthContext.Provider>
  );
}
