import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './Header.styles';

/**
 * Shared header per DD: blue back arrow, center title, orange circular avatar right.
 * Use from theme: colors.primary (back), colors.accent (avatar).
 * @param {string} title - Header title text
 * @param {boolean} showBack - Whether to show back button (default true)
 * @param {function} onAvatarPress - Callback when avatar is pressed
 */
export default function Header({ title, showBack = true, onAvatarPress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.header_left}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.header_backButton}
          >
            <Text style={styles.header_backArrow}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.header_title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.header_right}>
        <TouchableOpacity
          onPress={onAvatarPress}
          style={styles.header_avatar}
          activeOpacity={0.8}
        >
          <Text style={styles.header_avatarText}>?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
