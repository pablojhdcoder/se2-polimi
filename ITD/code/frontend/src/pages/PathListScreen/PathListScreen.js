import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { PathList } from '../../components/paths';
import { getPaths, getCachedPaths } from '../../services/pathsApi';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './PathListScreen.styles';

/**
 * Path list screen. Loads and displays paths; supports pull-to-refresh.
 * When offline, reads from OFFLINE_DATA cache and shows cached indicator.
 * @param {Object} navigation - React Navigation object
 */
export default function PathListScreen({ navigation }) {
  const { isOnline } = useNetworkStatus();
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isCached, setIsCached] = useState(false);

  const loadPaths = useCallback(async () => {
    try {
      setError(null);
      setIsCached(false);
      if (!isOnline) {
        const cached = await getCachedPaths();
        setPaths(Array.isArray(cached) ? cached : []);
        setIsCached(true);
      } else {
        const result = await getPaths();
        setPaths(Array.isArray(result) ? result : (result?.data ?? result?.paths ?? []));
      }
    } catch (err) {
      if (!isOnline) {
        const cached = await getCachedPaths();
        setPaths(Array.isArray(cached) ? cached : []);
        setIsCached(cached.length > 0);
      } else {
        setError(err.message || STRINGS.ERROR_LOADING_PATHS);
        setPaths([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isOnline]);

  React.useEffect(() => {
    loadPaths();
  }, [loadPaths]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPaths();
  }, [loadPaths]);

  const handlePathPress = useCallback(
    (path) => {
      navigation.navigate('PathDetail', { pathId: path.id, path });
    },
    [navigation]
  );

  return (
    <View style={layoutStyles.screenContainer}>
      {isCached ? (
        <View style={styles.pathListScreen_cachedBox}>
          <Text style={styles.pathListScreen_cachedText}>{STRINGS.SHOWING_CACHED_PATHS}</Text>
        </View>
      ) : null}
      {error ? (
        <View style={styles.pathListScreen_errorBox}>
          <Text style={styles.pathListScreen_errorText}>{error}</Text>
          <TouchableOpacity style={styles.pathListScreen_retryButton} onPress={() => { setLoading(true); loadPaths(); }}>
            <Text style={styles.pathListScreen_retryText}>{STRINGS.RETRY}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <PathList
        paths={paths}
        onPathPress={handlePathPress}
        loading={loading}
        emptyMessage={STRINGS.NO_PATHS_CREATE_OR_SEARCH}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
