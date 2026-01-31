/**
 * Minimal "Record trip" screen (Agent 3 flow).
 * Integrates Trip Detection Engine and Obstacle Detection Module.
 * Uses theme and STRINGS (RECORD_TRIP, EVENTS_TRIP_OBSTACLES, etc.).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TripDetectionEngine, TripState } from '../../sensors/trip-detection';
import ObstacleDetectionModule from '../../sensors/obstacle-detection';
import { layoutStyles } from '../../styles';
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
  const [tripState, setTripState] = useState(TripDetectionEngine.getState());
  const [isStarting, setIsStarting] = useState(false);
  const [tripDurationMs, setTripDurationMs] = useState(0);
  const [obstacleEvents, setObstacleEvents] = useState([]);
  const [durationTimer, setDurationTimer] = useState(null);
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

  const isActive = tripState !== TripState.IDLE;

  const eventLabel = (ev) => {
    if (ev.type === 'trip_start') return STRINGS.TRIP_STARTED;
    if (ev.type === 'trip_end') return `${STRINGS.TRIP_ENDED}${ev.durationMs ? ` (${formatDuration(ev.durationMs)})` : ''}`;
    if (ev.type === 'bump') return `${STRINGS.OBSTACLE_BUMP} ${(ev.severity * 100).toFixed(0)}%`;
    if (ev.type === 'rotation_spike') return `${STRINGS.SHARP_TURN} ${(ev.severity * 100).toFixed(0)}%`;
    return ev.type;
  };

  return (
    <View style={layoutStyles.screenContainer}>
      <View style={styles.recordTripScreen_inner}>
        <View style={styles.recordTripScreen_header}>
          <Text style={styles.recordTripScreen_title}>{STRINGS.RECORD_TRIP}</Text>
          <Text style={styles.recordTripScreen_subtitle}>{STRINGS.TRIP_DETECTION_OBSTACLE}</Text>
        </View>

        <View style={styles.recordTripScreen_stateCard}>
          <Text style={styles.recordTripScreen_stateLabel}>{STRINGS.STATE}</Text>
          <Text style={[styles.recordTripScreen_stateValue, isActive && styles.recordTripScreen_stateValueActive]}>
            {STATE_LABELS[tripState] ?? tripState}
          </Text>
          {tripState === TripState.IN_TRIP && (
            <Text style={styles.recordTripScreen_duration}>
              {STRINGS.DURATION}: {formatDuration(tripDurationMs)}
            </Text>
          )}
        </View>

        <View style={styles.recordTripScreen_actions}>
          <TouchableOpacity
            style={[
              styles.recordTripScreen_button,
              isActive ? styles.recordTripScreen_buttonStop : styles.recordTripScreen_buttonStart,
              isStarting && styles.recordTripScreen_buttonDisabled,
            ]}
            onPress={handleStartStop}
            disabled={isStarting}
          >
            {isStarting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.recordTripScreen_buttonText}>
                {isActive ? STRINGS.STOP_DETECTION : STRINGS.START_DETECTION}
              </Text>
            )}
          </TouchableOpacity>

          {tripState === TripState.IN_TRIP && (
            <TouchableOpacity
              style={[styles.recordTripScreen_button, styles.recordTripScreen_buttonSecondary]}
              onPress={handleStopTripManually}
            >
              <Text style={styles.recordTripScreen_buttonTextSecondary}>{STRINGS.END_TRIP_NOW}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.recordTripScreen_eventsSection}>
          <Text style={styles.recordTripScreen_eventsTitle}>{STRINGS.EVENTS_TRIP_OBSTACLES}</Text>
          <ScrollView
            style={styles.recordTripScreen_eventsList}
            contentContainerStyle={styles.recordTripScreen_eventsListContent}
          >
            {obstacleEvents.length === 0 ? (
              <Text style={styles.recordTripScreen_eventsEmpty}>{STRINGS.NO_EVENTS_YET}</Text>
            ) : (
              obstacleEvents.slice().reverse().map((ev, i) => (
                <View key={`${ev.time}-${i}`} style={styles.recordTripScreen_eventRow}>
                  <Text style={styles.recordTripScreen_eventTime}>
                    {new Date(ev.time).toLocaleTimeString()}
                  </Text>
                  <Text style={styles.recordTripScreen_eventType}>{eventLabel(ev)}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
