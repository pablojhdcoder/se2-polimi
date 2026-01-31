import React, { useState, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { PathList } from '../../components/paths';
import { searchPaths, getCachedPaths } from '../../services/pathsApi';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import { colors } from '../../styles';
import styles from './PathSearchScreen.styles';

/**
 * Path search screen. Search paths by query and navigate to detail.
 * When offline, shows cached paths list and cached indicator.
 * @param {Object} navigation - React Navigation object
 */
export default function PathSearchScreen({ navigation }) {
  const { isOnline } = useNetworkStatus();
  const [query, setQuery] = useState('');
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setIsCached(false);
    try {
      if (!isOnline) {
        const cached = await getCachedPaths();
        setPaths(Array.isArray(cached) ? cached : []);
        setIsCached(true);
      } else {
        const result = await searchPaths({ search: query.trim() || undefined });
        setPaths(Array.isArray(result) ? result : (result?.data ?? result?.paths ?? []));
      }
    } catch (err) {
      if (!isOnline) {
        const cached = await getCachedPaths();
        setPaths(Array.isArray(cached) ? cached : []);
        setIsCached(cached.length > 0);
      } else {
        setError(err.message || STRINGS.ERROR_SEARCH);
        setPaths([]);
      }
    } finally {
      setLoading(false);
    }
  }, [query, isOnline]);

  const handlePathPress = useCallback(
    (path) => {
      navigation.navigate('PathDetail', { pathId: path.id, path });
    },
    [navigation]
  );

  return (
    <View style={layoutStyles.screenContainer}>
      <View style={styles.pathSearchScreen_searchRow}>
        <TextInput
          style={styles.pathSearchScreen_input}
          placeholder={STRINGS.SEARCH_PLACEHOLDER}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={doSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.pathSearchScreen_searchButton} onPress={doSearch}>
          <Text style={styles.pathSearchScreen_searchButtonText}>{STRINGS.SEARCH}</Text>
        </TouchableOpacity>
      </View>
      {isCached ? (
        <View style={styles.pathSearchScreen_cachedBox}>
          <Text style={styles.pathSearchScreen_cachedText}>{STRINGS.SHOWING_CACHED_PATHS}</Text>
        </View>
      ) : null}
      {error ? (
        <View style={styles.pathSearchScreen_errorBox}>
          <Text style={styles.pathSearchScreen_errorText}>{error}</Text>
        </View>
      ) : null}
      <PathList
        paths={paths}
        onPathPress={handlePathPress}
        loading={loading}
        emptyMessage={searched ? STRINGS.NO_PATHS_FOUND : STRINGS.TYPE_AND_SEARCH}
      />
    </View>
  );
}
