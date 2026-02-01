/**
 * Main map screen (per main.png). Full-screen map with a "Search paths" bar
 * that navigates to PathSearch. Shown as the first tab when authenticated.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapboxMap } from '../../components';
import { STRINGS } from '../../constants/strings';
import styles, { SEARCH_BAR_TOP_PADDING } from './MapScreen.styles';

export default function MapScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <MapboxMap style={[styles.mapFullScreen]} showUserLocation />
      <View
        style={[
          styles.searchBarWrap,
          { paddingTop: insets.top + SEARCH_BAR_TOP_PADDING },
        ]}
      >
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('PathSearch')}
          activeOpacity={0.8}
        >
          <Text style={styles.searchBarIcon}>🔍</Text>
          <Text style={styles.searchBarPlaceholder}>{STRINGS.SEARCH_PATHS}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
