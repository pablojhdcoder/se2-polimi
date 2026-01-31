import React from 'react';
import { View, Text } from 'react-native';
import { STRINGS } from '../../constants/strings';
import styles from './OfflineBanner.styles';

/**
 * Banner shown when there is no connection (isOnline === false). Theme-based.
 * @param {boolean} visible - Whether to show (e.g. !isOnline)
 * @param {object} style - Additional styles
 */
export default function OfflineBanner({ visible, style }) {
  if (!visible) return null;
  return (
    <View style={[styles.offlineBanner, style]}>
      <Text style={styles.offlineBanner_text}>{STRINGS.OFFLINE_MESSAGE}</Text>
    </View>
  );
}
