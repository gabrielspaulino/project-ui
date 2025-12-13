<template>
  <div class="reviews-section">
    <div class="reviews-header">
      <h2>Customer Reviews</h2>
      <button class="btn-primary" @click="showReviewForm = !showReviewForm">
        {{ showReviewForm ? 'Cancel' : 'Write a Review' }}
      </button>
    </div>

    <div class="reviews-summary">
      <div class="average-rating">
        <div class="rating-number">{{ averageRating }}</div>
        <div class="stars">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(averageRating) }">
            ★
          </span>
        </div>
        <div class="total-reviews">{{ reviews.length }} reviews</div>
      </div>

      <div class="rating-bars">
        <div v-for="rating in [5,4,3,2,1]" :key="rating" class="rating-bar-row">
          <span class="rating-label">{{ rating }} ★</span>
          <div class="rating-bar">
            <div class="rating-bar-fill" :style="{ width: getRatingPercentage(rating) + '%' }"></div>
          </div>
          <span class="rating-count">{{ ratingDistribution[rating] }}</span>
        </div>
      </div>
    </div>

    <ReviewForm 
      v-if="showReviewForm" 
      :product-id="productId" 
      @submitted="handleReviewSubmitted"
    />

    <div class="reviews-list">
      <div v-if="loading" class="loading">Loading reviews...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="reviews.length === 0" class="no-reviews">
        No reviews yet. Be the first to review this product!
      </div>
      <div v-else>
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">{{ getInitials(review.userName) }}</div>
              <div>
                <div class="reviewer-name">{{ review.userName }}</div>
                <div class="review-date">{{ formatDate(review.createdAt) }}</div>
              </div>
            </div>
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">
                ★
              </span>
            </div>
          </div>

          <div class="review-content">
            <h4 v-if="review.title" class="review-title">{{ review.title }}</h4>
            <p class="review-text">{{ review.comment }}</p>
          </div>

          <div class="review-footer">
            <button 
              class="helpful-btn" 
              @click="voteHelpful(review.id, true)"
            >
              👍 Helpful ({{ review.helpfulCount || 0 }})
            </button>
            <button 
              class="helpful-btn" 
              @click="voteHelpful(review.id, false)"
            >
              👎 Not Helpful ({{ review.notHelpfulCount || 0 }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useReviewStore } from '../stores/reviews';
import ReviewForm from './ReviewForm.vue';

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  }
});

const reviewStore = useReviewStore();
const showReviewForm = ref(false);

const reviews = computed(() => reviewStore.reviews);
const loading = computed(() => reviewStore.loading);
const error = computed(() => reviewStore.error);
const averageRating = computed(() => reviewStore.averageRating);
const ratingDistribution = computed(() => reviewStore.ratingDistribution);

onMounted(() => {
  reviewStore.fetchReviews(props.productId);
});

const handleReviewSubmitted = () => {
  showReviewForm.value = false;
  reviewStore.fetchReviews(props.productId);
};

const voteHelpful = async (reviewId, isHelpful) => {
  try {
    await reviewStore.voteReview(reviewId, isHelpful);
  } catch (error) {
    console.error('Error voting:', error);
  }
};

const getRatingPercentage = (rating) => {
  if (reviews.value.length === 0) return 0;
  return (ratingDistribution.value[rating] / reviews.value.length) * 100;
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.reviews-section {
  margin-top: 40px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.reviews-summary {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  padding: 24px;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 24px;
}

.average-rating {
  text-align: center;
}

.rating-number {
  font-size: 48px;
  font-weight: 700;
  color: (--text-primary);
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-bar-row {
  display: grid;
  grid-template-columns: 50px 1fr 40px;
  align-items: center;
  gap: 12px;
}

.rating-label {
  font-size: 14px;
  color: var(--text-primary);
}

.rating-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.rating-bar-fill {
  height: 100%;
  background: #ffc107;
  transition: width 0.3s;
}

.rating-count {
  font-size: 14px;
  color: var(--text-primary);
  text-align: right;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.reviewer-name {
  font-weight: 600;
  color: var(--text-primary);
}

.review-date {
  font-size: 14px;
  color: var(--text-primary);
}

.review-content {
  margin-bottom: 16px;
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.review-text {
  color: var(--text-primary);
  line-height: 1.6;
}

.review-footer {
  display: flex;
  gap: 12px;
}

.helpful-btn {
  background: var(--bg-secondary);
  border: 1px solid #e0e0e0;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: var(--text-primary);
}

.helpful-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: var(--text-primary);
  font-size: 16px;
}

.star.filled {
  color: #ffc107;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.loading, .error, .no-reviews {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>