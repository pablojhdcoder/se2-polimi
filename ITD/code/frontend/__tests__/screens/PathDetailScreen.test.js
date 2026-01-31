/**
 * Client integration tests: PathDetailScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PathDetailScreen from '../../src/pages/PathDetailScreen/PathDetailScreen';

const mockNavigate = jest.fn();

jest.mock('../../src/services/pathsApi', () => ({
  getPathById: jest.fn(),
}));

const getPathById = require('../../src/services/pathsApi').getPathById;

describe('PathDetailScreen', () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "Path not specified" when no pathId and no initial path', () => {
    const route = { params: {} };
    const { getByText } = render(
      <PathDetailScreen route={route} navigation={navigation} />
    );
    expect(getByText('Path not specified')).toBeTruthy();
  });

  it('uses initial path from route and shows path data', () => {
    const path = { id: '1', name: 'Greenway', difficulty: 'Easy', distance: 10 };
    const route = { params: { pathId: '1', path } };
    const { getByText } = render(
      <PathDetailScreen route={route} navigation={navigation} />
    );
    expect(getByText('Greenway')).toBeTruthy();
    expect(getByText(/Difficulty: Easy/)).toBeTruthy();
    expect(getByText(/Distance: 10 km/)).toBeTruthy();
  });

  it('fetches path when pathId given and no initial path', async () => {
    const path = { id: '2', name: 'Hills' };
    getPathById.mockResolvedValueOnce(path);
    const route = { params: { pathId: '2' } };
    const { getByText } = render(
      <PathDetailScreen route={route} navigation={navigation} />
    );
    await waitFor(() => {
      expect(getPathById).toHaveBeenCalledWith('2');
    });
    expect(getByText('Hills')).toBeTruthy();
  });

  it('shows error and Retry when fetch fails and no initial path', async () => {
    getPathById.mockRejectedValueOnce(new Error('Not found'));
    const route = { params: { pathId: '99' } };
    const { getByText } = render(
      <PathDetailScreen route={route} navigation={navigation} />
    );
    await waitFor(() => {
      expect(getByText('Not found')).toBeTruthy();
    });
    expect(getByText('Retry')).toBeTruthy();
  });

  it('View path data button navigates to PathData', () => {
    const path = { id: '1', name: 'P' };
    const route = { params: { pathId: '1', path } };
    const { getByText } = render(
      <PathDetailScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getByText('View path data (UC9)'));
    expect(mockNavigate).toHaveBeenCalledWith('PathData', {
      pathId: '1',
      path,
    });
  });

  it('Publish path button navigates to PublishPath', () => {
    const path = { id: '1', name: 'P' };
    const route = { params: { pathId: '1', path } };
    const { getByText } = render(
      <PathDetailScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getByText('Publish path (UC5)'));
    expect(mockNavigate).toHaveBeenCalledWith('PublishPath', { path });
  });
});
