import React from 'react';
import { View, Text } from 'react-native';
import styles from './ErrorMessage.styles';

/**
 * Error message for forms or screens (theme-based).
 * @param {string} message - Error text
 * @param {object} style - Additional container styles
 */
export default function ErrorMessage({ message, style }) {
  if (!message) return null;
  return (
    <View style={[styles.errorMessage, style]}>
      <Text style={styles.errorMessage_text}>{message}</Text>
    </View>
  );
}
