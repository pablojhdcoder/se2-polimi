/**
 * Client integration tests: PublishPathScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PublishPathScreen from '../../src/pages/PublishPathScreen/PublishPathScreen';

const mockNavigate = jest.fn();

jest.mock('../../src/services/pathsApi', () => ({
  createPath: jest.fn(),
}));

const createPath = require('../../src/services/pathsApi').createPath;

describe('PublishPathScreen', () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and form when no path from route', () => {
    const route = { params: {} };
    const { getByText, getByPlaceholderText, getAllByText } = render(
      <PublishPathScreen route={route} navigation={navigation} />
    );
    expect(getAllByText('Publish path')[0]).toBeTruthy();
    expect(getByPlaceholderText('Route name')).toBeTruthy();
    expect(getAllByText('Publish path').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Back to paths')).toBeTruthy();
  });

  it('pre-fills form when path from route', () => {
    const path = {
      name: 'Pre-filled',
      description: 'Desc',
      startPoint: 'A',
      endPoint: 'B',
      distance: 5,
      difficulty: 'Easy',
    };
    const route = { params: { path } };
    const { getByDisplayValue } = render(
      <PublishPathScreen route={route} navigation={navigation} />
    );
    expect(getByDisplayValue('Pre-filled')).toBeTruthy();
    expect(getByDisplayValue('Desc')).toBeTruthy();
    expect(getByDisplayValue('5')).toBeTruthy();
  });

  it('shows error when name empty on publish', async () => {
    const route = { params: {} };
    const { getByText, getAllByText } = render(
      <PublishPathScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getAllByText('Publish path')[1]);
    await waitFor(() => {
      expect(getByText('Name is required.')).toBeTruthy();
    });
  });

  it('calls createPath and navigates to PathList on success', async () => {
    createPath.mockResolvedValueOnce({});
    const route = { params: { path: { name: 'My Path' } } };
    const { getAllByText } = render(
      <PublishPathScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getAllByText('Publish path')[1]);
    await waitFor(() => {
      expect(createPath).toHaveBeenCalled();
    });
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('PathList');
      },
      { timeout: 2000 }
    );
  });

  it('Back to paths navigates to PathList', () => {
    const route = { params: {} };
    const { getByText } = render(
      <PublishPathScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getByText('Back to paths'));
    expect(mockNavigate).toHaveBeenCalledWith('PathList');
  });
});
