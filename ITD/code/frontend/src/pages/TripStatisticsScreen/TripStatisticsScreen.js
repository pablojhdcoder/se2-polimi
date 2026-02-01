/**
 * TripStatisticsScreen - UC10: User trip statistics.
 * Shows aggregated stats and list of past trips with drill-down to trip detail.
 * @param {Object} navigation - React Navigation object
 */

import React, { useState, useCallback } from 'react';
import { Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, ErrorMessage, Button, Loading } from '../../components';
import { getTrips } from '../../services/tripsApi';
import { getOfflineData } from '../../storage';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './TripStatisticsScreen.styles';

function formatTripDate(ts) {
  if (ts == null) return '—';
  try {
    const d = new Date(typeof ts === 'number' ? ts : parseInt(ts, 10));
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
      const list = Array.isArray(result) ? result : result?.data ?? result?.trips ?? [];
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

  React.useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTrips();
  }, [loadTrips]);

  const totalTrips = trips.length;
  const totalPoints = trips.reduce((acc, t) => acc + (t.track?.length ?? 0), 0);
  const totalDuration = trips.reduce((acc, t) => {
    if (t.startTime && t.endTime) return acc + (t.endTime - t.startTime);
    return acc;
  }, 0);
  const totalDurationMin = Math.round(totalDuration / 60000);

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
      {trips.length === 0 ? (
        <Text style={styles.tripStatisticsScreen_emptyText}>{STRINGS.NO_TRIPS_YET}</Text>
      ) : (
        trips.map((trip, index) => {
          const dateStr = formatTripDate(trip.startTime ?? trip.start_time);
          const points = trip.track?.length ?? 0;
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
        })
      )}

      <Button
        title={STRINGS.PATHS}
        variant="outline"
        onPress={goToPaths}
        style={styles.tripStatisticsScreen_button}
      />
    </ScrollView>
  );
}
