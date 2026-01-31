import React from 'react';
import { View } from 'react-native';
import styles from './Card.styles';

/**
 * Card-style container with border and light shadow (theme-based).
 * @param {React.ReactNode} children - Content
 * @param {object} style - Additional styles
 */
export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}
