/**
 * Client integration tests: ReviewDetailScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReviewDetailScreen from '../../src/pages/ReviewDetailScreen/ReviewDetailScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('../../src/services/reviewsApi', () => ({
  getReviewById: jest.fn(),
}));

const getReviewById = require('../../src/services/reviewsApi').getReviewById;

describe('ReviewDetailScreen', () => {
  const navigation = { navigate: mockNavigate, goBack: mockGoBack };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses review from route when provided', () => {
    const review = { id: 1, pathName: 'Path A', comment: 'Great', rating: 5 };
    const route = { params: { reviewId: 1, review } };
    const { getByText } = render(
      <ReviewDetailScreen route={route} navigation={navigation} />
    );
    expect(getByText('Review detail')).toBeTruthy();
    expect(getByText('Path A')).toBeTruthy();
    expect(getByText('Great')).toBeTruthy();
    expect(getByText(/Rating: ★ 5/)).toBeTruthy();
    expect(getReviewById).not.toHaveBeenCalled();
  });

  it('fetches review when reviewId given and no review in route', async () => {
    const review = { id: 2, pathName: 'Path B', comment: 'Good' };
    getReviewById.mockResolvedValueOnce(review);
    const route = { params: { reviewId: 2 } };
    const { getByText } = render(
      <ReviewDetailScreen route={route} navigation={navigation} />
    );
    await waitFor(() => {
      expect(getReviewById).toHaveBeenCalledWith(2);
    });
    expect(getByText('Path B')).toBeTruthy();
  });

  it('shows error and Back when fetch fails', async () => {
    getReviewById.mockRejectedValueOnce(new Error('Not found'));
    const route = { params: { reviewId: 99 } };
    const { getByText } = render(
      <ReviewDetailScreen route={route} navigation={navigation} />
    );
    await waitFor(() => {
      expect(getByText('Not found')).toBeTruthy();
    });
    expect(getByText('Back')).toBeTruthy();
  });

  it('Back button calls goBack', () => {
    const route = { params: { review: { pathName: 'P', comment: 'c' } } };
    const { getByText } = render(
      <ReviewDetailScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getByText('Back'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
