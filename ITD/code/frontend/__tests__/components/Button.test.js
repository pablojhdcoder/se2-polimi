import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components';

describe('Button', () => {
  it('renders with title', () => {
    render(<Button title="Submit" onPress={() => {}} />);
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Click me" onPress={onPress} />);
    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    render(<Button title="Loading" onPress={onPress} loading />);
    fireEvent.press(screen.getByText('Loading'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows title with primary variant by default', () => {
    render(<Button title="Primary" onPress={() => {}} />);
    expect(screen.getByText('Primary')).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    render(<Button title="Secondary" onPress={() => {}} variant="secondary" />);
    expect(screen.getByText('Secondary')).toBeTruthy();
  });

  it('renders with outline variant', () => {
    render(<Button title="Outline" onPress={() => {}} variant="outline" />);
    expect(screen.getByText('Outline')).toBeTruthy();
  });

  it('shows loading state with title visible', () => {
    render(<Button title="Saving" onPress={() => {}} loading />);
    expect(screen.getByText('Saving')).toBeTruthy();
  });
});
