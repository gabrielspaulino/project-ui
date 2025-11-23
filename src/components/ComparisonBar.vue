<template>
  <transition name="slide-up">
    <div v-if="hasProducts" class="comparison-bar">
      <div class="comparison-content">
        <div class="products-preview">
          <div v-for="product in selectedProducts" :key="product.id" class="product-chip">
            <img :src="product.imgUrl || '/placeholder.jpg'" :alt="product.name" />
            <span>{{ product.name }}</span>
            <button class="remove-btn" @click="removeProduct(product.id)">×</button>
          </div>
        </div>

        <div class="comparison-actions">
          <span class="product-count">{{ selectedProducts.length }} / {{ maxProducts }} products</span>
          <button class="btn-secondary" @click="clearAll">Clear All</button>
          <button 
            class="btn-primary" 
            @click="goToComparison"
            :disabled="selectedProducts.length < 2"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useComparisonStore } from '../stores/comparison';

const router = useRouter();
const comparisonStore = useComparisonStore();

const hasProducts = computed(() => comparisonStore.hasProducts);
const selectedProducts = computed(() => comparisonStore.selectedProducts);
const maxProducts = computed(() => comparisonStore.maxProducts);

const removeProduct = (productId) => {
  comparisonStore.removeProduct(productId);
};

const clearAll = () => {
  if (confirm('Are you sure you want to clear all selected products?')) {
    comparisonStore.clearAll();
  }
};

const goToComparison = () => {
  router.push('/comparison');
};
</script>

<style scoped>
.comparison-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 16px;
}

.comparison-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.products-preview {
  display: flex;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
}

.product-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-primary);
  padding: 8px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

.product-chip img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.product-chip span {
  font-size: 14px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comparison-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.product-count {
  font-size: 14px;
  color: var(--text-primary);
}

.btn-primary, .btn-secondary {
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid #ddd;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>