import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { getPathById, getCachedPathById } from '../../services/pathsApi';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { Button } from '../../components';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './PathDetailScreen.styles';

/**
 * Path detail screen. Shows path info and actions (view data, publish).
 * When offline, reads from OFFLINE_DATA cache and shows cached indicator.
 * @param {Object} route - React Navigation route (params: pathId, path)
 * @param {Object} navigation - React Navigation object
 */
export default function PathDetailScreen({ route, navigation }) {
  const { isOnline } = useNetworkStatus();
  const { pathId, path: initialPath } = route.params || {};
  const [path, setPath] = useState(initialPath || null);
  const [loading, setLoading] = useState(!initialPath);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  const loadPath = useCallback(async () => {
    if (!pathId) {
      setPath(initialPath);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setIsCached(false);
      if (!isOnline) {
        const cached = await getCachedPathById(pathId);
        if (cached) {
          setPath(typeof cached === 'object' && cached.path ? cached.path : cached);
          setIsCached(true);
        } else {
          setError(STRINGS.ERROR_LOADING_PATH);
          if (initialPath) setPath(initialPath);
        }
      } else {
        const data = await getPathById(pathId);
        setPath(typeof data === 'object' && data.path ? data.path : data);
      }
    } catch (err) {
      setError(err.message || STRINGS.ERROR_LOADING_PATH);
      if (initialPath) setPath(initialPath);
    } finally {
      setLoading(false);
    }
  }, [pathId, initialPath, isOnline]);

  React.useEffect(() => {
    if (pathId != null || initialPath) loadPath();
    else setLoading(false);
  }, [pathId, initialPath, loadPath]);

  if (!pathId && !initialPath) {
    return (
      <View style={styles.pathDetailScreen_centered}>
        <Text style={styles.pathDetailScreen_message}>{STRINGS.PATH_NOT_SPECIFIED}</Text>
      </View>
    );
  }

  if (loading && !path) {
    return (
      <View style={styles.pathDetailScreen_centered}>
        <Text style={styles.pathDetailScreen_message}>{STRINGS.LOADING_PATH}</Text>
      </View>
    );
  }

  if (error && !path) {
    return (
      <View style={styles.pathDetailScreen_centered}>
        <Text style={styles.pathDetailScreen_errorText}>{error}</Text>
        <TouchableOpacity style={styles.pathDetailScreen_retryButton} onPress={() => { setLoading(true); loadPath(); }}>
          <Text style={styles.pathDetailScreen_retryText}>{STRINGS.RETRY}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const p = path || {};
  return (
    <ScrollView style={layoutStyles.screenContainer} contentContainerStyle={styles.pathDetailScreen_content}>
      {isCached ? (
        <View style={styles.pathDetailScreen_cachedBanner}>
          <Text style={styles.pathDetailScreen_cachedText}>{STRINGS.SHOWING_CACHED_PATH}</Text>
        </View>
      ) : null}
      <View style={styles.pathDetailScreen_section}>
        <Text style={styles.pathDetailScreen_title}>{p.name || STRINGS.NO_NAME}</Text>
        {p.difficulty ? (
          <Text style={styles.pathDetailScreen_difficulty}>{STRINGS.DIFFICULTY}: {p.difficulty}</Text>
        ) : null}
        {p.distance != null ? (
          <Text style={styles.pathDetailScreen_distance}>{STRINGS.DISTANCE}: {p.distance} km</Text>
        ) : null}
      </View>
      {(p.startPoint || p.endPoint) ? (
        <View style={styles.pathDetailScreen_section}>
          <Text style={styles.pathDetailScreen_sectionTitle}>{STRINGS.ROUTE}</Text>
          <Text style={styles.pathDetailScreen_points}>
            {STRINGS.START}: {p.startPoint || '—'}{'\n'}
            {STRINGS.END}: {p.endPoint || '—'}
          </Text>
        </View>
      ) : null}
      {p.description ? (
        <View style={styles.pathDetailScreen_section}>
          <Text style={styles.pathDetailScreen_sectionTitle}>{STRINGS.DESCRIPTION}</Text>
          <Text style={styles.pathDetailScreen_description}>{p.description}</Text>
        </View>
      ) : null}
      {p.waypoints && Array.isArray(p.waypoints) && p.waypoints.length > 0 ? (
        <View style={styles.pathDetailScreen_section}>
          <Text style={styles.pathDetailScreen_sectionTitle}>{STRINGS.WAYPOINTS}</Text>
          {p.waypoints.map((wp, i) => (
            <Text key={i} style={styles.pathDetailScreen_waypoint}>
              {i + 1}. {typeof wp === 'string' ? wp : (wp.name || wp.address || JSON.stringify(wp))}
            </Text>
          ))}
        </View>
      ) : null}
      <View style={styles.pathDetailScreen_actions}>
        <Button
          title={STRINGS.VIEW_PATH_DATA}
          variant="outline"
          onPress={() => navigation.navigate('PathData', { pathId: pathId || p.id, path: p })}
          style={styles.pathDetailScreen_actionButton}
        />
        <Button
          title={STRINGS.PUBLISH_PATH}
          variant="outline"
          onPress={() => navigation.navigate('PublishPath', { path: p })}
          style={styles.pathDetailScreen_actionButton}
        />
      </View>
    </ScrollView>
  );
}
