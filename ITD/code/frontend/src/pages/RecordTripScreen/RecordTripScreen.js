/**
 * "Start a trip" screen: full-screen map, compact bottom card only.
 * Integrates Trip Detection Engine and Obstacle Detection.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TripDetectionEngine, TripState } from '../../sensors/trip-detection';
import ObstacleDetectionModule from '../../sensors/obstacle-detection';
import { MapboxMap } from '../../components';
import { STRINGS } from '../../constants/strings';
import { colors } from '../../styles';
import styles from './RecordTripScreen.styles';

const STATE_LABELS = {
  [TripState.IDLE]: STRINGS.IDLE,
  [TripState.DETECTING]: STRINGS.DETECTING,
  [TripState.IN_TRIP]: STRINGS.IN_TRIP,
  [TripState.STOPPING]: STRINGS.STOPPING,
};

export default function RecordTripScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [tripState, setTripState] = useState(TripDetectionEngine.getState());
  const [isStarting, setIsStarting] = useState(false);
  const [tripDurationMs, setTripDurationMs] = useState(0);
  const [obstacleEvents, setObstacleEvents] = useState([]);
  const [_durationTimer, setDurationTimer] = useState(null);
  const obstacleEventsRef = useRef([]);

  useEffect(() => {
    obstacleEventsRef.current = obstacleEvents;
  }, [obstacleEvents]);

  const refreshState = useCallback(() => {
    setTripState(TripDetectionEngine.getState());
    setTripDurationMs(TripDetectionEngine.getCurrentTripDurationMs());
  }, []);

  useEffect(() => {
    const onStateChangeCb = () => refreshState();
    const onTripStartCb = () => {
      refreshState();
      setObstacleEvents((prev) => [...prev, { type: 'trip_start', time: Date.now() }]);
    };
    const onTripEndCb = (data) => {
      refreshState();
      setObstacleEvents((prev) => [
        ...prev,
        { type: 'trip_end', time: Date.now(), durationMs: data?.durationMs },
      ]);
      if (data?.track?.length && navigation?.navigate) {
        const obstacles = obstacleEventsRef.current.filter(
          (e) => e.type === 'bump' || e.type === 'rotation_spike'
        );
        navigation.navigate('ReviewDetectedPath', {
          track: data.track,
          startTime: data.startTime,
          endTime: data.endTime,
          obstacles,
        });
      }
    };

    TripDetectionEngine.onStateChange(onStateChangeCb);
    TripDetectionEngine.onTripStart(onTripStartCb);
    TripDetectionEngine.onTripEnd(onTripEndCb);

    const obstacleListener = (event) => {
      setObstacleEvents((prev) => [
        ...prev.slice(-49),
        { type: event.type, severity: event.severity, time: event.timestamp },
      ]);
    };
    ObstacleDetectionModule.addObstacleListener(obstacleListener);

    return () => {
      TripDetectionEngine.removeOnStateChange(onStateChangeCb);
      TripDetectionEngine.removeOnTripStart(onTripStartCb);
      TripDetectionEngine.removeOnTripEnd(onTripEndCb);
      ObstacleDetectionModule.removeObstacleListener(obstacleListener);
    };
  }, [refreshState, navigation]);

  useEffect(() => {
    if (tripState === TripState.IN_TRIP) {
      const id = setInterval(() => {
        setTripDurationMs(TripDetectionEngine.getCurrentTripDurationMs());
      }, 1000);
      setDurationTimer(id);
      return () => clearInterval(id);
    }
    setDurationTimer(null);
  }, [tripState]);

  const navigateToReview = (tripData, obstacles) => {
    if (tripData?.track?.length && navigation?.navigate) {
      navigation.navigate('ReviewDetectedPath', {
        track: tripData.track,
        startTime: tripData.startTime,
        endTime: tripData.endTime,
        obstacles: obstacles || [],
      });
    }
  };

  const handleStartStop = async () => {
    if (tripState !== TripState.IDLE) {
      const tripData = TripDetectionEngine.stop();
      ObstacleDetectionModule.stop();
      refreshState();
      const obstacles = obstacleEvents.filter(
        (e) => e.type === 'bump' || e.type === 'rotation_spike'
      );
      navigateToReview(tripData, obstacles);
      return;
    }

    setIsStarting(true);
    try {
      await TripDetectionEngine.start();
      await ObstacleDetectionModule.start();
      refreshState();
    } catch (err) {
      Alert.alert('Error', err?.message || STRINGS.ERROR_START_DETECTION);
      refreshState();
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopTripManually = () => {
    const tripData = TripDetectionEngine.stopTripManually();
    ObstacleDetectionModule.stop();
    refreshState();
    const obstacles = obstacleEvents.filter(
      (e) => e.type === 'bump' || e.type === 'rotation_spike'
    );
    navigateToReview(tripData, obstacles);
  };

  const formatDuration = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const formatDurationMins = (ms) => {
    const mins = Math.floor(ms / 60000);
    return mins <= 0 ? '0 mins' : `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  const isActive = tripState !== TripState.IDLE;

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapboxMap style={StyleSheet.absoluteFillObject} showUserLocation />

      {/* Compact bottom card: title, state/duration, Start Ride, Trip opinions */}
      <View
        style={[
          styles.bottomCard,
          {
            bottom: insets.bottom + 24,
          },
        ]}
      >
        <Text style={styles.bottomCardTitle}>{STRINGS.RECORD_TRIP}</Text>
        <View style={styles.bottomCardMeta}>
          <Text
            style={[
              styles.bottomCardState,
              isActive && styles.bottomCardStateActive,
            ]}
          >
            {STATE_LABELS[tripState] ?? tripState}
          </Text>
          {tripState === TripState.IN_TRIP && (
            <Text style={styles.bottomCardDuration}>
              {formatDurationMins(tripDurationMs)}
            </Text>
          )}
        </View>

        <View style={styles.bottomCardActions}>
          <TouchableOpacity
            style={[
              styles.bottomCardButton,
              isActive ? styles.bottomCardButtonStop : styles.bottomCardButtonPrimary,
              isStarting && styles.bottomCardButtonDisabled,
            ]}
            onPress={handleStartStop}
            disabled={isStarting}
          >
            {isStarting ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Text style={styles.bottomCardButtonText}>
                  {isActive ? STRINGS.STOP_DETECTION : STRINGS.START_RIDE}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomCardButton, styles.bottomCardButtonSecondary]}
            onPress={
              isActive ? handleStopTripManually : () => navigation?.navigate?.('Ratings')
            }
          >
            <Text style={styles.bottomCardButtonTextSecondary}>
              {isActive ? STRINGS.END_TRIP_NOW : STRINGS.TRIP_OPINIONS.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
