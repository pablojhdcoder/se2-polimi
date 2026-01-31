import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './Avatar.styles';

/**
 * Orange circular avatar per DD (e.g. header right).
 * @param {function} onPress - Callback when avatar is pressed
 * @param {number} size - Width and height in pixels (default 36)
 */
export default function Avatar({ onPress, size = 36 }) {
  const style = [styles.avatar, { width: size, height: size, borderRadius: size / 2 }];
  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
      <Text style={styles.avatar_text}>?</Text>
    </TouchableOpacity>
  );
}
