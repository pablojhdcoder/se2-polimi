/**
 * Client integration tests: MergeInfoScreen (UC12).
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MergeInfoScreen from '../../src/pages/MergeInfoScreen/MergeInfoScreen';

const mockGoBack = jest.fn();

describe('MergeInfoScreen', () => {
  const navigation = { goBack: mockGoBack };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and merge info text', () => {
    const route = { params: {} };
    const { getByText } = render(
      <MergeInfoScreen route={route} navigation={navigation} />
    );
    expect(getByText('Merge info (UC12)')).toBeTruthy();
    expect(
      getByText(/This screen shows information about data or path merges/)
    ).toBeTruthy();
    expect(
      getByText(/No specific merge data. Merges are applied in the background/)
    ).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('shows mergeId when provided in params', () => {
    const route = { params: { mergeId: 'merge-123' } };
    const { getByText } = render(
      <MergeInfoScreen route={route} navigation={navigation} />
    );
    expect(getByText('Merge ID: merge-123')).toBeTruthy();
  });

  it('shows mergeData when provided in params', () => {
    const mergeData = { pathId: 'p1', source: 'manual' };
    const route = { params: { mergeData } };
    const { getByText } = render(
      <MergeInfoScreen route={route} navigation={navigation} />
    );
    expect(getByText('Associated data:')).toBeTruthy();
    expect(getByText(JSON.stringify(mergeData, null, 2))).toBeTruthy();
  });

  it('Back button calls goBack', () => {
    const route = { params: {} };
    const { getByText } = render(
      <MergeInfoScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getByText('Back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
