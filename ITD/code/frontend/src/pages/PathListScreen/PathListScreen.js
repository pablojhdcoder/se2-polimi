import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { PathList } from '../../components/paths';
import { getPaths, getMyPaths, getCachedPaths, normalizePathForDisplay } from '../../services/pathsApi';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { useAuth } from '../../navigation/useAuth';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './PathListScreen.styles';

const FILTER_ALL = 'all';
const FILTER_MINE = 'mine';

/**
 * Path list screen. Loads and displays paths; supports pull-to-refresh.
 * When offline, reads from OFFLINE_DATA cache and shows cached indicator.
 * Filter: All paths / My paths (created by current user, by posted_by_username).
 * @param {Object} navigation - React Navigation object
 */
export default function PathListScreen({ navigation }) {
  const { isOnline } = useNetworkStatus();
  const { user } = useAuth();
  const [paths, setPaths] = useState([]);
  const [myPaths, setMyPaths] = useState([]);
  const [filter, setFilter] = useState(FILTER_ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isCached, setIsCached] = useState(false);

  const toNormalizedList = useCallback((raw) => {
    const list = Array.isArray(raw) ? raw : (raw?.data ?? raw?.paths ?? []);
    return list.map(normalizePathForDisplay).filter(Boolean);
  }, []);

  const loadPaths = useCallback(async () => {
    try {
      setError(null);
      setIsCached(false);
      if (!isOnline) {
        const cached = await getCachedPaths();
        setPaths(toNormalizedList(cached));
        setMyPaths([]);
        setIsCached(true);
      } else {
        const result = await getPaths();
        setPaths(toNormalizedList(result));
        if (user?.username) {
          try {
            const mine = await getMyPaths();
            setMyPaths(toNormalizedList(mine));
          } catch {
            setMyPaths([]);
          }
        } else {
          setMyPaths([]);
        }
      }
    } catch (err) {
      if (!isOnline) {
        const cached = await getCachedPaths();
        setPaths(toNormalizedList(cached));
        setMyPaths([]);
        setIsCached((Array.isArray(cached) ? cached : []).length > 0);
      } else {
        setError(err.message || STRINGS.ERROR_LOADING_PATHS);
        setPaths([]);
        setMyPaths([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isOnline, toNormalizedList, user?.username]);

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

  const displayedPaths = useMemo(() => {
    if (filter !== FILTER_MINE || !user?.username) return paths;
    return myPaths;
  }, [paths, myPaths, filter, user?.username]);

  const emptyMessage =
    filter === FILTER_MINE ? STRINGS.NO_MY_PATHS : STRINGS.NO_PATHS_CREATE_OR_SEARCH;

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
      {user ? (
        <View style={styles.pathListScreen_filterRow}>
          <TouchableOpacity
            style={[styles.pathListScreen_filterBtn, filter === FILTER_ALL && styles.pathListScreen_filterBtnActive]}
            onPress={() => setFilter(FILTER_ALL)}
          >
            <Text style={[styles.pathListScreen_filterText, filter === FILTER_ALL && styles.pathListScreen_filterTextActive]}>
              {STRINGS.ALL_PATHS}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pathListScreen_filterBtn, filter === FILTER_MINE && styles.pathListScreen_filterBtnActive]}
            onPress={() => setFilter(FILTER_MINE)}
          >
            <Text style={[styles.pathListScreen_filterText, filter === FILTER_MINE && styles.pathListScreen_filterTextActive]}>
              {STRINGS.MY_PATHS}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <PathList
        paths={displayedPaths}
        onPathPress={handlePathPress}
        loading={loading}
        emptyMessage={emptyMessage}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
