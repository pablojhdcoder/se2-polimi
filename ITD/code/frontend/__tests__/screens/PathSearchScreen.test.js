/**
 * Client integration tests: PathSearchScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PathSearchScreen from '../../src/pages/PathSearchScreen/PathSearchScreen';

const mockNavigate = jest.fn();

jest.mock('../../src/services/pathsApi', () => ({
  searchPaths: jest.fn(),
  getCachedPaths: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../src/services/map/MapService', () => ({
  default: {
    searchPlaces: jest.fn().mockResolvedValue([]),
    getCurrentLocation: jest.fn(),
    reverseGeocode: jest.fn(),
  },
}));
jest.mock('../../src/contexts/NetworkStatusContext', () => ({
  useNetworkStatus: () => ({ isOnline: true }),
}));

const searchPaths = require('../../src/services/pathsApi').searchPaths;

describe('PathSearchScreen', () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
    searchPaths.mockResolvedValue([]);
  });

  it('renders search input and search button', () => {
    const { getByPlaceholderText, getByText } = render(
      <PathSearchScreen navigation={navigation} />
    );
    expect(getByPlaceholderText('Name, place, difficulty...')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
  });

  it('shows empty message before search', () => {
    const { getByText } = render(<PathSearchScreen navigation={navigation} />);
    expect(getByText('Type and tap Search.')).toBeTruthy();
  });

  it('calls searchPaths when search button pressed', async () => {
    const { getByPlaceholderText, getByText } = render(
      <PathSearchScreen navigation={navigation} />
    );
    fireEvent.changeText(
      getByPlaceholderText('Name, place, difficulty...'),
      'park'
    );
    fireEvent.press(getByText('Search'));
    await waitFor(() => {
      expect(searchPaths).toHaveBeenCalledWith({ search: 'park' });
    });
  });

  it('shows "No paths found" after search returns empty', async () => {
    searchPaths.mockResolvedValueOnce([]);
    const { getByText } = render(<PathSearchScreen navigation={navigation} />);
    fireEvent.press(getByText('Search'));
    await waitFor(() => {
      expect(getByText('No paths found.')).toBeTruthy();
    });
  });

  it('navigates to PathDetail when path pressed', async () => {
    const path = { id: 's1', name: 'Search result' };
    searchPaths.mockResolvedValueOnce([path]);
    const { getByText } = render(<PathSearchScreen navigation={navigation} />);
    fireEvent.press(getByText('Search'));
    await waitFor(() => {
      expect(searchPaths).toHaveBeenCalled();
    });
    fireEvent.press(getByText('Search result'));
    expect(mockNavigate).toHaveBeenCalledWith('PathDetail', {
      pathId: 's1',
      path,
    });
  });
});
