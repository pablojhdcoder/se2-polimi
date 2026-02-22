import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  HomeScreen,
  ProfileScreen,
  PathListScreen,
  PathDetailScreen,
  PathSearchScreen,
  PathCreateManualScreen,
  PublishPathScreen,
  ReviewsScreen,
  ReviewDetailScreen,
  TripStatisticsScreen,
  TripDetailScreen,
} from '../pages';
import { theme } from '../styles';
import { STRINGS } from '../constants/strings';
import { Avatar } from '../components';
import MainTabs from './MainTabs';
import { useAuth } from './useAuth';

const Stack = createStackNavigator();
const { colors, fontSizes, fontWeights } = theme;

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: fontWeights.bold, fontSize: fontSizes.title },
  headerTitleAlign: 'center',
};

function HeaderRight({ navigation, user }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
      <Avatar user={user} onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}

/**
 * Main stack when user is authenticated.
 * Initial: MainTabs (Map, Ratings, Create path, Past trips). Paths and Home in stack.
 */
function MainStackNavigator() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={({ navigation }) => ({
          title: 'Best Bike Paths',
          headerRight: () => <HeaderRight navigation={navigation} user={user} />,
        })}
      />
      <Stack.Screen
        name="Home"
        options={({ navigation }) => ({
          title: 'Best Bike Paths',
          headerRight: () => <HeaderRight navigation={navigation} user={user} />,
        })}
      >
        {(props) => (
          <HomeScreen
            {...props}
            isAuthenticated={isAuthenticated}
            user={user}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: STRINGS.PROFILE }}
      />
      <Stack.Screen
        name="PathList"
        component={PathListScreen}
        options={({ navigation }) => ({
          title: STRINGS.PATHS,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 12 }}>
              <TouchableOpacity onPress={() => navigation.navigate('PathCreateManual')}>
                <Text style={{ color: colors.primary, fontSize: fontSizes.body, fontWeight: fontWeights.semibold }}>
                  {STRINGS.NEW_PATH}
                </Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="PathDetail"
        component={PathDetailScreen}
        options={{ title: STRINGS.PATH_DETAIL }}
      />
      <Stack.Screen
        name="PathSearch"
        component={PathSearchScreen}
        options={{ title: STRINGS.SEARCH_PATHS }}
      />
      <Stack.Screen
        name="PathCreateManual"
        component={PathCreateManualScreen}
        options={{ title: STRINGS.CREATE_PATH_MANUALLY }}
      />
      <Stack.Screen
        name="PublishPath"
        component={PublishPathScreen}
        options={{ title: STRINGS.PUBLISH_PATH_UC5 }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ title: STRINGS.REVIEWS }}
      />
      <Stack.Screen
        name="ReviewDetail"
        component={ReviewDetailScreen}
        options={{ title: STRINGS.REVIEW_DETAIL }}
      />
      <Stack.Screen
        name="TripStatistics"
        component={TripStatisticsScreen}
        options={{ title: STRINGS.TRIP_STATISTICS_UC10 }}
      />
      <Stack.Screen
        name="TripDetail"
        component={TripDetailScreen}
        options={{ title: STRINGS.TRIP_DETAIL }}
      />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
