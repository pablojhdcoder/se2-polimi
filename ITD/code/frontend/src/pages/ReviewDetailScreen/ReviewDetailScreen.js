/**
 * ReviewDetailScreen - UC11: Review detail.
 * @param {Object} route - React Navigation route (params: reviewId, review)
 * @param {Object} navigation - React Navigation object
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Loading, ErrorMessage, Button } from '../../components';
import { getReviewById } from '../../services/reviewsApi';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './ReviewDetailScreen.styles';

export default function ReviewDetailScreen({ route, navigation }) {
  const reviewId = route?.params?.reviewId;
  const reviewFromRoute = route?.params?.review;
  const [review, setReview] = useState(reviewFromRoute ?? null);
  const [loading, setLoading] = useState(!reviewFromRoute);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reviewId) return;
    if (reviewFromRoute) {
      setReview(reviewFromRoute);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const data = await getReviewById(reviewId);
        if (!cancelled) setReview(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || STRINGS.ERROR_LOADING_REVIEW);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [reviewId, reviewFromRoute]);

  if (loading) return <Loading message={STRINGS.LOADING_REVIEW} />;
  if (error && !review) {
    return (
      <View style={[layoutStyles.screenContainer, styles.reviewDetailScreen_content]}>
        <ErrorMessage message={error} />
        <Button title={STRINGS.BACK} variant="outline" onPress={() => navigation.goBack()} style={styles.reviewDetailScreen_back} />
      </View>
    );
  }

  return (
    <ScrollView style={layoutStyles.screenContainer} contentContainerStyle={styles.reviewDetailScreen_content}>
      <Card style={styles.reviewDetailScreen_card}>
        <Text style={styles.reviewDetailScreen_title}>{STRINGS.REVIEW_DETAIL}</Text>
        <Text style={styles.reviewDetailScreen_pathName}>{review?.pathName || review?.pathId || STRINGS.PATH}</Text>
        {review?.rating != null && (
          <Text style={styles.reviewDetailScreen_rating}>{STRINGS.RATING}: ★ {review.rating}</Text>
        )}
        <Text style={styles.reviewDetailScreen_comment}>{review?.comment || review?.text || STRINGS.NO_COMMENT}</Text>
        {(review?.userName || review?.createdAt) && (
          <Text style={styles.reviewDetailScreen_meta}>
            {review.userName ? `${STRINGS.BY} ${review.userName}` : ''}
            {review.createdAt ? ` · ${new Date(review.createdAt).toLocaleDateString()}` : ''}
          </Text>
        )}
      </Card>
      <Button title={STRINGS.BACK} variant="outline" onPress={() => navigation.goBack()} style={styles.reviewDetailScreen_back} />
    </ScrollView>
  );
}
