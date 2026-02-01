/**
 * E2E-style client tests: Path flow (list → detail → create manual → publish).
 * No real backend; pathsApi and navigation are mocked.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PathListScreen from '../../src/pages/PathListScreen/PathListScreen';
import PathDetailScreen from '../../src/pages/PathDetailScreen/PathDetailScreen';
import PathDataScreen from '../../src/pages/PathDataScreen/PathDataScreen';
import PathCreateManualScreen from '../../src/pages/PathCreateManualScreen/PathCreateManualScreen';
import PublishPathScreen from '../../src/pages/PublishPathScreen/PublishPathScreen';

jest.mock('../../src/contexts/NetworkStatusContext', () => ({
  useNetworkStatus: () => ({
    isOnline: true,
    lastError: '',
    clearError: jest.fn(),
    pendingSyncCount: 0,
    refreshPendingSync: jest.fn(),
  }),
}));
jest.mock('../../src/services/map/MapService', () => ({
  __esModule: true,
  default: {
    searchPlaces: jest.fn().mockResolvedValue([]),
    getCurrentLocation: jest.fn(),
    reverseGeocode: jest.fn(),
    getDirections: jest.fn(),
    formatRecordedRoute: jest.fn(),
  },
}));
jest.mock('../../src/services/pathsApi', () => ({
  getPaths: jest.fn(),
  getPathById: jest.fn(),
  createPath: jest.fn(),
}));

const Stack = createStackNavigator();

function renderPathList() {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PathList" component={PathListScreen} />
        <Stack.Screen name="PathDetail" component={PathDetailScreen} />
        <Stack.Screen name="PathCreateManual" component={PathCreateManualScreen} />
        <Stack.Screen name="PublishPath" component={PublishPathScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function renderPathDetail(routeParams) {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PathDetail"
          component={PathDetailScreen}
          initialParams={routeParams}
        />
        <Stack.Screen name="PathData" component={PathDataScreen} />
        <Stack.Screen name="PublishPath" component={PublishPathScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function renderPathCreateManual() {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PathCreateManual" component={PathCreateManualScreen} />
        <Stack.Screen name="PathDetail" component={PathDetailScreen} />
        <Stack.Screen name="PathList" component={PathListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function renderPublishPath(routeParams) {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PublishPath"
          component={PublishPathScreen}
          initialParams={routeParams}
        />
        <Stack.Screen name="PathList" component={PathListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

describe('E2E Path flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('PathList: loads paths and shows list', async () => {
    const pathsApi = require('../../src/services/pathsApi');
    pathsApi.getPaths.mockResolvedValue([
      { id: '1', name: 'Park route', distance: 5 },
      { id: '2', name: 'Lake loop', distance: 12 },
    ]);

    const { getByText } = renderPathList();
    await waitFor(() => {
      expect(pathsApi.getPaths).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(getByText('Park route')).toBeTruthy();
      expect(getByText('Lake loop')).toBeTruthy();
    });
  });

  it('PathList: shows empty message when no paths', async () => {
    const pathsApi = require('../../src/services/pathsApi');
    pathsApi.getPaths.mockResolvedValue([]);

    const { getByText } = renderPathList();
    await waitFor(() => {
      expect(getByText(/No paths/)).toBeTruthy();
    });
  });

  it('PathList: path press navigates to PathDetail', async () => {
    const pathsApi = require('../../src/services/pathsApi');
    const path = { id: 'p1', name: 'Test path', distance: 10 };
    pathsApi.getPaths.mockResolvedValue([path]);

    const { getByText } = renderPathList();
    await waitFor(() => expect(getByText('Test path')).toBeTruthy());
    fireEvent.press(getByText('Test path'));
    await waitFor(() => {
      expect(getByText('Test path')).toBeTruthy();
      expect(getByText(/Distance: 10 km/)).toBeTruthy();
    });
  });

  it('PathDetail: shows path from route params', async () => {
    const path = { id: 'p1', name: 'My path', distance: 8, difficulty: 'Easy' };
    const { getByText } = renderPathDetail({ pathId: 'p1', path });
    await waitFor(() => {
      expect(getByText('My path')).toBeTruthy();
      expect(getByText(/Difficulty: Easy/)).toBeTruthy();
      expect(getByText(/Distance: 8 km/)).toBeTruthy();
    });
  });

  it('PathDetail: has View path data button and navigates on press', async () => {
    const pathsApi = require('../../src/services/pathsApi');
    const path = { id: 'p1', name: 'Path' };
    pathsApi.getPathById.mockResolvedValue(path);
    const { getByText } = renderPathDetail({ pathId: 'p1', path });
    await waitFor(() => expect(getByText('View path data')).toBeTruthy());
    fireEvent.press(getByText('View path data'));
    await waitFor(
      () => {
        expect(getByText('Path data')).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it.skip('PathDetail: Publish path navigates to PublishPath', async () => {
    const path = { id: 'p1', name: 'Path', startPoint: 'A', endPoint: 'B' };
    const { getByText } = renderPathDetail({ pathId: 'p1', path });
    await waitFor(() => expect(getByText('Publish path')).toBeTruthy());
    fireEvent.press(getByText('Publish path'));
    await waitFor(() => {
      expect(getByText('Publish path')).toBeTruthy();
      expect(getByText(/Complete the details/)).toBeTruthy();
    });
  });

  it('PathCreateManual: submit creates path and calls createPath', async () => {
    const pathsApi = require('../../src/services/pathsApi');
    const MapService = require('../../src/services/map/MapService').default;
    const created = { id: 'new-1', name: 'New route' };
    pathsApi.createPath.mockResolvedValue(created);

    const startFeature = { place_name: 'Start place', geometry: { coordinates: [0, 0] } };
    const endFeature = { place_name: 'End place', geometry: { coordinates: [1, 1] } };
    MapService.searchPlaces.mockResolvedValue([startFeature, endFeature]);

    const { getByText, getByPlaceholderText, getAllByPlaceholderText } = renderPathCreateManual();
    const addressInputs = () => getAllByPlaceholderText('Address or place');

    fireEvent.changeText(getByPlaceholderText('e.g. Park route'), 'New route');

    fireEvent.changeText(addressInputs()[0], 'St');
    await waitFor(() => expect(getByText('Start place')).toBeTruthy());
    fireEvent.press(getByText('Start place'));

    fireEvent.changeText(addressInputs()[1], 'En');
    await waitFor(() => expect(getByText('End place')).toBeTruthy());
    fireEvent.press(getByText('End place'));

    fireEvent.changeText(getByPlaceholderText('e.g. 12.5'), '5');
    fireEvent.press(getByText('Create path'));

    await waitFor(() => {
      expect(pathsApi.createPath).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New route',
          startX: 0,
          startY: 0,
          endX: 1,
          endY: 1,
          distance: 5,
        })
      );
    });
  });

  it('PathCreateManual: shows error when name empty', async () => {
    const { getByText } = renderPathCreateManual();
    fireEvent.press(getByText('Create path'));
    await waitFor(() => {
      expect(getByText('Route name is required.')).toBeTruthy();
    });
  });

  it('PathCreateManual: Cancel button is present', () => {
    const { getByText } = renderPathCreateManual();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('PublishPath: shows form prefilled from route path', () => {
    const path = { name: 'Pre path', description: 'Desc', startPoint: 'S', endPoint: 'E', distance: 5, difficulty: 'Medium' };
    const { getByDisplayValue } = renderPublishPath({ path });
    expect(getByDisplayValue('Pre path')).toBeTruthy();
    expect(getByDisplayValue('Desc')).toBeTruthy();
    expect(getByDisplayValue('S')).toBeTruthy();
    expect(getByDisplayValue('E')).toBeTruthy();
    expect(getByDisplayValue('5')).toBeTruthy();
    expect(getByDisplayValue('Medium')).toBeTruthy();
  });

  it.skip('PublishPath: publish calls createPath and navigates on success', async () => {
    const pathsApi = require('../../src/services/pathsApi');
    pathsApi.createPath.mockResolvedValue({ id: 'pub-1' });

    const { getByText, getByPlaceholderText } = renderPublishPath({
      path: { name: 'To publish' },
    });
    fireEvent.changeText(getByPlaceholderText('Route name'), 'To publish');
    fireEvent.press(getByText(/Publish path/));

    await waitFor(() => {
      expect(pathsApi.createPath).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'To publish' })
      );
    });
    await waitFor(() => {
      expect(getByText('Path published successfully.')).toBeTruthy();
    });
  });

  it('PublishPath: Back to paths navigates to PathList', async () => {
    const pathsApi = require('../../src/services/pathsApi');
    pathsApi.getPaths.mockResolvedValue([]);
    const { getByText } = renderPublishPath({ path: {} });
    fireEvent.press(getByText('Back to paths'));
    await waitFor(() => {
      expect(getByText(/No paths|Loading|Paths/)).toBeTruthy();
    });
  });
});
