/**
 * Client integration tests: PathSearchScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PathSearchScreen from '../../src/pages/PathSearchScreen/PathSearchScreen';

const mockNavigate = jest.fn();

jest.mock('../../src/services/pathsApi', () => ({
  searchPaths: jest.fn(),
  getCachedPaths: jest.fn().mockResolvedValue([]),
  normalizePathForDisplay: (raw) => (raw ? { ...raw, id: raw.id, name: raw.path_name ?? raw.name } : null),
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

function renderWithProviders(ui) {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 400, height: 800 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      {ui}
    </SafeAreaProvider>
  );
}

describe('PathSearchScreen', () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
    searchPaths.mockResolvedValue([]);
  });

  it('renders search input and search button', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <PathSearchScreen navigation={navigation} />
    );
    fireEvent.press(getByText('Keyword'));
    expect(getByPlaceholderText('Name, place, difficulty...')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
  });

  it('shows empty message before search', () => {
    const { getByText } = renderWithProviders(
      <PathSearchScreen navigation={navigation} />
    );
    fireEvent.press(getByText('Keyword'));
    expect(getByText('Type and tap Search.')).toBeTruthy();
  });

  it('calls searchPaths when search button pressed', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <PathSearchScreen navigation={navigation} />
    );
    fireEvent.press(getByText('Keyword'));
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
    const { getByText } = renderWithProviders(
      <PathSearchScreen navigation={navigation} />
    );
    fireEvent.press(getByText('Keyword'));
    fireEvent.press(getByText('Search'));
    await waitFor(() => {
      expect(getByText('No paths found.')).toBeTruthy();
    });
  });

  it('navigates to PathDetail when path pressed', async () => {
    const path = { id: 's1', name: 'Search result' };
    searchPaths.mockResolvedValueOnce([path]);
    const { getByText } = renderWithProviders(
      <PathSearchScreen navigation={navigation} />
    );
    fireEvent.press(getByText('Keyword'));
    fireEvent.press(getByText('Search'));
    await waitFor(() => {
      expect(searchPaths).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(getByText('Search result')).toBeTruthy();
    });
    fireEvent.press(getByText('Search result'));
    expect(mockNavigate).toHaveBeenCalledWith('PathDetail', {
      pathId: 's1',
      path,
    });
  });
});
