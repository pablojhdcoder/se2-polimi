import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from '../../src/components';

describe('Input', () => {
  it('renders without label', () => {
    render(
      <Input value="" onChangeText={() => {}} placeholder="Enter text" />
    );
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders with label', () => {
    render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        placeholder="email@example.com"
      />
    );
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('email@example.com')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    render(
      <Input value="" onChangeText={onChangeText} placeholder="Type here" />
    );
    fireEvent.changeText(screen.getByPlaceholderText('Type here'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('displays controlled value', () => {
    render(
      <Input value="initial" onChangeText={() => {}} placeholder="Placeholder" />
    );
    const input = screen.getByPlaceholderText('Placeholder');
    expect(input.props.value).toBe('initial');
  });

  it('shows error message when error prop is set', () => {
    render(
      <Input
        value=""
        onChangeText={() => {}}
        placeholder="Field"
        error="This field is required"
      />
    );
    expect(screen.getByText('This field is required')).toBeTruthy();
  });

  it('does not show error when error is falsy', () => {
    render(
      <Input value="" onChangeText={() => {}} placeholder="Field" />
    );
    expect(screen.queryByText('This field is required')).toBeNull();
  });

  it('supports secureTextEntry for password fields', () => {
    render(
      <Input
        value=""
        onChangeText={() => {}}
        placeholder="Password"
        secureTextEntry
      />
    );
    const input = screen.getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });
});
