import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '../../styles';
import styles from './Loading.styles';

/**
 * Centered loading indicator with optional message (theme-based).
 * @param {string} message - Message below the spinner (optional)
 */
export default function Loading({ message }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={styles.loading_message}>{message}</Text> : null}
    </View>
  );
}
