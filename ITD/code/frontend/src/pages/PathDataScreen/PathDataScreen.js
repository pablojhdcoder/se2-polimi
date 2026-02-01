/**
 * PathDataScreen - View path data (statistics, points, etc.).
 * @param {Object} route - React Navigation route (params: pathId, path)
 * @param {Object} navigation - React Navigation object
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Loading, ErrorMessage, Button } from '../../components';
import { getPathById } from '../../services/pathsApi';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './PathDataScreen.styles';

export default function PathDataScreen({ route, navigation }) {
  const pathId = route?.params?.pathId;
  const pathFromRoute = route?.params?.path;
  const [path, setPath] = useState(pathFromRoute ?? null);
  const [loading, setLoading] = useState(!pathFromRoute && !!pathId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pathId || pathFromRoute) {
      if (pathFromRoute) setPath(pathFromRoute);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const data = await getPathById(pathId);
        if (!cancelled) setPath(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || STRINGS.ERROR_LOADING_PATH);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [pathId, pathFromRoute]);

  if (loading) return <Loading message="Loading path data…" />;
  if ((error && !path) || (!pathId && !path)) {
    return (
      <View style={[layoutStyles.screenContainer, styles.pathDataScreen_content]}>
        <ErrorMessage message={error || STRINGS.SELECT_PATH_FOR_DATA} />
        <Button title={STRINGS.GO_TO_PATHS} variant="outline" onPress={() => navigation.navigate('PathList')} style={styles.pathDataScreen_back} />
        <Button title={STRINGS.BACK} variant="outline" onPress={() => navigation.goBack()} style={styles.pathDataScreen_back} />
      </View>
    );
  }

  return (
    <ScrollView style={layoutStyles.screenContainer} contentContainerStyle={styles.pathDataScreen_content}>
      <Text style={styles.pathDataScreen_title}>{STRINGS.PATH_DATA_UC9}</Text>
      <Card style={styles.pathDataScreen_card}>
        <Text style={styles.pathDataScreen_pathName}>{path?.name || STRINGS.NO_NAME}</Text>
        {path?.description ? (
          <Text style={styles.pathDataScreen_description}>{path.description}</Text>
        ) : null}
        <View style={styles.pathDataScreen_row}>
          <Text style={styles.pathDataScreen_label}>{STRINGS.START}:</Text>
          <Text style={styles.pathDataScreen_value}>{path?.startPoint || '—'}</Text>
        </View>
        <View style={styles.pathDataScreen_row}>
          <Text style={styles.pathDataScreen_label}>{STRINGS.END}:</Text>
          <Text style={styles.pathDataScreen_value}>{path?.endPoint || '—'}</Text>
        </View>
        {path?.distance != null && (
          <View style={styles.pathDataScreen_row}>
            <Text style={styles.pathDataScreen_label}>{STRINGS.DISTANCE}:</Text>
            <Text style={styles.pathDataScreen_value}>{path.distance} km</Text>
          </View>
        )}
        {path?.difficulty && (
          <View style={styles.pathDataScreen_row}>
            <Text style={styles.pathDataScreen_label}>{STRINGS.DIFFICULTY}:</Text>
            <Text style={styles.pathDataScreen_value}>{path.difficulty}</Text>
          </View>
        )}
      </Card>
      <Button
        title={STRINGS.VIEW_REVIEWS}
        variant="outline"
        onPress={() => {
          const root = navigation.getParent?.()?.getParent?.();
          if (root) root.navigate('Reviews', { pathId: path?.id });
          else navigation.navigate('Reviews', { pathId: path?.id });
        }}
        style={styles.pathDataScreen_button}
      />
      <Button title={STRINGS.BACK} variant="outline" onPress={() => navigation.goBack()} style={styles.pathDataScreen_back} />
    </ScrollView>
  );
}
