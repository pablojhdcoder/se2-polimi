/**
 * ReviewsScreen - List path reviews.
 * @param {Object} navigation - React Navigation object
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card, ErrorMessage, Loading } from '../../components';
import { getReviews } from '../../services/reviewsApi';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './ReviewsScreen.styles';

export default function ReviewsScreen({ navigation }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadReviews = useCallback(async () => {
    try {
      setError(null);
      const result = await getReviews();
      const list = Array.isArray(result) ? result : result?.data ?? result?.reviews ?? [];
      setReviews(list);
    } catch (err) {
      setError(err?.message || STRINGS.ERROR_LOADING_REVIEWS);
      setReviews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadReviews();
  }, [loadReviews]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ReviewDetail', { reviewId: item.id, review: item })}
    >
      <Card style={styles.reviewsScreen_reviewCard}>
        <Text style={styles.reviewsScreen_reviewTitle} numberOfLines={1}>
          {item.pathName || item.pathId || STRINGS.PATH}
        </Text>
        <Text style={styles.reviewsScreen_reviewText} numberOfLines={2}>
          {item.comment || item.text || STRINGS.NO_COMMENT}
        </Text>
        <Text style={styles.reviewsScreen_reviewMeta}>
          {item.rating != null ? `★ ${item.rating}` : ''}
          {item.userName ? ` · ${item.userName}` : ''}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message={STRINGS.LOADING_REVIEWS} />;
  }

  return (
    <View style={layoutStyles.screenContainer}>
      <ErrorMessage message={error} />
      {error ? (
        <TouchableOpacity style={styles.reviewsScreen_retry} onPress={() => { setLoading(true); loadReviews(); }}>
          <Text style={styles.reviewsScreen_retryText}>{STRINGS.RETRY}</Text>
        </TouchableOpacity>
      ) : null}
      <FlatList
        data={reviews}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.reviewsScreen_listContent}
        ListEmptyComponent={
          <View style={styles.reviewsScreen_empty}>
            <Text style={styles.reviewsScreen_emptyText}>{STRINGS.NO_REVIEWS}</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
