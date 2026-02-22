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

/**
 * Derives display and numeric fields from path track for API payload.
 * Backend requires start_x, start_y, end_x, end_y, length NOT NULL.
 * When track is missing, returns default coords (0,0) and length 0 so INSERT can succeed.
 */
function deriveFromTrack(pathFromRoute) {
  const track = pathFromRoute?.track;
  const first = track?.[0];
  const last = track?.length ? track[track.length - 1] : null;
  const startPoint = pathFromRoute?.startPoint || (first && `Start (${first.lat?.toFixed(5)}, ${first.lng?.toFixed(5)})`) || '';
  const endPoint = pathFromRoute?.endPoint || (last && `End (${last.lat?.toFixed(5)}, ${last.lng?.toFixed(5)})`) || '';
  let length = pathFromRoute?.distance ?? pathFromRoute?.length;
  if (length == null && track?.length > 1) {
    let sum = 0;
    for (let i = 1; i < track.length; i++) {
      const a = track[i - 1];
      const b = track[i];
      if (a?.lat != null && a?.lng != null && b?.lat != null && b?.lng != null) {
        sum += Math.sqrt(Math.pow(b.lat - a.lat, 2) + Math.pow(b.lng - a.lng, 2));
      }
    }
    length = sum * 111; // rough km (degrees to km approx)
  }
  return {
    startPoint,
    endPoint,
    startX: first?.lng ?? 0,
    startY: first?.lat ?? 0,
    endX: last?.lng ?? 0,
    endY: last?.lat ?? 0,
    length: typeof length === 'number' ? length : (typeof length === 'string' ? parseFloat(length) : 0) || 0,
    routeData: pathFromRoute?.routeData ?? (track?.length ? { type: 'LineString', coordinates: track.map((p) => [p.lng, p.lat]).filter((c) => c[0] != null && c[1] != null) } : null),
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
    const distNum = distance ? parseFloat(distance) : undefined;
    const lengthVal = derived.length != null && derived.length > 0 ? derived.length : (distNum != null && !Number.isNaN(distNum) ? distNum : 0);
    setLoading(true);
    try {
      await createPath({
        name: name.trim(),
        description: description.trim() || undefined,
        startPoint: startPoint.trim() || undefined,
        endPoint: endPoint.trim() || undefined,
        distance: distNum,
        length: lengthVal,
        difficulty: difficulty.trim() || undefined,
        startX: derived.startX,
        startY: derived.startY,
        endX: derived.endX,
        endY: derived.endY,
        routeData: derived.routeData || undefined,
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
