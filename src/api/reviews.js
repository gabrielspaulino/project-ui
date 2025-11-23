import apiClient from './config';

export const reviewAPI = {
  // Get reviews for a product (from product endpoint)
  getByProductId(productId, params = {}) {
    // Since reviews come with the product, we fetch the product
    return apiClient.get(`/products/${productId}`, { params })
      .then(response => {
        // Extract reviews from product data
        return {
          ...response,
          data: response.data.reviews || []
        };
      });
  },

  // Create a review
  create(productId, reviewData) {
    return apiClient.post(`/products/${productId}/reviews`, reviewData);
  },

  // Update a review
  update(reviewId, reviewData) {
    return apiClient.put(`/reviews/${reviewId}`, reviewData);
  },

  // Delete a review
  delete(reviewId) {
    return apiClient.delete(`/reviews/${reviewId}`);
  },

  // Get user's reviews
  getUserReviews() {
    return apiClient.get('/reviews/my-reviews');
  },

  // Vote on review (helpful/not helpful)
  vote(reviewId, isHelpful) {
    return apiClient.post(`/reviews/${reviewId}/vote`, { helpful: isHelpful });
  }
};