import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ErrorMessage } from '../../src/components';

describe('ErrorMessage', () => {
  it('returns null when message is empty', () => {
    const { toJSON } = render(<ErrorMessage message="" />);
    expect(toJSON()).toBeNull();
  });

  it('returns null when message is not provided', () => {
    const { toJSON } = render(<ErrorMessage />);
    expect(toJSON()).toBeNull();
  });

  it('renders message when provided', () => {
    render(<ErrorMessage message="Invalid credentials" />);
    expect(screen.getByText('Invalid credentials')).toBeTruthy();
  });

  it('renders different error messages', () => {
    const { rerender, getByText } = render(
      <ErrorMessage message="First error" />
    );
    expect(getByText('First error')).toBeTruthy();
    rerender(<ErrorMessage message="Second error" />);
    expect(getByText('Second error')).toBeTruthy();
  });
});
