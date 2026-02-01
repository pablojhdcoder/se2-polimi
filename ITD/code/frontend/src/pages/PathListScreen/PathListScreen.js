import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PathList } from '../../components/paths';
import { getPaths, getMyPaths, getCachedPaths, normalizePathForDisplay } from '../../services/pathsApi';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { useAuth } from '../../navigation/useAuth';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './PathListScreen.styles';

const FILTER_PUBLISHED = 'published';
const FILTER_UNPUBLISHED = 'unpublished';

/**
 * Path list screen. Loads and displays paths; supports pull-to-refresh.
 * When offline, reads from OFFLINE_DATA cache and shows cached indicator.
 * Filter: All paths / My paths (created by current user, by posted_by_user_id).
 * @param {Object} navigation - React Navigation object
 */
export default function PathListScreen({ navigation }) {
  const { isOnline } = useNetworkStatus();
  const { user } = useAuth();
  const [paths, setPaths] = useState([]);
  const [myPaths, setMyPaths] = useState([]);
  const [filter, setFilter] = useState(FILTER_PUBLISHED);
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

  // Refresh paths when screen gains focus (e.g. after creating a new path)
  useFocusEffect(
    useCallback(() => {
      loadPaths();
    }, [loadPaths])
  );

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
    if (filter === FILTER_PUBLISHED) return paths;
    if (!user?.username) return [];
    return myPaths.filter((p) => p.isPublished === false);
  }, [paths, myPaths, filter, user?.username]);

  const emptyMessage =
    filter === FILTER_UNPUBLISHED ? STRINGS.NO_UNPUBLISHED_PATHS : STRINGS.NO_PUBLISHED_PATHS;

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
            style={[styles.pathListScreen_filterBtn, filter === FILTER_PUBLISHED && styles.pathListScreen_filterBtnActive]}
            onPress={() => setFilter(FILTER_PUBLISHED)}
          >
            <Text style={[styles.pathListScreen_filterText, filter === FILTER_PUBLISHED && styles.pathListScreen_filterTextActive]}>
              {STRINGS.PUBLISHED_TAB}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pathListScreen_filterBtn, filter === FILTER_UNPUBLISHED && styles.pathListScreen_filterBtnActive]}
            onPress={() => setFilter(FILTER_UNPUBLISHED)}
          >
            <Text style={[styles.pathListScreen_filterText, filter === FILTER_UNPUBLISHED && styles.pathListScreen_filterTextActive]}>
              {STRINGS.UNPUBLISHED_TAB}
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
