<template>
  <div class="comparison-page">
    <div class="container">
      <div class="page-header">
        <button class="back-button" @click="goBack">
          ← Back to Products
        </button>
        <h1>Product Comparison</h1>
      </div>

      <div v-if="!hasProducts" class="empty-state">
        <div class="empty-icon">📊</div>
        <h2>No Products Selected</h2>
        <p>Add products to comparison from the product list to see them here.</p>
        <button class="btn-primary" @click="goToProducts">Browse Products</button>
      </div>

      <div v-else-if="selectedProducts.length < 2" class="warning-state">
        <div class="warning-icon">⚠️</div>
        <h2>Need More Products</h2>
        <p>You need at least 2 products to compare. You currently have {{ selectedProducts.length }} selected.</p>
        <button class="btn-primary" @click="goToProducts">Add More Products</button>
      </div>

      <div v-else>
        <ComparisonTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useComparisonStore } from '../stores/comparison';
import ComparisonTable from '../components/ComparisonTable.vue';

const router = useRouter();
const comparisonStore = useComparisonStore();

const hasProducts = computed(() => comparisonStore.hasProducts);
const selectedProducts = computed(() => comparisonStore.selectedProducts);

const goBack = () => {
  router.push('/products');
};

const goToProducts = () => {
  router.push('/products');
};
</script>

<style scoped>
.comparison-page {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.page-header {
  margin-bottom: 32px;
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  padding: 8px 0;
  display: inline-block;
  transition: color 0.2s;
}

.back-button:hover {
  color: #0056b3;
}

.page-header h1 {
  font-size: 36px;
  color: #333;
}

.empty-state,
.warning-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon,
.warning-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.empty-state h2,
.warning-state h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 16px;
}

.empty-state p,
.warning-state p {
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
}

.btn-primary {
  padding: 14px 32px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }
  
  .empty-state h2,
  .warning-state h2 {
    font-size: 24px;
  }
  
  .empty-icon,
  .warning-icon {
    font-size: 60px;
  }
}
</style>