/**
 * Client integration tests for RecordTripScreen.
 * Mocks TripDetectionEngine and ObstacleDetectionModule.
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import RecordTripScreen from '../../src/pages/RecordTripScreen/RecordTripScreen';

const mockGetState = jest.fn();
const mockStart = jest.fn();
const mockStop = jest.fn();
const mockStopTripManually = jest.fn();

jest.mock('../../src/sensors/trip-detection', () => ({
  TripDetectionEngine: {
    getState: () => mockGetState(),
    getCurrentTripDurationMs: () => 0,
    start: (...args) => mockStart(...args),
    stop: (...args) => mockStop(...args),
    stopTripManually: (...args) => mockStopTripManually(...args),
    onStateChange: null,
    onTripStart: null,
    onTripEnd: null,
  },
  TripState: {
    IDLE: 'IDLE',
    DETECTING: 'DETECTING',
    IN_TRIP: 'IN_TRIP',
    STOPPING: 'STOPPING',
  },
}));

const mockAddObstacleListener = jest.fn();
const mockRemoveObstacleListener = jest.fn();
const mockObstacleStart = jest.fn();
const mockObstacleStop = jest.fn();

jest.mock('../../src/sensors/obstacle-detection', () => {
  const mock = {
    addObstacleListener: (...args) => mockAddObstacleListener(...args),
    removeObstacleListener: (...args) => mockRemoveObstacleListener(...args),
    start: (...args) => mockObstacleStart(...args),
    stop: (...args) => mockObstacleStop(...args),
  };
  return { __esModule: true, default: mock, ObstacleDetectionModule: mock };
});

// Suppress Alert in tests
jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});

describe('RecordTripScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetState.mockReturnValue('IDLE');
  });

  it('renders title and state label', () => {
    const { getByText } = render(<RecordTripScreen />);
    expect(getByText('Record trip')).toBeTruthy();
    expect(getByText('Idle')).toBeTruthy();
  });

  it('shows Start detection when idle', () => {
    const { getByText } = render(<RecordTripScreen />);
    expect(getByText('Start detection')).toBeTruthy();
  });

  it('registers obstacle listener on mount and removes on unmount', () => {
    const { unmount } = render(<RecordTripScreen />);
    expect(mockAddObstacleListener).toHaveBeenCalled();
    unmount();
    expect(mockRemoveObstacleListener).toHaveBeenCalled();
  });

  it('calls TripDetectionEngine.start and ObstacleDetectionModule.start when Start detection pressed', async () => {
    mockStart.mockResolvedValue(undefined);
    mockObstacleStart.mockResolvedValue(undefined);
    const { getByText } = render(<RecordTripScreen />);
    await act(async () => {
      fireEvent.press(getByText('Start detection'));
    });
    expect(mockStart).toHaveBeenCalled();
    expect(mockObstacleStart).toHaveBeenCalled();
  });

  it('shows Stop detection when not idle and calls stop on press', async () => {
    mockGetState.mockReturnValue('IN_TRIP');
    const { getByText } = render(<RecordTripScreen />);
    expect(getByText('Stop detection')).toBeTruthy();
    await act(async () => {
      fireEvent.press(getByText('Stop detection'));
    });
    expect(mockStop).toHaveBeenCalled();
    expect(mockObstacleStop).toHaveBeenCalled();
  });

  it('shows End trip now when in trip and calls stopTripManually', async () => {
    mockGetState.mockReturnValue('IN_TRIP');
    const { getByText } = render(<RecordTripScreen />);
    await act(async () => {
      fireEvent.press(getByText('End trip now'));
    });
    expect(mockStopTripManually).toHaveBeenCalled();
  });

  it('shows No events yet when no obstacle events', () => {
    const { getByText } = render(<RecordTripScreen />);
    expect(getByText('No events yet')).toBeTruthy();
  });
});
