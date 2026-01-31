import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PendingSyncBanner } from '../../src/components';

describe('PendingSyncBanner', () => {
  it('returns null when visible is false', () => {
    const { toJSON } = render(<PendingSyncBanner visible={false} />);
    expect(toJSON()).toBeNull();
  });

  it('renders default message when visible and no count', () => {
    render(<PendingSyncBanner visible />);
    expect(
      screen.getByText(
        'Data pending sync. It will be sent when connection is available.'
      )
    ).toBeTruthy();
  });

  it('renders message with count when count > 0', () => {
    render(<PendingSyncBanner visible count={3} />);
    expect(
      screen.getByText(
        '3 pending item(s) to sync. They will be sent when connection is available.'
      )
    ).toBeTruthy();
  });

  it('renders default message when count is 0', () => {
    render(<PendingSyncBanner visible count={0} />);
    expect(
      screen.getByText(
        'Data pending sync. It will be sent when connection is available.'
      )
    ).toBeTruthy();
  });
});
