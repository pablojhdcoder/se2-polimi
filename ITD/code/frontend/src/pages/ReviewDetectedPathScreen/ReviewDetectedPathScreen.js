/**
 * ReviewDetectedPathScreen - UC4, F4.4–F4.7: Review detected path and obstacles after trip.
 * Shows track summary and obstacle list; user can remove false positives, then Discard / Store locally / Publish.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, Card, ErrorMessage, Loading } from '../../components';
import { createTrip, updateTripRoute } from '../../services/tripsApi';
import { addToSyncQueue } from '../../storage/syncQueue';
import { getOfflineData, setOfflineDataKey } from '../../storage/storageService';
import { layoutStyles, colors } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './ReviewDetectedPathScreen.styles';

function obstacleLabel(obstacle) {
  const t = obstacle.type;
  const sev = obstacle.severity != null ? (obstacle.severity * 100).toFixed(0) : '';
  if (t === 'bump') return `${STRINGS.OBSTACLE_BUMP} ${sev}%`;
  if (t === 'rotation_spike') return `${STRINGS.SHARP_TURN} ${sev}%`;
  return t || 'Obstacle';
}

export default function ReviewDetectedPathScreen({ route, navigation }) {
  const params = route?.params ?? {};
  const track = params.track ?? [];
  const startTime = params.startTime ?? null;
  const endTime = params.endTime ?? null;
  const initialObstacles = params.obstacles ?? [];

  const obstaclesWithId = useMemo(() => {
    return initialObstacles
      .filter((o) => o.type === 'bump' || o.type === 'rotation_spike')
      .map((o, i) => ({ ...o, id: o.id ?? `obs_${(o.time ?? o.timestamp ?? i)}_${i}` }));
  }, [initialObstacles]);

  const [visibleObstacles, setVisibleObstacles] = useState(obstaclesWithId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeObstacle = (id) => {
    setVisibleObstacles((prev) => prev.filter((o) => o.id !== id));
  };

  const tripPayload = () => ({
    track,
    startTime,
    endTime,
    obstacles: visibleObstacles.map(({ id: _id, ...rest }) => rest),
  });

  const pathForPublish = () => ({
    track,
    startTime,
    endTime,
    obstacles: visibleObstacles,
  });

  const handleDiscard = () => {
    Alert.alert(
      STRINGS.DISCARD_CONFIRM,
      STRINGS.DISCARD_CONFIRM_MESSAGE,
      [
        { text: STRINGS.CANCEL, style: 'cancel' },
        { text: STRINGS.DISCARD, style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleStoreLocally = () => {
    Alert.alert(
      STRINGS.STORE_LOCALLY_CONFIRM,
      STRINGS.STORE_LOCALLY_CONFIRM_MESSAGE,
      [
        { text: STRINGS.CANCEL, style: 'cancel' },
        {
          text: STRINGS.STORE_LOCALLY,
          onPress: async () => {
            if (!track?.length) {
              setError('No track to save.');
              return;
            }
            setLoading(true);
            setError(null);
            const payload = tripPayload();
            try {
              const trip = await createTrip({ pathId: null, sensorData: {} });
              if (trip?.id) {
                await updateTripRoute(trip.id, {
                  track,
                  isFinal: true,
                  potholes: visibleObstacles
                  .map((o) => ({ lat: o.latitude ?? o.lat, lng: o.longitude ?? o.lng }))
                  .filter((p) => p.lat != null && p.lng != null),
                });
              }
              navigation.goBack();
            } catch (err) {
              try {
                await addToSyncQueue({ method: 'POST', url: '/trips/automatic', body: { pathId: null, sensorData: {} } });
                const offline = await getOfflineData();
                const trips = Array.isArray(offline.trips) ? offline.trips : [];
                trips.push({ ...payload, id: `local_${Date.now()}`, pendingSync: true });
                await setOfflineDataKey('trips', trips);
                navigation.goBack();
              } catch (e) {
                setError(e?.message || STRINGS.ERROR_SAVE_TRIP);
              }
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handlePublish = () => {
    navigation.navigate('PublishPath', { path: pathForPublish(), obstacles: visibleObstacles });
  };

  const pointCount = track?.length ?? 0;
  const obstacleCount = visibleObstacles.length;

  return (
    <ScrollView style={layoutStyles.screenContainer} contentContainerStyle={styles.reviewScreen_content}>
      <Card style={styles.reviewScreen_card}>
        <Text style={styles.reviewScreen_title}>{STRINGS.REVIEW_DETECTED_PATH}</Text>
        <Text style={styles.reviewScreen_description}>{STRINGS.REVIEW_DETECTED_PATH_DESCRIPTION}</Text>

        <Text style={styles.reviewScreen_sectionTitle}>{STRINGS.DETECTED_PATH}</Text>
        <Text style={styles.reviewScreen_pointsInfo}>
          {STRINGS.POINTS_RECORDED}: {pointCount}
        </Text>

        <Text style={styles.reviewScreen_sectionTitle}>{STRINGS.DETECTED_OBSTACLES}</Text>
        {obstacleCount === 0 ? (
          <Text style={styles.reviewScreen_pointsInfo}>{STRINGS.NO_OBSTACLES_DETECTED}</Text>
        ) : (
          <View style={styles.reviewScreen_obstacleList}>
            {visibleObstacles.map((obstacle) => (
              <View key={obstacle.id} style={styles.reviewScreen_obstacleRow}>
                <Text style={styles.reviewScreen_obstacleText} numberOfLines={1}>
                  {obstacleLabel(obstacle)}
                  {obstacle.time != null && (
                    <Text style={{ color: colors.textSecondary }}>
                      {' '}
                      {new Date(obstacle.time).toLocaleTimeString()}
                    </Text>
                  )}
                </Text>
                <TouchableOpacity
                  style={styles.reviewScreen_obstacleRemove}
                  onPress={() => removeObstacle(obstacle.id)}
                  accessibilityLabel={STRINGS.REMOVE_OBSTACLE}
                >
                  <Text style={styles.reviewScreen_removeButtonText}>{STRINGS.REMOVE_OBSTACLE}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <ErrorMessage message={error} />
        {loading ? (
          <Loading message={STRINGS.SAVING_TRIP} />
        ) : (
          <View style={styles.reviewScreen_buttons}>
            <Button
              title={STRINGS.DISCARD}
              variant="secondary"
              onPress={handleDiscard}
              style={styles.reviewScreen_button}
            />
            <Button
              title={STRINGS.STORE_LOCALLY}
              variant="outline"
              onPress={handleStoreLocally}
              style={styles.reviewScreen_button}
              disabled={pointCount === 0}
            />
            <Button
              title={STRINGS.PUBLISH}
              onPress={handlePublish}
              style={styles.reviewScreen_button}
              disabled={pointCount === 0}
            />
          </View>
        )}
      </Card>
    </ScrollView>
  );
}
