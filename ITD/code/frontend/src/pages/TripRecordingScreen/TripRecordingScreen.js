/**
 * TripRecordingScreen - UC8: Record trip using Trip Detection.
 * UC4: After recording ends, automatic trip insertion (API or offline queue).
 * Uses theme and STRINGS.
 * @param {Object} navigation - React Navigation object
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import TripDetectionEngine, {
  STATE_IDLE,
  STATE_RECORDING,
  STATE_TRIP_STARTED,
  STATE_TRIP_ENDED,
} from '../../sensors/trip-detection';
import { Button, Card, ErrorMessage } from '../../components';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './TripRecordingScreen.styles';

const STATE_LABELS = {
  [STATE_IDLE]: STRINGS.WAITING,
  [STATE_RECORDING]: STRINGS.RECORDING,
  [STATE_TRIP_STARTED]: STRINGS.TRIP_IN_PROGRESS,
  [STATE_TRIP_ENDED]: STRINGS.TRIP_FINISHED,
};

export default function TripRecordingScreen({ navigation }) {
  const [state, setState] = useState(TripDetectionEngine.getState());
  const [trackLength, setTrackLength] = useState(0);
  const [error, setError] = useState(null);

  const refreshState = useCallback(() => {
    setState(TripDetectionEngine.getState());
    const data = TripDetectionEngine.getCurrentTripData();
    setTrackLength(data.track?.length ?? 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshState, 1000);
    return () => clearInterval(interval);
  }, [refreshState]);

  useEffect(() => {
    const onEnd = (tripData) => {
      refreshState();
      if (tripData?.track?.length && navigation?.navigate) {
        navigation.navigate('ReviewDetectedPath', {
          track: tripData.track,
          startTime: tripData.startTime,
          endTime: tripData.endTime,
          obstacles: [],
        });
      }
    };
    TripDetectionEngine.onTripEnd(onEnd);
    return () => {
      TripDetectionEngine.removeOnTripEnd(onEnd);
    };
  }, [refreshState, navigation]);

  async function handleStart() {
    setError(null);
    try {
      await TripDetectionEngine.startRecording();
      refreshState();
    } catch (e) {
      setError(e?.message || STRINGS.ERROR_SAVE_TRIP);
    }
  }

  function handleStop() {
    const tripData = TripDetectionEngine.stopRecording();
    refreshState();
    if (tripData?.track?.length && navigation?.navigate) {
      navigation.navigate('ReviewDetectedPath', {
        track: tripData.track,
        startTime: tripData.startTime,
        endTime: tripData.endTime,
        obstacles: [],
      });
    }
  }

  return (
    <ScrollView style={layoutStyles.screenContainer} contentContainerStyle={styles.tripRecordingScreen_content}>
      <Card style={styles.tripRecordingScreen_card}>
        <Text style={styles.tripRecordingScreen_title}>{STRINGS.RECORD_TRIP_UC8}</Text>
        <Text style={styles.tripRecordingScreen_stateLabel}>{STATE_LABELS[state] || state}</Text>
        <Text style={styles.tripRecordingScreen_trackInfo}>{STRINGS.POINTS_ON_ROUTE} {trackLength}</Text>
        <ErrorMessage message={error} />
        <View style={styles.tripRecordingScreen_buttons}>
          {(state === STATE_IDLE || state === STATE_TRIP_ENDED) && (
            <Button title={STRINGS.START_RECORDING} onPress={handleStart} style={styles.tripRecordingScreen_button} />
          )}
          {(state === STATE_RECORDING || state === STATE_TRIP_STARTED) && (
            <Button
              title={STRINGS.END_TRIP_NOW}
              onPress={handleStop}
              variant="secondary"
              style={styles.tripRecordingScreen_button}
            />
          )}
        </View>
      </Card>
      <Button
        title={STRINGS.VIEW_TRIP_STATISTICS}
        variant="outline"
        onPress={() => navigation.getParent?.()?.navigate('PastTrips')}
        style={styles.tripRecordingScreen_linkButton}
      />
    </ScrollView>
  );
}
