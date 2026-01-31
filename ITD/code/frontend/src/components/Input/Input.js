import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../../styles';
import styles from './Input.styles';

/**
 * Reusable text field with label and error message (theme-based; rounded corners, optional subtle shadow per DD).
 * @param {string} label - Optional label
 * @param {string} value - Controlled value
 * @param {function} onChangeText - Callback (text) => void
 * @param {string} placeholder - Placeholder text
 * @param {boolean} secureTextEntry - For password fields
 * @param {string} error - Error message (shows red border and text)
 * @param {object} style - Additional container styles
 * @param {object} inputStyle - Additional TextInput styles
 * @param {string} autoCapitalize - 'none' | 'sentences' | 'words' | 'characters'
 * @param {string} keyboardType - 'default' | 'email-address' | 'numeric' etc.
 * @param {boolean} editable - Whether the field is editable
 */
export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  style,
  inputStyle,
  autoCapitalize = 'none',
  keyboardType = 'default',
  editable = true,
}) {
  return (
    <View style={[styles.input, style]}>
      {label ? <Text style={styles.input_label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        editable={editable}
        style={[
          styles.input_field,
          error ? styles.input_fieldError : null,
          inputStyle,
        ]}
      />
      {error ? (
        <Text style={styles.input_errorText} numberOfLines={2}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
