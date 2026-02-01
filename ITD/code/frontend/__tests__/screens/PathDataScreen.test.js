/**
 * Client integration tests: PathDataScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PathDataScreen from '../../src/pages/PathDataScreen/PathDataScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('../../src/services/pathsApi', () => ({
  getPathById: jest.fn(),
}));

const getPathById = require('../../src/services/pathsApi').getPathById;

const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  getParent: () => ({ getParent: () => null }),
};

describe('PathDataScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows error and buttons when no pathId and no path in route', async () => {
    const route = { params: {} };
    const { getByText } = render(
      <PathDataScreen route={route} navigation={navigation} />
    );
    await waitFor(() => {
      expect(
        getByText('Select a path from the list to view its data.')
      ).toBeTruthy();
    });
    expect(getByText('Go to paths')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('uses path from route when provided', () => {
    const path = {
      id: '1',
      name: 'Data Path',
      description: 'Desc',
      startPoint: 'Start',
      endPoint: 'End',
      distance: 8,
      difficulty: 'Medium',
    };
    const route = { params: { pathId: '1', path } };
    const { getByText } = render(
      <PathDataScreen route={route} navigation={navigation} />
    );
    expect(getByText('Path data')).toBeTruthy();
    expect(getByText('Data Path')).toBeTruthy();
    expect(getByText('Desc')).toBeTruthy();
    expect(getByText('Start')).toBeTruthy();
    expect(getByText('End')).toBeTruthy();
    expect(getByText('8 km')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('View reviews for this path')).toBeTruthy();
  });

  it('fetches path when pathId given and no path in route', async () => {
    const path = { id: '2', name: 'Fetched Path' };
    getPathById.mockResolvedValueOnce(path);
    const route = { params: { pathId: '2' } };
    const { getByText } = render(
      <PathDataScreen route={route} navigation={navigation} />
    );
    await waitFor(() => {
      expect(getPathById).toHaveBeenCalledWith('2');
    });
    expect(getByText('Fetched Path')).toBeTruthy();
  });

  it('View reviews navigates to Reviews with pathId', () => {
    const path = { id: '1', name: 'P' };
    const route = { params: { pathId: '1', path } };
    const { getByText } = render(
      <PathDataScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getByText('View reviews for this path'));
    expect(mockNavigate).toHaveBeenCalledWith('Reviews', { pathId: '1' });
  });

  it('Back calls goBack', () => {
    const route = { params: { path: { name: 'P' } } };
    const { getByText } = render(
      <PathDataScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getByText('Back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
