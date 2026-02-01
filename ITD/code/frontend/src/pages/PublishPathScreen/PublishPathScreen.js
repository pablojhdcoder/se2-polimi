/**
 * PublishPathScreen - Publish path (send created path to server to share).
 * Accepts route.params.path (and optionally track, startTime, endTime from ReviewDetectedPath)
 * and route.params.obstacles for pre-fill and correct-then-publish flow.
 * @param {Object} route - React Navigation route (params: path, obstacles?)
 * @param {Object} navigation - React Navigation object
 */

import React, { useState, useMemo } from 'react';
import { Text, ScrollView } from 'react-native';
import { Button, Card, Input, ErrorMessage, Loading } from '../../components';
import { createPath } from '../../services/pathsApi';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './PublishPathScreen.styles';

function deriveFromTrack(pathFromRoute) {
  const track = pathFromRoute?.track;
  if (!track?.length) return {};
  const first = track[0];
  const last = track[track.length - 1];
  return {
    startPoint: pathFromRoute.startPoint || (first && `Start (${first.lat?.toFixed(5)}, ${first.lng?.toFixed(5)})`) || '',
    endPoint: pathFromRoute.endPoint || (last && `End (${last.lat?.toFixed(5)}, ${last.lng?.toFixed(5)})`) || '',
  };
}

export default function PublishPathScreen({ route, navigation }) {
  const pathFromRoute = route?.params?.path;
  const obstaclesFromRoute = route?.params?.obstacles ?? [];
  const derived = useMemo(() => deriveFromTrack(pathFromRoute), [pathFromRoute]);
  const [name, setName] = useState(pathFromRoute?.name ?? '');
  const [description, setDescription] = useState(pathFromRoute?.description ?? '');
  const [startPoint, setStartPoint] = useState(pathFromRoute?.startPoint ?? derived.startPoint ?? '');
  const [endPoint, setEndPoint] = useState(pathFromRoute?.endPoint ?? derived.endPoint ?? '');
  const [distance, setDistance] = useState(pathFromRoute?.distance != null ? String(pathFromRoute.distance) : '');
  const [difficulty, setDifficulty] = useState(pathFromRoute?.difficulty ?? '');
  const [obstacles] = useState(obstaclesFromRoute);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handlePublish() {
    setError(null);
    if (!name.trim()) {
      setError(STRINGS.NAME_REQUIRED);
      return;
    }
    setLoading(true);
    try {
      await createPath({
        name: name.trim(),
        description: description.trim() || undefined,
        startPoint: startPoint.trim() || undefined,
        endPoint: endPoint.trim() || undefined,
        distance: distance ? parseFloat(distance) : undefined,
        difficulty: difficulty.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigation.navigate('PathList'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || STRINGS.ERROR_CREATING_PATH);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={layoutStyles.screenContainer} contentContainerStyle={styles.publishPathScreen_content}>
      <Card style={styles.publishPathScreen_card}>
        <Text style={styles.publishPathScreen_title}>{STRINGS.PUBLISH_PATH_UC5}</Text>
        <Text style={styles.publishPathScreen_subtitle}>{STRINGS.COMPLETE_AND_PUBLISH}</Text>
        {obstacles.length > 0 && (
          <Text style={styles.publishPathScreen_subtitle}>
            {obstacles.length} {STRINGS.OBSTACLES_COUNT} from recorded trip.
          </Text>
        )}
        <ErrorMessage message={error} />
        {success ? (
          <Text style={styles.publishPathScreen_success}>{STRINGS.PATH_PUBLISHED}</Text>
        ) : (
          <>
            <Input
              label={`${STRINGS.ROUTE_NAME} *`}
              value={name}
              onChangeText={setName}
              placeholder={STRINGS.ROUTE_NAME}
              style={styles.publishPathScreen_input}
            />
            <Input
              label={STRINGS.DESCRIPTION}
              value={description}
              onChangeText={setDescription}
              placeholder={STRINGS.OPTIONAL_DESC}
              style={styles.publishPathScreen_input}
            />
            <Input
              label={STRINGS.START_POINT}
              value={startPoint}
              onChangeText={setStartPoint}
              placeholder={STRINGS.START_PLACEHOLDER}
              style={styles.publishPathScreen_input}
            />
            <Input
              label={STRINGS.END_POINT}
              value={endPoint}
              onChangeText={setEndPoint}
              placeholder={STRINGS.END_PLACEHOLDER}
              style={styles.publishPathScreen_input}
            />
            <Input
              label={STRINGS.DISTANCE_KM}
              value={distance}
              onChangeText={setDistance}
              placeholder={STRINGS.DISTANCE_PLACEHOLDER}
              keyboardType="decimal-pad"
              style={styles.publishPathScreen_input}
            />
            <Input
              label={STRINGS.DIFFICULTY}
              value={difficulty}
              onChangeText={setDifficulty}
              placeholder={STRINGS.DIFFICULTY_PLACEHOLDER}
              style={styles.publishPathScreen_input}
            />
            {loading ? (
              <Loading message={STRINGS.PUBLISHING} />
            ) : (
              <Button title={STRINGS.PUBLISH_PATH} onPress={handlePublish} style={styles.publishPathScreen_button} />
            )}
          </>
        )}
      </Card>
      <Button
        title={STRINGS.BACK_TO_PATHS}
        variant="outline"
        onPress={() => navigation.navigate('PathList')}
        style={styles.publishPathScreen_backButton}
      />
    </ScrollView>
  );
}
