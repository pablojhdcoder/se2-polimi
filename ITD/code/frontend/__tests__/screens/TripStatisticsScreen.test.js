/**
 * Client integration tests: TripStatisticsScreen (UC10).
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TripStatisticsScreen from '../../src/pages/TripStatisticsScreen/TripStatisticsScreen';

const mockNavigate = jest.fn();

jest.mock('../../src/services/tripsApi', () => ({
  getTrips: jest.fn(),
}));
jest.mock('../../src/storage/storageService', () => ({
  getOfflineData: jest.fn(() => Promise.resolve({ trips: [] })),
}));

const getTrips = require('../../src/services/tripsApi').getTrips;

describe('TripStatisticsScreen', () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
    getTrips.mockResolvedValue([]);
  });

  it('loads trips on mount and shows stats', async () => {
    const { getByText } = render(
      <TripStatisticsScreen navigation={navigation} />
    );
    await waitFor(() => {
      expect(getTrips).toHaveBeenCalled();
    });
    expect(getByText('Trip statistics (UC10)')).toBeTruthy();
    expect(getByText('Total trips')).toBeTruthy();
    expect(getByText('Recorded points')).toBeTruthy();
    expect(getByText('Total time (approx.)')).toBeTruthy();
    expect(getByText('Paths')).toBeTruthy();
    expect(getByText('Merge info (UC12)')).toBeTruthy();
  });

  it('shows loading message initially', () => {
    getTrips.mockImplementation(() => new Promise(() => {}));
    const { getByText } = render(
      <TripStatisticsScreen navigation={navigation} />
    );
    expect(getByText('Loading statistics…')).toBeTruthy();
  });

  it('Paths navigates to PathList', async () => {
    const { getByText } = render(
      <TripStatisticsScreen navigation={navigation} />
    );
    await waitFor(() => {
      expect(getTrips).toHaveBeenCalled();
    });
    fireEvent.press(getByText('Paths'));
    expect(mockNavigate).toHaveBeenCalledWith('PathList');
  });

  it('Merge info navigates to MergeInfo', async () => {
    const { getByText } = render(
      <TripStatisticsScreen navigation={navigation} />
    );
    await waitFor(() => {
      expect(getTrips).toHaveBeenCalled();
    });
    fireEvent.press(getByText('Merge info (UC12)'));
    expect(mockNavigate).toHaveBeenCalledWith('MergeInfo');
  });
});
