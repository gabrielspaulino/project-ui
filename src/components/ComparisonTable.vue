<template>
  <div class="comparison-table">
    <div v-if="loading" class="loading">Loading comparison...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!comparisonData" class="no-data">No comparison data available</div>
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th class="feature-column">Features</th>
            <th v-for="product in products" :key="product.id" class="product-column">
              <div class="product-header">
                <img :src="product.imgUrl || '/placeholder.jpg'" :alt="product.name" />
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p class="price">${{ product.price?.toFixed(2) }}</p>
                </div>
                <button class="remove-btn" @click="removeProduct(product.id)">×</button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="feature-name">Rating</td>
            <td v-for="product in products" :key="'rating-' + product.id">
              <div class="rating-cell">
                <div class="stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= product.averageRating }">
                    ★
                  </span>
                </div>
                <span>{{ product.averageRating?.toFixed(1) || '0.0' }}</span>
              </div>
            </td>
          </tr>

          <tr>
            <td class="feature-name">Reviews</td>
            <td v-for="product in products" :key="'reviews-' + product.id">
              {{ product.reviewCount || 0 }} reviews
            </td>
          </tr>

          <tr>
            <td class="feature-name">Category</td>
            <td v-for="product in products" :key="'category-' + product.id">
              {{ product.category || 'N/A' }}
            </td>
          </tr>

          <tr>
            <td class="feature-name">Description</td>
            <td v-for="product in products" :key="'desc-' + product.id">
              {{ product.description || 'No description' }}
            </td>
          </tr>

          <tr v-for="(feature, index) in comparisonData.features" :key="index">
            <td class="feature-name">{{ feature.name }}</td>
            <td v-for="product in products" :key="feature.name + '-' + product.id">
              {{ getFeatureValue(product, feature.name) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table-actions">
        <button class="btn-secondary" @click="clearAll">Clear All</button>
        <button class="btn-primary" @click="addMore">Add More Products</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useComparisonStore } from '../stores/comparison';

const router = useRouter();
const comparisonStore = useComparisonStore();

const products = computed(() => comparisonStore.selectedProducts);
const comparisonData = computed(() => comparisonStore.comparisonData);
const loading = computed(() => comparisonStore.loading);
const error = computed(() => comparisonStore.error);

onMounted(async () => {
  if (products.value.length >= 2) {
    await comparisonStore.compareProducts();
  }
});

const removeProduct = (productId) => {
  comparisonStore.removeProduct(productId);
  if (products.value.length >= 2) {
    comparisonStore.compareProducts();
  } else {
    router.push('/products');
  }
};

const clearAll = () => {
  if (confirm('Are you sure you want to clear all products?')) {
    comparisonStore.clearAll();
    router.push('/products');
  }
};

const addMore = () => {
  router.push('/products');
};

const getFeatureValue = (product, featureName) => {
  const feature = product.features?.find(f => f.name === featureName);
  return feature?.value || 'N/A';
};
</script>

<style scoped>
.comparison-table {
  padding: 20px;
}

.table-container {
  overflow-x: auto;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  position: sticky;
  top: 0;
  background: var(--card-bg);
  z-index: 10;
}

.feature-column {
  width: 200px;
  min-width: 200px;
  background: var(--bg-secondary);
  font-weight: 600;
  padding: 16px;
  text-align: left;
  border-right: 2px solid var(--border-color);
  color: var(--text-primary);
}

.product-column {
  min-width: 250px;
  padding: 16px;
  border-bottom: 2px solid var(--border-color);
}

.product-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
}

.product-header img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  text-align: center;
}

.product-info h3 {
  font-size: 16px;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.remove-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--danger-color);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

tbody tr {
  border-bottom: 1px solid var(--border-color);
}

tbody tr:hover {
  background: var(--hover-bg);
}

td {
  padding: 16px;
  text-align: center;
  color: var(--text-primary);
}

.feature-name {
  text-align: left;
  font-weight: 600;
  background: var(--bg-secondary);
  border-right: 2px solid var(--border-color);
  color: var(--text-primary);
}

.rating-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

.table-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  background: var(--bg-secondary);
}

.btn-primary, .btn-secondary {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--hover-bg);
}

.loading, .error, .no-data {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.error {
  color: var(--danger-color);
}
</style>