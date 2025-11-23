import { defineStore } from 'pinia';
import { comparisonAPI } from '../api/comparison';

export const useComparisonStore = defineStore('comparison', {
  state: () => ({
    selectedProducts: [],
    comparisonData: null,
    loading: false,
    error: null,
    maxProducts: 4
  }),

  getters: {
    canAddMore: (state) => state.selectedProducts.length < state.maxProducts,
    hasProducts: (state) => state.selectedProducts.length > 0,
    productIds: (state) => state.selectedProducts.map(p => p.id)
  },

  actions: {
    addProduct(product) {
      if (this.selectedProducts.length >= this.maxProducts) {
        throw new Error(`Maximum ${this.maxProducts} products can be compared`);
      }
      
      if (!this.selectedProducts.find(p => p.id === product.id)) {
        this.selectedProducts.push(product);
      }
    },

    removeProduct(productId) {
      this.selectedProducts = this.selectedProducts.filter(p => p.id !== productId);
      if (this.selectedProducts.length === 0) {
        this.comparisonData = null;
      }
    },

    clearAll() {
      this.selectedProducts = [];
      this.comparisonData = null;
    },

    async compareProducts() {
      if (this.selectedProducts.length < 2) {
        throw new Error('At least 2 products are required for comparison');
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await comparisonAPI.compare(this.productIds);
        this.comparisonData = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Error comparing products:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchComparison() {
      if (this.selectedProducts.length === 0) return;

      this.loading = true;
      this.error = null;

      try {
        const response = await comparisonAPI.getComparison(this.productIds);
        this.comparisonData = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching comparison:', error);
      } finally {
        this.loading = false;
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'comparison',
        storage: localStorage,
        paths: ['selectedProducts']
      }
    ]
  }
});