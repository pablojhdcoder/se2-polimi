import React, { useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import {
  createUserSeed,
  generateUserAvatar,
  getInitials
} from '../../services/avatarService';
import styles from './Avatar.styles';

/**
 * Circular avatar: DiceBear SVG when user/seed provided, else initials or "?".
 * @param {function} onPress - Callback when avatar is pressed
 * @param {number} size - Width and height in pixels (default 36)
 * @param {object} user - User object { id, email, name?, full_name? } for seed and initials
 * @param {string} seed - Optional explicit seed (overrides user-derived seed)
 */
export default function Avatar({ onPress, size = 36, user, seed: seedProp }) {
  const displayName = user?.full_name ?? user?.name;
  const seed = useMemo(
    () => seedProp || (user && createUserSeed(user.id, user.email, displayName)),
    [seedProp, user, displayName]
  );
  const initials = useMemo(
    () => getInitials(displayName, user?.email),
    [user, displayName]
  );
  const svgXml = useMemo(
    () => (seed ? generateUserAvatar(seed) : null),
    [seed]
  );

  const style = [
    styles.avatar,
    { width: size, height: size, borderRadius: size / 2 }
  ];

  const content = svgXml ? (
    <SvgXml xml={svgXml} width={size} height={size} />
  ) : (
    <Text style={[styles.avatar_text, { fontSize: size * 0.45 }]}>
      {initials || '?'}
    </Text>
  );

  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
      {content}
    </TouchableOpacity>
  );
}
