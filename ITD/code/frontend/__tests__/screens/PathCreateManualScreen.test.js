/**
 * Client integration tests: PathCreateManualScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PathCreateManualScreen from '../../src/pages/PathCreateManualScreen/PathCreateManualScreen';

const _mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('../../src/services/pathsApi', () => ({
  createPath: jest.fn(),
}));
jest.mock('../../src/services/map/MapService', () => ({
  default: {
    searchPlaces: jest.fn().mockResolvedValue([]),
    getCurrentLocation: jest.fn(),
    reverseGeocode: jest.fn(),
    getDirections: jest.fn(),
    formatRecordedRoute: jest.fn(),
  },
}));
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn((title, message, buttons) => {
    if (buttons && buttons[0] && buttons[0].onPress) buttons[0].onPress();
  });
  return RN;
});

const createPath = require('../../src/services/pathsApi').createPath;

describe('PathCreateManualScreen', () => {
  const navigation = { navigate: jest.fn(), goBack: mockGoBack, replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with route name, start/end, distance, difficulty, description', () => {
    const { getByPlaceholderText, getAllByPlaceholderText, getByText } = render(
      <PathCreateManualScreen navigation={navigation} />
    );
    expect(getByPlaceholderText('e.g. Park route')).toBeTruthy();
    expect(getAllByPlaceholderText('Address or place').length).toBe(2);
    expect(getByPlaceholderText('e.g. 12.5')).toBeTruthy();
    expect(getByText('Easy')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('Hard')).toBeTruthy();
    expect(getByText('Create path')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('shows error when name is empty on submit', async () => {
    const { getByText } = render(
      <PathCreateManualScreen navigation={navigation} />
    );
    fireEvent.press(getByText('Create path'));
    await waitFor(() => {
      expect(getByText('Route name is required.')).toBeTruthy();
    });
  });

  it('calls createPath and shows alert on success', async () => {
    const created = { id: 'new1', name: 'My Route' };
    createPath.mockResolvedValueOnce(created);

    const { getByPlaceholderText, getByText } = render(
      <PathCreateManualScreen navigation={navigation} />
    );
    fireEvent.changeText(getByPlaceholderText('e.g. Park route'), 'My Route');
    fireEvent.press(getByText('Create path'));

    await waitFor(() => {
      expect(createPath).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'My Route' })
      );
    });
    expect(navigation.replace).toHaveBeenCalled();
  });

  it('Cancel calls goBack', () => {
    const { getByText } = render(
      <PathCreateManualScreen navigation={navigation} />
    );
    fireEvent.press(getByText('Cancel'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
