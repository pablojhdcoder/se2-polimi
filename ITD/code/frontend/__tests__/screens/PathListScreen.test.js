/**
 * Client integration tests: PathListScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PathListScreen from '../../src/pages/PathListScreen/PathListScreen';

const mockNavigate = jest.fn();

jest.mock('../../src/contexts/NetworkStatusContext', () => ({
  useNetworkStatus: () => ({
    isOnline: true,
    lastError: '',
    clearError: jest.fn(),
    pendingSyncCount: 0,
    refreshPendingSync: jest.fn(),
  }),
}));
jest.mock('../../src/services/pathsApi', () => ({
  getPaths: jest.fn(),
}));

const getPaths = require('../../src/services/pathsApi').getPaths;

describe('PathListScreen', () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
    getPaths.mockResolvedValue([]);
  });

  it('loads paths on mount and shows empty message when none', async () => {
    const { getByText } = render(<PathListScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getPaths).toHaveBeenCalled();
    });
    expect(getByText('No paths. Create one or search.')).toBeTruthy();
  });

  it('shows error and Retry when getPaths fails', async () => {
    getPaths.mockRejectedValueOnce(new Error('Network error'));
    const { getByText } = render(<PathListScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getByText('Network error')).toBeTruthy();
    });
    expect(getByText('Retry')).toBeTruthy();
  });

  it('Retry calls loadPaths again', async () => {
    getPaths.mockRejectedValueOnce(new Error('Fail')).mockResolvedValueOnce([]);
    const { getByText } = render(<PathListScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getByText('Retry')).toBeTruthy();
    });
    fireEvent.press(getByText('Retry'));
    await waitFor(() => {
      expect(getPaths).toHaveBeenCalledTimes(2);
    });
  });

  it('navigates to PathDetail when path is pressed', async () => {
    const path = { id: 'p1', name: 'Route A' };
    getPaths.mockResolvedValueOnce([path]);
    const { getByText } = render(<PathListScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getPaths).toHaveBeenCalled();
    });
    const pathEl = getByText('Route A');
    if (pathEl) {
      fireEvent.press(pathEl);
      expect(mockNavigate).toHaveBeenCalledWith('PathDetail', {
        pathId: 'p1',
        path,
      });
    }
  });
});
