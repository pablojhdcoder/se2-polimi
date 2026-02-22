import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../../styles';
import styles from './Button.styles';

/**
 * Reusable button with variants and loading state.
 * Primary = blue (DD); outline/secondary use theme colors.
 * @param {string} title - Button label
 * @param {function} onPress - Callback when pressed
 * @param {string} variant - 'primary' | 'secondary' | 'outline'
 * @param {boolean} disabled - Disables the button
 * @param {boolean} loading - Shows spinner and disables
 * @param {object} style - Additional container styles
 * @param {object} textStyle - Additional text styles
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        styles[`button_${variant}`],
        isDisabled && styles.button_disabled,
        style,
      ]}
    >
      {loading ? (
        <View style={styles.button_loadingRow}>
          <ActivityIndicator
            size="small"
            color={variant === 'outline' ? colors.primary : colors.textInverse}
          />
          <Text style={[styles.button_text, styles[`button_text_${variant}`], textStyle]}>
            {title}
          </Text>
        </View>
      ) : (
        <Text style={[styles.button_text, styles[`button_text_${variant}`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
