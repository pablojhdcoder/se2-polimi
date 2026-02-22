import React from 'react';
import { FlatList, View, Text } from 'react-native';
import PathCard from '../PathCard/PathCard';
import { STRINGS } from '../../../constants/strings';
import styles from './PathList.styles';

/**
 * List of paths using PathCard (theme + STRINGS).
 * @param {Array} paths - Array of path objects
 * @param {Function} onPathPress - (path) => void
 * @param {boolean} loading - Shows loading message
 * @param {string} emptyMessage - Message when paths is empty
 * @param {React.ReactElement} [refreshControl] - Optional RefreshControl for pull-to-refresh
 */
export default function PathList({ paths, onPathPress, loading, emptyMessage, refreshControl }) {
  if (loading) {
    return (
      <View style={styles.pathList_centered}>
        <Text style={styles.pathList_message}>{STRINGS.LOADING_PATHS}</Text>
      </View>
    );
  }

  if (!paths || paths.length === 0) {
    return (
      <View style={styles.pathList_centered}>
        <Text style={styles.pathList_message}>{emptyMessage || STRINGS.NO_PATHS}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={paths}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PathCard path={item} onPress={() => onPathPress?.(item)} />}
      contentContainerStyle={styles.pathList_content}
      refreshControl={refreshControl ?? undefined}
    />
  );
}
