import React from 'react';
import { View, Text } from 'react-native';
import { Button, Card } from '../../components';
import { useAuth } from '../../navigation/useAuth';
import { layoutStyles, colors } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './HomeScreen.styles';

/**
 * Home screen. Shows welcome and access to Login/Register
 * or main menu depending on auth state (decided by the navigator).
 * @param {Object} navigation - React Navigation object
 * @param {boolean} isAuthenticated - Whether the user is logged in
 * @param {Object} user - Current user object (email, name, etc.)
 */
export default function HomeScreen({ navigation, isAuthenticated, user }) {
  const { logout } = useAuth();

  if (isAuthenticated) {
    return (
      <View style={layoutStyles.screenContainer}>
        <View style={[layoutStyles.screenPadding, styles.homeScreen_center]}>
          <Card style={layoutStyles.cardPadding}>
            <Text style={layoutStyles.title}>Best Bike Paths</Text>
            <Text style={[layoutStyles.subtitle, styles.homeScreen_subtitleMargin, { color: colors.text }]}>
              {STRINGS.HELLO_USER} {user?.email || user?.name || STRINGS.USER}
            </Text>
            <Text style={layoutStyles.subtitle}>
              {STRINGS.AUTHENTICATED_MESSAGE}
            </Text>
            <Button
              title={STRINGS.LOG_OUT}
              onPress={logout}
              variant="outline"
              style={layoutStyles.buttonSpacing}
            />
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View style={layoutStyles.screenContainer}>
      <View style={[layoutStyles.screenPadding, styles.homeScreen_center]}>
        <Card style={layoutStyles.cardPadding}>
          <Text style={layoutStyles.title}>Best Bike Paths</Text>
          <Text style={layoutStyles.subtitle}>
            {STRINGS.FIND_PATHS_MESSAGE}
          </Text>
          <Button
            title={STRINGS.LOG_IN}
            onPress={() => navigation.navigate('Login')}
            style={layoutStyles.buttonSpacing}
          />
          <Button
            title={STRINGS.REGISTER}
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            style={layoutStyles.buttonSpacing}
          />
        </Card>
      </View>
    </View>
  );
}
