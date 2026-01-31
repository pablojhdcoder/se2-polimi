import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, LoginScreen, RegisterScreen } from '../pages';
import { theme } from '../styles';
import { STRINGS } from '../constants/strings';

const Stack = createStackNavigator();
const { colors, fontSizes, fontWeights } = theme;

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: fontWeights.bold, fontSize: fontSizes.title },
  headerTitleAlign: 'center',
};

/**
 * Auth stack: Home (landing), Login, Register.
 * Shown when there is no token (unauthenticated user).
 */
export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Best Bike Paths' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: STRINGS.LOG_IN }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: STRINGS.REGISTER }}
      />
    </Stack.Navigator>
  );
}
