/**
 * Client integration tests for TripRecordingScreen.
 * Mocks TripDetectionEngine, createTrip, storage, navigation.
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import TripRecordingScreen from '../../src/pages/TripRecordingScreen/TripRecordingScreen';

const mockGetState = jest.fn();
const mockGetCurrentTripData = jest.fn();
const mockStartRecording = jest.fn();
const mockStopRecording = jest.fn();
const mockOnTripEndCallbacks = [];

jest.mock('../../src/sensors/trip-detection', () => ({
  __esModule: true,
  default: {
    getState: () => mockGetState(),
    getCurrentTripData: () => mockGetCurrentTripData(),
    startRecording: (...args) => mockStartRecording(...args),
    stopRecording: (...args) => mockStopRecording(...args),
    onTripEnd(callback) {
      if (typeof callback === 'function') mockOnTripEndCallbacks.push(callback);
    },
    removeOnTripEnd: jest.fn(),
  },
  STATE_IDLE: 'IDLE',
  STATE_RECORDING: 'RECORDING',
  STATE_TRIP_STARTED: 'TRIP_STARTED',
  STATE_TRIP_ENDED: 'TRIP_ENDED',
}));

const mockCreateTrip = jest.fn();
jest.mock('../../src/services/tripsApi', () => ({
  createTrip: (...args) => mockCreateTrip(...args),
}));

const mockAddToSyncQueue = jest.fn();
const mockGetOfflineData = jest.fn();
const mockSetOfflineDataKey = jest.fn();
jest.mock('../../src/storage/storageService', () => ({
  getOfflineData: (...args) => mockGetOfflineData(...args),
  setOfflineDataKey: (...args) => mockSetOfflineDataKey(...args),
}));
jest.mock('../../src/storage/syncQueue', () => ({
  addToSyncQueue: (...args) => mockAddToSyncQueue(...args),
}));

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  getParent: () => ({ navigate: mockNavigate }),
};

describe('TripRecordingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetState.mockReturnValue('IDLE');
    mockGetCurrentTripData.mockReturnValue({ track: [], startTime: null, endTime: null });
    mockGetOfflineData.mockResolvedValue({ trips: [] });
    mockSetOfflineDataKey.mockResolvedValue(undefined);
    mockAddToSyncQueue.mockResolvedValue({});
  });

  it('renders title and state label', () => {
    const { getByText } = render(<TripRecordingScreen navigation={mockNavigation} />);
    expect(getByText('Record trip (UC8)')).toBeTruthy();
    expect(getByText('Waiting')).toBeTruthy();
  });

  it('shows Start recording when idle', () => {
    const { getByText } = render(<TripRecordingScreen navigation={mockNavigation} />);
    expect(getByText('Start recording')).toBeTruthy();
  });

  it('calls startRecording when Start recording is pressed', async () => {
    mockStartRecording.mockResolvedValue(undefined);
    const { getByText } = render(<TripRecordingScreen navigation={mockNavigation} />);
    await act(async () => {
      fireEvent.press(getByText('Start recording'));
    });
    expect(mockStartRecording).toHaveBeenCalled();
  });

  it('shows End trip when recording and calls stopRecording on press', async () => {
    mockGetState.mockReturnValue('TRIP_STARTED');
    mockGetCurrentTripData.mockReturnValue({
      track: [{ lat: 45, lng: 9, timestamp: 1 }],
      startTime: 1,
      endTime: null,
    });
    mockStopRecording.mockReturnValue({
      track: [{ lat: 45, lng: 9, timestamp: 1 }],
      startTime: 1,
      endTime: 2,
    });
    const { getByText } = render(<TripRecordingScreen navigation={mockNavigation} />);
    await act(async () => {
      fireEvent.press(getByText('End trip now'));
    });
    expect(mockStopRecording).toHaveBeenCalled();
  });

  it('navigates to PastTrips tab when View trip statistics is pressed', () => {
    const { getByText } = render(<TripRecordingScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('View trip statistics'));
    expect(mockNavigate).toHaveBeenCalledWith('PastTrips');
  });

  it('shows error when startRecording throws', async () => {
    mockStartRecording.mockRejectedValueOnce(new Error('Permission denied'));
    const { getByText } = render(<TripRecordingScreen navigation={mockNavigation} />);
    await act(async () => {
      fireEvent.press(getByText('Start recording'));
    });
    expect(getByText('Permission denied')).toBeTruthy();
  });

  it.skip('adds to sync queue when createTrip fails', async () => {
    mockGetState.mockReturnValue('TRIP_STARTED');
    mockGetCurrentTripData.mockReturnValue({
      track: [{ lat: 45, lng: 9, timestamp: 1 }],
      startTime: 1,
      endTime: null,
    });
    mockStopRecording.mockReturnValue({
      track: [{ lat: 45, lng: 9, timestamp: 1 }],
      startTime: 1,
      endTime: 2,
    });
    mockCreateTrip.mockRejectedValueOnce(new Error('Network error'));
    mockAddToSyncQueue.mockResolvedValue({ id: 'sync_1' });
    const { getByText } = render(<TripRecordingScreen navigation={mockNavigation} />);
    await act(async () => {
      fireEvent.press(getByText('End trip now'));
    });
    await act(async () => {});
    expect(mockAddToSyncQueue).toHaveBeenCalled();
    expect(mockSetOfflineDataKey).toHaveBeenCalledWith('trips', expect.any(Array));
  });
});
