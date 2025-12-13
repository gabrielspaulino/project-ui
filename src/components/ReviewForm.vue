<template>
  <div class="review-form">
    <h3>Write Your Review</h3>
    <form @submit.prevent="submitReview">
      <div class="form-group">
        <label>Rating *</label>
        <div class="star-input">
          <span 
            v-for="i in 5" 
            :key="i" 
            class="star" 
            :class="{ filled: i <= form.rating, hover: i <= hoverRating }"
            @click="form.rating = i"
            @mouseenter="hoverRating = i"
            @mouseleave="hoverRating = 0"
          >
            ★
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="title">Review Title (Optional)</label>
        <input 
          id="title"
          v-model="form.title" 
          type="text" 
          placeholder="Summarize your experience"
        />
      </div>

      <div class="form-group">
        <label for="comment">Your Review *</label>
        <textarea 
          id="comment"
          v-model="form.comment" 
          rows="5" 
          placeholder="Share your experience with this product"
          required
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="!isValid || submitting">
          {{ submitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useReviewStore } from '../stores/reviews';

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['submitted']);

const reviewStore = useReviewStore();

const form = ref({
  rating: 0,
  title: '',
  comment: ''
});

const hoverRating = ref(0);
const submitting = ref(false);
const error = ref(null);

const isValid = computed(() => form.value.rating > 0 && form.value.comment.trim().length > 0);

const submitReview = async () => {
  if (!isValid.value) return;

  submitting.value = true;
  error.value = null;

  try {
    await reviewStore.createReview(props.productId, form.value);
    form.value = { rating: 0, title: '', comment: '' };
    emit('submitted');
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to submit review. Please try again.';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.review-form {
  background: var(--bg-secondary);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.star-input {
  display: flex;
  gap: 4px;
}

.star-input .star {
  font-size: 32px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.star-input .star.filled,
.star-input .star.hover {
  color: #ffc107;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--bg-primary);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: #007bff;
  color: var(--text-primary);
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:disabled {
  background: var(--primary-color);
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 12px;
  text-align: center;
}
</style>