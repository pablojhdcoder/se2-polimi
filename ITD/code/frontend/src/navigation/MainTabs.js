/**
 * Bottom tab navigator per DD: Ratings (star), Start trip (bike), Past trips (calendar).
 * Uses theme colors and active state.
 */

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../styles';
import {
  MapScreen,
  PathCreateManualScreen,
  ReviewsScreen,
  ReviewDetailScreen,
  RecordTripScreen,
  TripStatisticsScreen,
  MergeInfoScreen,
} from '../pages';

const Tab = createBottomTabNavigator();
const { colors, fontSizes } = theme;

function RatingsStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="ReviewDetail" component={ReviewDetailScreen} />
    </Stack.Navigator>
  );
}

function StartTripStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TripRecording" component={RecordTripScreen} />
    </Stack.Navigator>
  );
}

function PastTripsStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TripStatistics" component={TripStatisticsScreen} />
      <Stack.Screen name="MergeInfo" component={MergeInfoScreen} />
    </Stack.Navigator>
  );
}

function MapStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="PathCreateManual" component={PathCreateManualScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ name, focused }) {
  const icons = { Map: '🗺️', Ratings: '★', StartTrip: '🚴', PastTrips: '📅' };
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.icon, focused && styles.iconActive]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: fontSizes.small, fontWeight: '600' },
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{ tabBarLabel: 'Map' }}
      />
      <Tab.Screen
        name="Ratings"
        component={RatingsStack}
        options={{ tabBarLabel: 'Ratings' }}
      />
      <Tab.Screen
        name="StartTrip"
        component={StartTripStack}
        options={{ tabBarLabel: 'Start trip' }}
      />
      <Tab.Screen
        name="PastTrips"
        component={PastTripsStack}
        options={{ tabBarLabel: 'Past trips' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, color: colors.textSecondary },
  iconActive: { color: colors.primary },
});
