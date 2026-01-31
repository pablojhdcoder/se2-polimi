/**
 * MergeInfoScreen - UC12: Merge info (data/path merges).
 * @param {Object} route - React Navigation route (params: mergeId, mergeData)
 * @param {Object} navigation - React Navigation object
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Button } from '../../components';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './MergeInfoScreen.styles';

export default function MergeInfoScreen({ route, navigation }) {
  const mergeId = route?.params?.mergeId;
  const mergeData = route?.params?.mergeData;

  return (
    <ScrollView style={layoutStyles.screenContainer} contentContainerStyle={styles.mergeInfoScreen_content}>
      <Text style={styles.mergeInfoScreen_title}>{STRINGS.MERGE_INFO}</Text>
      <Card style={styles.mergeInfoScreen_card}>
        <Text style={styles.mergeInfoScreen_subtitle}>
          {STRINGS.MERGE_INFO_DESCRIPTION}
        </Text>
        {mergeId ? (
          <Text style={styles.mergeInfoScreen_mergeId}>{STRINGS.MERGE_ID} {mergeId}</Text>
        ) : null}
        {mergeData && typeof mergeData === 'object' ? (
          <View style={styles.mergeInfoScreen_dataBox}>
            <Text style={styles.mergeInfoScreen_dataLabel}>{STRINGS.ASSOCIATED_DATA}</Text>
            <Text style={styles.mergeInfoScreen_dataText}>{JSON.stringify(mergeData, null, 2)}</Text>
          </View>
        ) : (
          <Text style={styles.mergeInfoScreen_placeholder}>
            {STRINGS.NO_MERGE_DATA}
          </Text>
        )}
      </Card>
      <Button
        title={STRINGS.BACK}
        variant="outline"
        onPress={() => navigation.goBack()}
        style={styles.mergeInfoScreen_back}
      />
    </ScrollView>
  );
}
