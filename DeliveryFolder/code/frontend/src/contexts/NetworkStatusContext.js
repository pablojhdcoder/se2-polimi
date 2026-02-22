import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setNetworkStatusCallbacks } from '../services/api';
import { processSyncQueue } from '../services/syncQueueProcessor';
import { getSyncQueue } from '../storage';

const NetworkStatusContext = createContext(null);

const POLL_SYNC_INTERVAL_MS = 5000;

/**
 * Provider that keeps network state (online/offline), last network error,
 * and count of pending sync operations.
 * Registers callbacks in api.js so interceptors update isOnline and lastError.
 * When connected and queue is pending, processes the queue periodically.
 */
export function NetworkStatusProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastError, setLastError] = useState('');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const refreshPendingSync = useCallback(async () => {
    try {
      const queue = await getSyncQueue();
      setPendingSyncCount(queue.length);
    } catch {
      setPendingSyncCount(0);
    }
  }, []);

  useEffect(() => {
    setNetworkStatusCallbacks({
      setOffline: () => setIsOnline(false),
      setOnline: () => setIsOnline(true),
      setError: (msg) => setLastError(msg || ''),
    });
    return () => setNetworkStatusCallbacks(null);
  }, []);

  useEffect(() => {
    const run = async () => {
      await refreshPendingSync();
      try {
        const queue = await getSyncQueue();
        if (queue.length > 0) {
          await processSyncQueue();
          await refreshPendingSync();
        }
      } catch {
        // ignore
      }
    };
    run();
    const interval = setInterval(run, POLL_SYNC_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshPendingSync]);

  const clearError = useCallback(() => setLastError(''), []);

  const value = {
    isOnline,
    lastError,
    clearError,
    pendingSyncCount,
    refreshPendingSync,
  };

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  const ctx = useContext(NetworkStatusContext);
  if (!ctx) {
    throw new Error('useNetworkStatus must be used within NetworkStatusProvider');
  }
  return ctx;
}
