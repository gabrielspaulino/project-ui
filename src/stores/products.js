import { defineStore } from 'pinia';
import { productAPI } from '../api/products';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    filters: {
      category: null,
      minPrice: null,
      maxPrice: null,
      search: ''
    },
    pagination: {
      page: 1,
      pageSize: 12,
      total: 0
    }
  }),

  getters: {
    filteredProducts: (state) => {
      let products = [...state.products];
      
      if (state.filters.category) {
        products = products.filter(p => {
          // Handle both single category string and categories array
          if (Array.isArray(p.categories)) {
            return p.categories.some(cat => 
              cat.name.toLowerCase() === state.filters.category.toLowerCase()
            );
          } else if (p.category) {
            return p.category.toLowerCase() === state.filters.category.toLowerCase();
          }
          return false;
        });
      }
      
      if (state.filters.minPrice !== null) {
        products = products.filter(p => p.price >= state.filters.minPrice);
      }
      
      if (state.filters.maxPrice !== null) {
        products = products.filter(p => p.price <= state.filters.maxPrice);
      }
      
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        products = products.filter(p => {
          // Search in name and description
          const nameMatch = p.name.toLowerCase().includes(search);
          const descMatch = p.description?.toLowerCase().includes(search);
          
          // Also search in categories
          let categoryMatch = false;
          if (Array.isArray(p.categories)) {
            categoryMatch = p.categories.some(cat => 
              cat.name.toLowerCase().includes(search)
            );
          }
          
          return nameMatch || descMatch || categoryMatch;
        });
      }
      
      return products;
    },
    
    // Helper getter to get all unique categories from products
    allCategories: (state) => {
      const categoriesSet = new Set();
      state.products.forEach(product => {
        if (Array.isArray(product.categories)) {
          product.categories.forEach(cat => categoriesSet.add(cat.name));
        } else if (product.category) {
          categoriesSet.add(product.category);
        }
      });
      return Array.from(categoriesSet).sort();
    }
  },

  actions: {
    async fetchProducts(params = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await productAPI.getAll({
          page: this.pagination.page,
          size: this.pagination.pageSize,
          ...params
        });
        
        this.products = response.data.content || response.data;
        this.pagination.total = response.data.totalElements || response.data.length;
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await productAPI.getById(id);
        this.currentProduct = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching product:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchProducts(query) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await productAPI.search(query, this.filters);
        this.products = response.data.content || response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Error searching products:', error);
      } finally {
        this.loading = false;
      }
    },

    setFilter(key, value) {
      this.filters[key] = value;
    },

    clearFilters() {
      this.filters = {
        category: null,
        minPrice: null,
        maxPrice: null,
        search: ''
      };
    },

    setPage(page) {
      this.pagination.page = page;
      this.fetchProducts();
    }
  }
});