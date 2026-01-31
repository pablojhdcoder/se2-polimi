import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/navigation/AuthContext';
import { RootNavigator } from './src/navigation';
import { NetworkStatusProvider, useNetworkStatus } from './src/contexts/NetworkStatusContext';
import OfflineBanner from './src/components/OfflineBanner/OfflineBanner';
import PendingSyncBanner from './src/components/PendingSyncBanner/PendingSyncBanner';

function AppBanners() {
  const { isOnline, pendingSyncCount } = useNetworkStatus();
  return (
    <>
      <OfflineBanner visible={!isOnline} />
      <PendingSyncBanner visible={pendingSyncCount > 0} count={pendingSyncCount} />
    </>
  );
}

function AppContent() {
  return (
    <View style={{ flex: 1 }}>
      <AppBanners />
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

/**
 * App BBP: E2E flows with Auth (Login/Register) and Main (Home, paths, recording, reviews, statistics, etc.).
 * All screens are registered in MainStack and AuthStack.
 * NetworkStatusProvider enables offline/pending-sync banners at root.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NetworkStatusProvider>
          <AppContent />
        </NetworkStatusProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
