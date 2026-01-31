/**
 * E2E-style client tests: Sync and offline scenarios.
 * OfflineBanner, PendingSyncBanner, queue behaviour with mocked storage/API.
 */

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { OfflineBanner, PendingSyncBanner } from '../../src/components';
import { NetworkStatusProvider, useNetworkStatus } from '../../src/contexts/NetworkStatusContext';

jest.mock('../../src/services/api', () => ({
  __esModule: true,
  default: { request: jest.fn() },
  setNetworkStatusCallbacks: jest.fn(() => () => {}),
}));

jest.mock('../../src/services/syncQueueProcessor', () => ({
  processSyncQueue: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../src/storage', () => ({
  getSyncQueue: jest.fn(() => Promise.resolve([])),
}));

function TestConsumer({ renderBanners }) {
  const { isOnline, pendingSyncCount } = useNetworkStatus();
  if (!renderBanners) return null;
  return (
    <>
      <OfflineBanner visible={!isOnline} />
      <PendingSyncBanner visible={pendingSyncCount > 0} count={pendingSyncCount} />
      <Text testID="consumer-mounted">mounted</Text>
    </>
  );
}

describe('E2E Sync / Offline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const storage = require('../../src/storage');
    storage.getSyncQueue.mockResolvedValue([]);
  });

  it('OfflineBanner is hidden when visible is false', () => {
    const { queryByText } = render(<OfflineBanner visible={false} />);
    expect(queryByText(/No connection/)).toBeNull();
  });

  it('OfflineBanner shows message when visible is true', () => {
    const { getByText } = render(<OfflineBanner visible={true} />);
    expect(getByText('No connection. Data will sync when back online.')).toBeTruthy();
  });

  it('PendingSyncBanner is hidden when visible is false', () => {
    const { queryByText } = render(<PendingSyncBanner visible={false} count={0} />);
    expect(queryByText(/pending/)).toBeNull();
  });

  it('PendingSyncBanner shows generic message when visible and no count', () => {
    const { getByText } = render(<PendingSyncBanner visible={true} />);
    expect(getByText(/Data pending sync/)).toBeTruthy();
  });

  it('PendingSyncBanner shows count when visible and count > 0', () => {
    const { getByText } = render(<PendingSyncBanner visible={true} count={3} />);
    expect(getByText(/3 pending item\(s\) to sync/)).toBeTruthy();
  });

  it('NetworkStatusProvider provides isOnline and pendingSyncCount', async () => {
    const { getByText } = render(
      <NetworkStatusProvider>
        <TestConsumer renderBanners />
      </NetworkStatusProvider>
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(getByText('mounted')).toBeTruthy();
  });

  it('when getSyncQueue returns items, pendingSyncCount is updated', async () => {
    const storage = require('../../src/storage');
    storage.getSyncQueue.mockResolvedValue([
      { id: '1', method: 'POST', url: '/trips', body: {} },
    ]);

    const { getByText } = render(
      <NetworkStatusProvider>
        <TestConsumer renderBanners />
      </NetworkStatusProvider>
    );
    await new Promise((r) => setTimeout(r, 150));
    expect(getByText(/1 pending item\(s\) to sync/)).toBeTruthy();
  });
});
