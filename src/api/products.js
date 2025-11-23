import apiClient from './config';

export const productAPI = {
  // Get all products
  getAll(params = {}) {
    return apiClient.get('/products', { params });
  },

  // Get product by ID
  getById(id) {
    return apiClient.get(`/products/${id}`);
  },

  // Search products
  search(query, filters = {}) {
    return apiClient.get('/products/search', {
      params: { q: query, ...filters }
    });
  },

  // Get products by category
  getByCategory(category) {
    return apiClient.get(`/products/category/${category}`);
  },

  // Create product (admin)
  create(productData) {
    return apiClient.post('/products', productData);
  },

  // Update product (admin)
  update(id, productData) {
    return apiClient.put(`/products/${id}`, productData);
  },

  // Delete product (admin)
  delete(id) {
    return apiClient.delete(`/products/${id}`);
  }
};