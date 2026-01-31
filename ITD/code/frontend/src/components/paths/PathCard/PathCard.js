import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { STRINGS } from '../../../constants/strings';
import styles from './PathCard.styles';

/**
 * Reusable card for a path item in lists (theme + STRINGS).
 * @param {Object} path - { id, name, description?, distance?, difficulty?, startPoint?, endPoint? }
 * @param {Function} onPress - Callback when the card is pressed
 */
export default function PathCard({ path, onPress }) {
  const { name, description, distance, difficulty, startPoint, endPoint } = path || {};
  const snippet = description ? (description.length > 80 ? `${description.slice(0, 80)}…` : description) : '';

  return (
    <TouchableOpacity style={styles.pathCard} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.pathCard_title} numberOfLines={1}>{name || STRINGS.NO_NAME}</Text>
      {snippet ? <Text style={styles.pathCard_description} numberOfLines={2}>{snippet}</Text> : null}
      <View style={styles.pathCard_meta}>
        {distance != null ? <Text style={styles.pathCard_metaText}>{distance} km</Text> : null}
        {difficulty ? <Text style={styles.pathCard_metaText}> • {difficulty}</Text> : null}
      </View>
      {(startPoint || endPoint) ? (
        <Text style={styles.pathCard_points} numberOfLines={1}>
          {startPoint || '?'} → {endPoint || '?'}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
