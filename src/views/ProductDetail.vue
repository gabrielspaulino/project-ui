<template>
  <div class="product-detail-page">
    <div class="container">
      <button class="back-button" @click="goBack">
        ← Back to Products
      </button>

      <div v-if="loading" class="loading">Loading product details...</div>
      
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <div v-else-if="product" class="product-detail">
        <div class="product-main">
          <div class="product-image-section">
            <img :src="product.imgUrl || '/placeholder.jpg'" :alt="product.name" />
          </div>

          <div class="product-info-section">
            <h1 class="product-title">{{ product.name }}</h1>
            
            <div class="product-rating">
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= product.averageRating }">
                  ★
                </span>
              </div>
              <span class="rating-text">{{ product.averageRating?.toFixed(1) || '0.0' }}</span>
              <span class="review-count">({{ product.reviewCount || 0 }} reviews)</span>
            </div>

            <div class="product-price">
              ${{ product.price?.toFixed(2) }}
            </div>

            <div class="product-category">
              <strong>Category:</strong> {{ product.category || 'N/A' }}
            </div>

            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product.description || 'No description available.' }}</p>
            </div>

            <div class="product-actions">
              <button class="btn-primary btn-large">Add to Cart</button>
              <button 
                class="btn-secondary btn-large" 
                @click="toggleComparison"
                :class="{ active: isInComparison }"
              >
                {{ isInComparison ? '✓ In Comparison' : '+ Add to Compare' }}
              </button>
            </div>

            <div v-if="product.features && product.features.length > 0" class="product-features">
              <h3>Features</h3>
              <ul>
                <li v-for="feature in product.features" :key="feature.name">
                  <strong>{{ feature.name }}:</strong> {{ feature.value }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ProductReviews :product-id="product.id" :initial-reviews="product.reviews" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '../stores/products';
import { useComparisonStore } from '../stores/comparison';
import ProductReviews from '../components/ProductReviews.vue';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const comparisonStore = useComparisonStore();

const product = computed(() => productStore.currentProduct);
const loading = computed(() => productStore.loading);
const error = computed(() => productStore.error);

const isInComparison = computed(() => 
  product.value && comparisonStore.selectedProducts.some(p => p.id === product.value.id)
);

onMounted(async () => {
  const productId = route.params.id;
  try {
    await productStore.fetchProductById(productId);
  } catch (err) {
    console.error('Failed to load product:', err);
  }
});

const goBack = () => {
  router.push('/products');
};

const toggleComparison = () => {
  if (!product.value) return;

  if (isInComparison.value) {
    comparisonStore.removeProduct(product.value.id);
  } else {
    try {
      comparisonStore.addProduct(product.value);
    } catch (error) {
      alert(error.message);
    }
  }
};
</script>

<style scoped>
.product-detail-page {
  padding: 40px 0;
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 8px 0;
  transition: color 0.2s;
}

.back-button:hover {
  color: #0056b3;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 60px;
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image-section img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
}

.product-title {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  color: #ddd;
  font-size: 24px;
}

.star.filled {
  color: #ffc107;
}

.rating-text {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.review-count {
  color: #666;
  font-size: 16px;
}

.product-price {
  font-size: 48px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 24px;
}

.product-category {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.product-description {
  margin-bottom: 32px;
}

.product-description h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #333;
}

.product-description p {
  line-height: 1.6;
  color: #666;
  font-size: 16px;
}

.product-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.btn-large {
  flex: 1;
  padding: 16px 32px;
  font-size: 16px;
}

.btn-secondary.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.product-features {
  border-top: 1px solid #e0e0e0;
  padding-top: 24px;
}

.product-features h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
}

.product-features ul {
  list-style: none;
}

.product-features li {
  padding: 8px 0;
  color: #666;
  font-size: 16px;
}

@media (max-width: 968px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .product-price {
    font-size: 36px;
  }
  
  .product-actions {
    flex-direction: column;
  }
}
</style>