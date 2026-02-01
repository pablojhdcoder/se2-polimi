/**
 * ProfileScreen - User profile and settings (DD ch03).
 * User card, options (Profil + Edit, Activity statistics, Notifications), Log out button.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Button, Avatar } from '../../components';
import { useAuth } from '../../navigation/useAuth';
import { getTrips } from '../../services/tripsApi';
import { getOfflineData } from '../../storage';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import { colors } from '../../styles';
import styles from './ProfileScreen.styles';

const METERS_PER_POINT_ESTIMATE = 10;

function estimateDistanceKm(trips) {
  if (!Array.isArray(trips)) return 0;
  const totalM = trips.reduce((acc, t) => acc + (t.track?.length ?? 0) * METERS_PER_POINT_ESTIMATE, 0);
  return Math.round((totalM / 1000) * 10) / 10;
}

const OPTION_ICONS = {
  profile: '⚙',
  pin: '📍',
  bell: '🔔',
  chevron: '›',
};

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [totalDistanceKm, setTotalDistanceKm] = useState(0);
  const [notificationsOn, setNotificationsOn] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const result = await getTrips();
      const list = Array.isArray(result) ? result : result?.data ?? result?.trips ?? [];
      setTotalDistanceKm(estimateDistanceKm(list));
    } catch {
      try {
        const offline = await getOfflineData();
        const trips = offline?.trips ?? [];
        const list = Array.isArray(trips) ? trips : [];
        setTotalDistanceKm(estimateDistanceKm(list));
      } catch {
        setTotalDistanceKm(0);
      }
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const displayName = user?.name?.trim() || STRINGS.USER;
  const displayEmail = user?.email || '—';

  return (
    <ScrollView
      style={layoutStyles.screenContainer}
      contentContainerStyle={styles.profileScreen_content}
    >
      <Text style={styles.profileScreen_sectionTitle}>{STRINGS.PROFILE_AND_SETTINGS}</Text>

      <View style={styles.profileScreen_userCard}>
        <View style={styles.profileScreen_avatarWrap}>
          <Avatar user={user} size={72} />
        </View>
        <View style={styles.profileScreen_userInfo}>
          <Text style={styles.profileScreen_userName}>{displayName}</Text>
          <Text style={styles.profileScreen_userEmail}>{displayEmail}</Text>
        </View>
      </View>

      <View style={styles.profileScreen_optionsCard}>
        <TouchableOpacity
          style={styles.profileScreen_optionRow}
          activeOpacity={0.7}
          onPress={() => {}}
        >
          <Text style={styles.profileScreen_optionIcon}>{OPTION_ICONS.profile}</Text>
          <Text style={styles.profileScreen_optionLabel}>{STRINGS.PROFILE}</Text>
          <Button
            title={STRINGS.EDIT}
            variant="primary"
            onPress={() => {}}
            style={styles.profileScreen_editButton}
            textStyle={styles.profileScreen_editButtonText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.profileScreen_optionRow, styles.profileScreen_optionRowLast]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TripStatistics')}
        >
          <Text style={styles.profileScreen_optionIcon}>{OPTION_ICONS.pin}</Text>
          <Text style={styles.profileScreen_optionLabel}>{STRINGS.ACTIVITY_STATISTICS}</Text>
          <View style={styles.profileScreen_optionRight}>
            <Text style={styles.profileScreen_optionValue}>{totalDistanceKm} {STRINGS.KM}</Text>
            <Text style={styles.profileScreen_chevron}>{OPTION_ICONS.chevron}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.profileScreen_optionsCard}>
        <View style={[styles.profileScreen_optionRow, styles.profileScreen_optionRowLast]}>
          <Text style={styles.profileScreen_optionIcon}>{OPTION_ICONS.bell}</Text>
          <Text style={styles.profileScreen_optionLabel}>{STRINGS.NOTIFICATIONS}</Text>
          <Switch
            value={notificationsOn}
            onValueChange={setNotificationsOn}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
      </View>

      <Button
        title={STRINGS.LOG_OUT}
        onPress={logout}
        variant="primary"
        style={[layoutStyles.buttonSpacing, styles.profileScreen_logOutButton]}
      />
    </ScrollView>
  );
}
