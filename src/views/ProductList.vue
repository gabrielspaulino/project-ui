<template>
  <div class="product-list-page">
    <div class="container">
      <div class="page-header">
        <h1>Products</h1>
        <p class="subtitle">Discover our amazing collection</p>
      </div>

      <div class="filters-section">
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search products..."
            @input="handleSearch"
          />
        </div>

        <div class="filter-options">
          <select v-model="selectedCategory" @change="handleCategoryChange">
            <option value="">All Categories</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <div class="price-filter">
            <input 
              v-model.number="minPrice" 
              type="number" 
              placeholder="Min Price"
              @input="handlePriceFilter"
            />
            <span>-</span>
            <input 
              v-model.number="maxPrice" 
              type="number" 
              placeholder="Max Price"
              @input="handlePriceFilter"
            />
          </div>

          <button class="btn-secondary" @click="clearFilters">Clear Filters</button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        Loading products...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else-if="filteredProducts.length === 0" class="no-products">
        <p>No products found. Try adjusting your filters.</p>
      </div>

      <div v-else>
        <div class="products-grid grid grid-4">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <div v-if="pagination.total > pagination.pageSize" class="pagination">
          <button 
            class="btn-secondary" 
            :disabled="pagination.page === 1"
            @click="previousPage"
          >
            Previous
          </button>
          <span class="page-info">
            Page {{ pagination.page }} of {{ totalPages }}
          </span>
          <button 
            class="btn-secondary" 
            :disabled="pagination.page >= totalPages"
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '../stores/products';
import ProductCard from '../components/ProductCard.vue';

const productStore = useProductStore();

const searchQuery = ref('');
const selectedCategory = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);

const loading = computed(() => productStore.loading);
const error = computed(() => productStore.error);
const filteredProducts = computed(() => productStore.filteredProducts);
const pagination = computed(() => productStore.pagination);
const availableCategories = computed(() => productStore.allCategories);

const totalPages = computed(() => 
  Math.ceil(pagination.value.total / pagination.value.pageSize)
);

onMounted(() => {
  productStore.fetchProducts();
});

const handleSearch = () => {
  productStore.setFilter('search', searchQuery.value);
};

const handleCategoryChange = () => {
  productStore.setFilter('category', selectedCategory.value);
  productStore.fetchProducts();
};

const handlePriceFilter = () => {
  productStore.setFilter('minPrice', minPrice.value);
  productStore.setFilter('maxPrice', maxPrice.value);
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  minPrice.value = null;
  maxPrice.value = null;
  productStore.clearFilters();
  productStore.fetchProducts();
};

const previousPage = () => {
  if (pagination.value.page > 1) {
    productStore.setPage(pagination.value.page - 1);
  }
};

const nextPage = () => {
  if (pagination.value.page < totalPages.value) {
    productStore.setPage(pagination.value.page + 1);
  }
};
</script>

<style scoped>
.product-list-page {
  padding: 40px 0;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 36px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 18px;
  color: var(--text-secondary);
}

.filters-section {
  background: var(--card-bg);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.search-bar {
  margin-bottom: 16px;
}

.search-bar input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.filter-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-options select {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 14px;
}

.price-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-filter input {
  width: 120px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.price-filter span {
  color: var(--text-secondary);
}

.products-grid {
  margin-bottom: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-info {
  font-weight: 600;
  color: #666;
}

.no-products {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  font-size: 18px;
}

.no-products p {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }
  
  .filter-options {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-options select,
  .price-filter {
    width: 100%;
  }
  
  .price-filter input {
    flex: 1;
  }
  
  .btn-secondary {
    width: 100%;
  }
}
</style>