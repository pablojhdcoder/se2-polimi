import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PathList } from '../../../src/components/paths';

describe('PathList', () => {
  const mockPaths = [
    { id: 1, name: 'Path One', description: 'First path' },
    { id: 2, name: 'Path Two', description: 'Second path' },
  ];

  it('shows loading message when loading is true', () => {
    render(
      <PathList paths={mockPaths} onPathPress={() => {}} loading />
    );
    expect(screen.getByText('Loading paths…')).toBeTruthy();
  });

  it('shows empty message when paths is empty', () => {
    render(
      <PathList paths={[]} onPathPress={() => {}} />
    );
    expect(screen.getByText('No paths')).toBeTruthy();
  });

  it('shows custom empty message when provided', () => {
    render(
      <PathList
        paths={[]}
        onPathPress={() => {}}
        emptyMessage="No paths found"
      />
    );
    expect(screen.getByText('No paths found')).toBeTruthy();
  });

  it('shows empty message when paths is null', () => {
    render(
      <PathList paths={null} onPathPress={() => {}} />
    );
    expect(screen.getByText('No paths')).toBeTruthy();
  });

  it('renders path items when paths provided and not loading', () => {
    render(
      <PathList paths={mockPaths} onPathPress={() => {}} />
    );
    expect(screen.getByText('Path One')).toBeTruthy();
    expect(screen.getByText('Path Two')).toBeTruthy();
  });

  it('calls onPathPress with path when a path card is pressed', () => {
    const onPathPress = jest.fn();
    render(
      <PathList paths={mockPaths} onPathPress={onPathPress} />
    );
    fireEvent.press(screen.getByText('Path One'));
    expect(onPathPress).toHaveBeenCalledTimes(1);
    expect(onPathPress).toHaveBeenCalledWith(mockPaths[0]);
  });

  it('does not throw when onPathPress is omitted', () => {
    render(<PathList paths={mockPaths} />);
    expect(screen.getByText('Path One')).toBeTruthy();
    fireEvent.press(screen.getByText('Path One'));
  });
});
