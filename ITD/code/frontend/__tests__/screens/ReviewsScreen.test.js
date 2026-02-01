/**
 * Client integration tests: ReviewsScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReviewsScreen from '../../src/pages/ReviewsScreen/ReviewsScreen';

const mockNavigate = jest.fn();

jest.mock('../../src/services/reviewsApi', () => ({
  getReviews: jest.fn(),
}));

const getReviews = require('../../src/services/reviewsApi').getReviews;

describe('ReviewsScreen', () => {
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    jest.clearAllMocks();
    getReviews.mockResolvedValue([]);
  });

  it('loads reviews on mount and shows empty message when none', async () => {
    const { getByText } = render(<ReviewsScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getReviews).toHaveBeenCalled();
    });
    expect(getByText('No reviews. Explore paths and leave your opinion.')).toBeTruthy();
  });

  it('shows loading message initially', () => {
    getReviews.mockImplementation(() => new Promise(() => {}));
    const { getByText } = render(<ReviewsScreen navigation={navigation} />);
    expect(getByText('Loading reviews…')).toBeTruthy();
  });

  it('navigates to ReviewDetail when review pressed', async () => {
    const review = { id: 1, pathName: 'Path X', comment: 'Nice', rating: 5 };
    getReviews.mockResolvedValueOnce([review]);
    const { getByText } = render(<ReviewsScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getReviews).toHaveBeenCalled();
    });
    fireEvent.press(getByText('Path X'));
    expect(mockNavigate).toHaveBeenCalledWith('ReviewDetail', {
      reviewId: 1,
      review,
    });
  });

  it('shows Retry when error', async () => {
    getReviews.mockRejectedValueOnce(new Error('Fail'));
    const { getByText } = render(<ReviewsScreen navigation={navigation} />);
    await waitFor(() => {
      expect(getByText('Retry')).toBeTruthy();
    });
  });
});
