/**
 * TripStatisticsScreen - User trip statistics.
 * Shows aggregated stats and list of past trips with drill-down to trip detail.
 * @param {Object} navigation - React Navigation object
 */

import React, { useState, useCallback } from 'react';
import { Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card, ErrorMessage, Button, Loading } from '../../components';
import { getTrips } from '../../services/tripsApi';
import { getOfflineData } from '../../storage';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './TripStatisticsScreen.styles';

function formatTripDate(ts) {
  if (ts == null) return '—';
  try {
    const d = typeof ts === 'number' || typeof ts === 'string' ? new Date(ts) : new Date(Number(ts));
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
  } catch {
    return '—';
  }
}

export default function TripStatisticsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadTrips = useCallback(async () => {
    try {
      setError(null);
      const result = await getTrips();
      const list = result?.data ?? [];
      setTrips(list);
    } catch (err) {
      const offline = await getOfflineData();
      const offlineTrips = offline?.trips ?? [];
      setTrips(Array.isArray(offlineTrips) ? offlineTrips : []);
      setError(err?.message || STRINGS.TRIPS_LOAD_ERROR);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [loadTrips])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTrips();
  }, [loadTrips]);

  const totalTrips = trips.length;
  const totalPoints = trips.reduce((acc, t) => acc + (t.track?.length ?? 0), 0);
  const totalDurationMin = trips.reduce((acc, t) => {
    if (t.startTime && t.endTime) return acc + Math.round((t.endTime - t.startTime) / 60000);
    if (t.tripLength != null) return acc + Number(t.tripLength);
    return acc;
  }, 0);

  const goToPaths = () => {
    navigation.navigate('PathList');
  };

  if (loading) return <Loading message={STRINGS.LOADING_STATISTICS} />;

  return (
    <ScrollView
      style={layoutStyles.screenContainer}
      contentContainerStyle={styles.tripStatisticsScreen_content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.tripStatisticsScreen_title}>{STRINGS.TRIP_STATISTICS_UC10}</Text>
      <ErrorMessage message={error} />
      <Card style={styles.tripStatisticsScreen_card}>
        <Text style={styles.tripStatisticsScreen_statLabel}>{STRINGS.TOTAL_TRIPS}</Text>
        <Text style={styles.tripStatisticsScreen_statValue}>{totalTrips}</Text>
      </Card>
      <Card style={styles.tripStatisticsScreen_card}>
        <Text style={styles.tripStatisticsScreen_statLabel}>{STRINGS.RECORDED_POINTS}</Text>
        <Text style={styles.tripStatisticsScreen_statValue}>{totalPoints}</Text>
      </Card>
      <Card style={styles.tripStatisticsScreen_card}>
        <Text style={styles.tripStatisticsScreen_statLabel}>{STRINGS.TOTAL_TIME_APROX}</Text>
        <Text style={styles.tripStatisticsScreen_statValue}>{totalDurationMin} min</Text>
      </Card>

      <Text style={styles.tripStatisticsScreen_sectionTitle}>{STRINGS.PAST_TRIPS}</Text>
      {trips.map((trip, index) => {
        const dateStr = formatTripDate(trip.startTime ?? trip.start_time ?? trip.trip_date);
        const points = trip.track?.length ?? (trip.recorded_route?.coordinates?.length ?? 0);
        return (
          <TouchableOpacity
            key={trip.id ?? trip._id ?? index}
            style={styles.tripStatisticsScreen_listItem}
            onPress={() => navigation.navigate('TripDetail', { trip })}
            activeOpacity={0.7}
          >
            <Text style={styles.tripStatisticsScreen_listItemDate}>{dateStr}</Text>
            <Text style={styles.tripStatisticsScreen_listItemPoints}>
              {points} {STRINGS.TRIP_POINTS.toLowerCase()}
            </Text>
          </TouchableOpacity>
        );
      })}

      <Button
        title={STRINGS.PATHS}
        variant="primary"
        onPress={goToPaths}
        style={styles.tripStatisticsScreen_button}
      />
    </ScrollView>
  );
}
