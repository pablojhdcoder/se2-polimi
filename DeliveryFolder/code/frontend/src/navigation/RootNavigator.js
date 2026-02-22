import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from './useAuth';
import { Loading } from '../components';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

const RootStack = createStackNavigator();

/**
 * Root navigator: shows Auth stack when no token, Main stack when token exists.
 * While loading state from AsyncStorage, shows Loading.
 */
export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Loading…" />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthStack} />
      ) : (
        <RootStack.Screen name="Main" component={MainStack} />
      )}
    </RootStack.Navigator>
  );
}
