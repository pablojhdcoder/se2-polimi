import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Loading } from '../../src/components';

describe('Loading', () => {
  it('renders without message', () => {
    const { toJSON } = render(<Loading />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with message', () => {
    render(<Loading message="Loading paths…" />);
    expect(screen.getByText('Loading paths…')).toBeTruthy();
  });

  it('does not show message when message prop is omitted', () => {
    const { queryByText } = render(<Loading />);
    expect(queryByText('Loading paths…')).toBeNull();
  });
});
