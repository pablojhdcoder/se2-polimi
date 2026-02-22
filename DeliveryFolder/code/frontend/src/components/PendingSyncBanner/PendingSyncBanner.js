import React from 'react';
import { View, Text } from 'react-native';
import { STRINGS } from '../../constants/strings';
import styles from './PendingSyncBanner.styles';

/**
 * Banner indicating there are operations pending sync with the server. Theme-based.
 * @param {boolean} visible - Whether to show (e.g. pendingSyncCount > 0)
 * @param {number} count - Number of pending operations (optional, for display)
 * @param {object} style - Additional styles
 */
export default function PendingSyncBanner({ visible, count, style }) {
  if (!visible) return null;
  const message =
    count != null && count > 0
      ? `${count} ${STRINGS.PENDING_SYNC_COUNT}`
      : STRINGS.PENDING_SYNC;
  return (
    <View style={[styles.pendingSyncBanner, style]}>
      <Text style={styles.pendingSyncBanner_text}>{message}</Text>
    </View>
  );
}
