import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { OfflineBanner } from '../../src/components';

describe('OfflineBanner', () => {
  it('returns null when visible is false', () => {
    const { toJSON } = render(<OfflineBanner visible={false} />);
    expect(toJSON()).toBeNull();
  });

  it('renders banner text when visible is true', () => {
    render(<OfflineBanner visible />);
    expect(
      screen.getByText('No connection. Data will sync when back online.')
    ).toBeTruthy();
  });

  it('shows correct message when visible', () => {
    render(<OfflineBanner visible={true} />);
    expect(
      screen.getByText('No connection. Data will sync when back online.')
    ).toBeTruthy();
  });
});
