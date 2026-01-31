import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PathCard } from '../../../src/components/paths';

describe('PathCard', () => {
  const mockPath = {
    id: 1,
    name: 'Green Trail',
    description: 'A nice path along the river',
    distance: 12,
    difficulty: 'Easy',
    startPoint: 'Park A',
    endPoint: 'Park B',
  };

  it('renders path name', () => {
    render(<PathCard path={mockPath} onPress={() => {}} />);
    expect(screen.getByText('Green Trail')).toBeTruthy();
  });

  it('renders description snippet', () => {
    render(<PathCard path={mockPath} onPress={() => {}} />);
    expect(screen.getByText('A nice path along the river')).toBeTruthy();
  });

  it('renders distance and difficulty', () => {
    render(<PathCard path={mockPath} onPress={() => {}} />);
    expect(screen.getByText(/12 km/)).toBeTruthy();
    expect(screen.getByText(/Easy/)).toBeTruthy();
  });

  it('renders start and end points', () => {
    render(<PathCard path={mockPath} onPress={() => {}} />);
    expect(screen.getByText(/Park A → Park B/)).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<PathCard path={mockPath} onPress={onPress} />);
    fireEvent.press(screen.getByText('Green Trail'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows "No name" when path has no name', () => {
    render(
      <PathCard path={{ id: 2, name: null }} onPress={() => {}} />
    );
    expect(screen.getByText('No name')).toBeTruthy();
  });

  it('handles minimal path object', () => {
    render(
      <PathCard path={{ id: 3, name: 'Minimal' }} onPress={() => {}} />
    );
    expect(screen.getByText('Minimal')).toBeTruthy();
  });

  it('truncates long description with ellipsis', () => {
    const longDesc = 'a'.repeat(100);
    render(
      <PathCard
        path={{ id: 4, name: 'Long', description: longDesc }}
        onPress={() => {}}
      />
    );
    expect(screen.getByText(/…/)).toBeTruthy();
  });
});
