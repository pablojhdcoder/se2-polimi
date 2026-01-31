/**
 * TripDetailScreen - Drill-down view for a single trip (DD ch03 "Past trips").
 * Shows trip info and link to PathDataScreen when trip has pathId.
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../../components';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './TripDetailScreen.styles';

function formatDate(ts) {
  if (ts == null) return '—';
  try {
    const d = new Date(typeof ts === 'number' ? ts : parseInt(ts, 10));
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
  } catch {
    return '—';
  }
}

function formatDuration(startTime, endTime) {
  if (startTime == null || endTime == null) return '—';
  try {
    const start = typeof startTime === 'number' ? startTime : parseInt(startTime, 10);
    const end = typeof endTime === 'number' ? endTime : parseInt(endTime, 10);
    if (isNaN(start) || isNaN(end)) return '—';
    const min = Math.round((end - start) / 60000);
    return `${min} min`;
  } catch {
    return '—';
  }
}

export default function TripDetailScreen({ route, navigation }) {
  const trip = route?.params?.trip ?? {};
  const pathId = trip.pathId ?? trip.path_id;
  const path = trip.path;
  const points = trip.track?.length ?? 0;
  const dateStr = formatDate(trip.startTime ?? trip.start_time);
  const durationStr = formatDuration(trip.startTime ?? trip.start_time, trip.endTime ?? trip.end_time);

  return (
    <ScrollView
      style={layoutStyles.screenContainer}
      contentContainerStyle={styles.tripDetail_content}
    >
      <View style={styles.tripDetail_section}>
        <Text style={styles.tripDetail_label}>{STRINGS.TRIP_DATE}</Text>
        <Text style={styles.tripDetail_value}>{dateStr}</Text>
      </View>
      <View style={styles.tripDetail_section}>
        <Text style={styles.tripDetail_label}>{STRINGS.TRIP_DURATION}</Text>
        <Text style={styles.tripDetail_value}>{durationStr}</Text>
      </View>
      <View style={styles.tripDetail_section}>
        <Text style={styles.tripDetail_label}>{STRINGS.TRIP_POINTS}</Text>
        <Text style={styles.tripDetail_value}>{points}</Text>
      </View>
      {(pathId || path) ? (
        <Button
          title={STRINGS.VIEW_PATH_DATA_FOR_TRIP}
          variant="outline"
          onPress={() => navigation.navigate('PathData', { pathId, path })}
          style={styles.tripDetail_button}
        />
      ) : null}
    </ScrollView>
  );
}
