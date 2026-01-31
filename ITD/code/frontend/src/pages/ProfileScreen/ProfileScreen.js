/**
 * ProfileScreen - User profile and settings (DD ch03).
 * Shows statistics, account data, preferences and notifications.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Button } from '../../components';
import { useAuth } from '../../navigation/useAuth';
import { getTrips } from '../../services/tripsApi';
import { getOfflineData } from '../../storage';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './ProfileScreen.styles';

// Approximate meters per point for rough distance (simplified; real impl could use haversine).
const METERS_PER_POINT_ESTIMATE = 10;

function estimateDistanceKm(trips) {
  if (!Array.isArray(trips)) return 0;
  const totalM = trips.reduce((acc, t) => acc + (t.track?.length ?? 0) * METERS_PER_POINT_ESTIMATE, 0);
  return Math.round((totalM / 1000) * 10) / 10;
}

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [totalDistanceKm, setTotalDistanceKm] = useState(0);
  const [totalTripsCount, setTotalTripsCount] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      const result = await getTrips();
      const list = Array.isArray(result) ? result : result?.data ?? result?.trips ?? [];
      setTotalTripsCount(list.length);
      setTotalDistanceKm(estimateDistanceKm(list));
    } catch {
      try {
        const offline = await getOfflineData();
        const trips = offline?.trips ?? [];
        const list = Array.isArray(trips) ? trips : [];
        setTotalTripsCount(list.length);
        setTotalDistanceKm(estimateDistanceKm(list));
      } catch {
        setTotalTripsCount(0);
        setTotalDistanceKm(0);
      }
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <ScrollView
      style={layoutStyles.screenContainer}
      contentContainerStyle={styles.profileScreen_content}
    >
      <View style={styles.profileScreen_section}>
        <Text style={styles.profileScreen_sectionTitle}>{STRINGS.ACTIVITY_SUMMARY}</Text>
        <Card style={styles.profileScreen_card}>
          <View style={styles.profileScreen_statRow}>
            <Text style={styles.profileScreen_statLabel}>{STRINGS.TOTAL_DISTANCE}</Text>
            <Text style={styles.profileScreen_statValue}>{totalDistanceKm} {STRINGS.KM}</Text>
          </View>
          <View style={styles.profileScreen_statRow}>
            <Text style={styles.profileScreen_statLabel}>{STRINGS.TOTAL_TRIPS_COUNT}</Text>
            <Text style={styles.profileScreen_statValue}>{totalTripsCount}</Text>
          </View>
          <Button
            title={STRINGS.VIEW_PAST_TRIPS}
            variant="outline"
            onPress={() => navigation.navigate('TripStatistics')}
            style={styles.profileScreen_button}
          />
        </Card>
      </View>

      <View style={styles.profileScreen_section}>
        <Text style={styles.profileScreen_sectionTitle}>{STRINGS.ACCOUNT}</Text>
        <Card style={styles.profileScreen_card}>
          <View style={styles.profileScreen_accountRow}>
            <Text style={styles.profileScreen_accountLabel}>{STRINGS.EMAIL}</Text>
            <Text style={styles.profileScreen_accountValue}>{user?.email || '—'}</Text>
          </View>
          {user?.name ? (
            <View style={styles.profileScreen_accountRow}>
              <Text style={styles.profileScreen_accountLabel}>{STRINGS.YOUR_NAME}</Text>
              <Text style={styles.profileScreen_accountValue}>{user.name}</Text>
            </View>
          ) : null}
        </Card>
      </View>

      <View style={styles.profileScreen_section}>
        <Text style={styles.profileScreen_sectionTitle}>{STRINGS.PREFERENCES}</Text>
        <Card style={styles.profileScreen_card}>
          <Text style={styles.profileScreen_accountLabel}>{STRINGS.NOTIFICATIONS}</Text>
          <Text style={styles.profileScreen_accountValue}>{STRINGS.NOTIFICATIONS_DESCRIPTION}</Text>
        </Card>
      </View>

      <Button
        title={STRINGS.LOG_OUT}
        onPress={logout}
        variant="outline"
        style={styles.profileScreen_button}
      />
    </ScrollView>
  );
}
