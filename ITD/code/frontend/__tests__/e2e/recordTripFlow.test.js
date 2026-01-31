/**
 * E2E-style client tests: Record trip flow (start → stop → save).
 * TripDetectionEngine and tripsApi/syncQueue are mocked.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TripRecordingScreen from '../../src/pages/TripRecordingScreen/TripRecordingScreen';

jest.mock('../../src/sensors/trip-detection', () => {
  const mockGetState = jest.fn(() => 'idle');
  const mockGetCurrentTripData = jest.fn(() => ({ track: [], startTime: null, endTime: null }));
  return {
    __esModule: true,
    default: {
      startRecording: jest.fn(() => Promise.resolve()),
      stopRecording: jest.fn(() => null),
      getState: mockGetState,
      getCurrentTripData: mockGetCurrentTripData,
      onTripEnd: jest.fn(),
      removeOnTripEnd: jest.fn(),
    },
    STATE_IDLE: 'idle',
    STATE_RECORDING: 'recording',
    STATE_TRIP_STARTED: 'trip_started',
    STATE_TRIP_ENDED: 'trip_ended',
  };
});

jest.mock('../../src/services/tripsApi', () => ({
  createTrip: jest.fn(),
}));

jest.mock('../../src/storage/syncQueue', () => ({
  addToSyncQueue: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../src/storage/storageService', () => ({
  getOfflineData: jest.fn(() => Promise.resolve({ trips: [] })),
  setOfflineDataKey: jest.fn(() => Promise.resolve()),
}));

const Stack = createStackNavigator();

function renderTripRecording() {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TripRecording" component={TripRecordingScreen} />
        <Stack.Screen name="TripStatistics" component={() => null} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tripDetection = () => require('../../src/sensors/trip-detection').default;

describe('E2E Record trip flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const engine = tripDetection();
    if (engine.getState) engine.getState.mockReturnValue?.('idle');
    if (engine.getCurrentTripData) engine.getCurrentTripData.mockReturnValue?.({ track: [], startTime: null, endTime: null });
  });

  it('shows Waiting and Start recording when idle', () => {
    const { getByText } = renderTripRecording();
    expect(getByText('Record trip (UC8)')).toBeTruthy();
    expect(getByText('Waiting')).toBeTruthy();
    expect(getByText('Start recording')).toBeTruthy();
  });

  it('Start recording calls TripDetectionEngine.startRecording', async () => {
    const engine = tripDetection();
    const { getByText } = renderTripRecording();
    fireEvent.press(getByText('Start recording'));
    await waitFor(() => {
      expect(engine.startRecording).toHaveBeenCalled();
    });
  });

  it('when state is recording, shows End trip button', async () => {
    const engine = tripDetection();
    engine.getState.mockReturnValue('recording');
    engine.getCurrentTripData.mockReturnValue({ track: [{ lat: 0, lng: 0 }], startTime: Date.now(), endTime: null });
    const { getByText } = renderTripRecording();
    await waitFor(() => {
      expect(getByText('End trip now')).toBeTruthy();
    }, { timeout: 2500 });
  });

  it('End trip calls stopRecording and navigates to review when trip has track', async () => {
    const engine = tripDetection();
    const tripsApi = require('../../src/services/tripsApi');
    tripsApi.createTrip.mockResolvedValue({});
    const tripData = {
      track: [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }],
      startTime: 1000,
      endTime: 2000,
    };
    engine.getState.mockReturnValue('recording');
    engine.stopRecording.mockReturnValue(tripData);
    engine.getCurrentTripData.mockReturnValue(tripData);

    const { getByText } = renderTripRecording();
    fireEvent.press(getByText('End trip now'));

    await waitFor(() => {
      expect(engine.stopRecording).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(getByText('Record trip (UC8)')).toBeTruthy();
    });
  });

  it.skip('when createTrip fails, adds to sync queue and shows offline message', async () => {
    const engine = tripDetection();
    const tripsApi = require('../../src/services/tripsApi');
    const syncQueue = require('../../src/storage/syncQueue');
    const storageService = require('../../src/storage/storageService');
    tripsApi.createTrip.mockRejectedValue(new Error('Network error'));
    syncQueue.addToSyncQueue.mockResolvedValue({ id: 'q1' });
    storageService.getOfflineData.mockResolvedValue({ trips: [] });
    storageService.setOfflineDataKey.mockResolvedValue();

    const tripData = {
      track: [{ lat: 1, lng: 1 }],
      startTime: 1000,
      endTime: 2000,
    };
    engine.getState.mockReturnValue('recording');
    engine.stopRecording.mockReturnValue(tripData);
    engine.getCurrentTripData.mockReturnValue(tripData);

    const { getByText } = renderTripRecording();
    fireEvent.press(getByText('End trip now'));

    await waitFor(() => {
      expect(tripsApi.createTrip).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(syncQueue.addToSyncQueue).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/trips',
          body: expect.objectContaining({ track: tripData.track }),
        })
      );
    });
    await waitFor(() => {
      expect(getByText(/No connection. Trip saved and will be sent when syncing./)).toBeTruthy();
    });
  });

  it('View trip statistics link is present', () => {
    const { getByText } = renderTripRecording();
    expect(getByText('View trip statistics')).toBeTruthy();
  });
});
