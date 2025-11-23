<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.imageUrl || '/placeholder.jpg'" :alt="product.name" />
      <button 
        class="compare-btn" 
        @click.stop="toggleComparison"
        :class="{ active: isInComparison }"
      >
        <span v-if="!isInComparison">+ Compare</span>
        <span v-else>✓ Added</span>
      </button>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ truncateDescription(product.description) }}</p>
      
      <div class="product-rating">
        <div class="stars">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= product.averageRating }">
            ★
          </span>
        </div>
        <span class="rating-text">{{ product.averageRating?.toFixed(1) || '0.0' }}</span>
        <span class="review-count">({{ product.reviewCount || 0 }})</span>
      </div>
      
      <div class="product-footer">
        <span class="product-price">${{ product.price?.toFixed(2) }}</span>
        <button class="btn-primary" @click="viewDetails">View Details</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useComparisonStore } from '../stores/comparison';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const comparisonStore = useComparisonStore();

const isInComparison = computed(() => 
  comparisonStore.selectedProducts.some(p => p.id === props.product.id)
);

const viewDetails = () => {
  router.push(`/products/${props.product.id}`);
};

const toggleComparison = () => {
  if (isInComparison.value) {
    comparisonStore.removeProduct(props.product.id);
  } else {
    try {
      comparisonStore.addProduct(props.product);
    } catch (error) {
      alert(error.message);
    }
  }
};

const truncateDescription = (text) => {
  if (!text) return '';
  return text.length > 100 ? text.substring(0, 100) + '...' : text;
};
</script>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.compare-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: 2px solid #007bff;
  color: #007bff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.compare-btn.active {
  background: #007bff;
  color: white;
}

.compare-btn:hover {
  transform: scale(1.05);
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.product-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.4;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 16px;
}

.star.filled {
  color: #ffc107;
}

.rating-text {
  font-weight: 600;
  color: #333;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 24px;
  font-weight: 700;
  color: #007bff;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #0056b3;
}
</style>