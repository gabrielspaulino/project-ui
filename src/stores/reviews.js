import { defineStore } from 'pinia';
import { reviewAPI } from '../api/reviews';

export const useReviewStore = defineStore('reviews', {
  state: () => ({
    reviews: [],
    loading: false,
    error: null,
    userReviews: []
  }),

  getters: {
    averageRating: (state) => {
      if (state.reviews.length === 0) return 0;
      const sum = state.reviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / state.reviews.length).toFixed(1);
    },

    ratingDistribution: (state) => {
      const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      state.reviews.forEach(review => {
        dist[review.rating] = (dist[review.rating] || 0) + 1;
      });
      return dist;
    }
  },

  actions: {
    async fetchReviews(productId) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await reviewAPI.getByProductId(productId);
        this.reviews = response.data || [];
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching reviews:', error);
      } finally {
        this.loading = false;
      }
    },

    // Alternative: Set reviews directly from product data
    setReviewsFromProduct(reviews) {
      this.reviews = reviews || [];
    },

    async createReview(productId, reviewData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await reviewAPI.create(productId, reviewData);
        this.reviews.unshift(response.data);
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Error creating review:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateReview(reviewId, reviewData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await reviewAPI.update(reviewId, reviewData);
        const index = this.reviews.findIndex(r => r.id === reviewId);
        if (index !== -1) {
          this.reviews[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Error updating review:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteReview(reviewId) {
      this.loading = true;
      this.error = null;
      
      try {
        await reviewAPI.delete(reviewId);
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
      } catch (error) {
        this.error = error.message;
        console.error('Error deleting review:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async voteReview(reviewId, isHelpful) {
      try {
        await reviewAPI.vote(reviewId, isHelpful);
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          if (isHelpful) {
            review.helpfulCount = (review.helpfulCount || 0) + 1;
          } else {
            review.notHelpfulCount = (review.notHelpfulCount || 0) + 1;
          }
        }
      } catch (error) {
        console.error('Error voting on review:', error);
        throw error;
      }
    }
  }
});