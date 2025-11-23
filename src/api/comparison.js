import apiClient from './config';

export const comparisonAPI = {
  // Compare multiple products
  compare(productIds) {
    return apiClient.post('/products/compare', { productIds });
  },

  // Get comparison data
  getComparison(productIds) {
    return apiClient.get('/products/compare', {
      params: { ids: productIds.join(',') }
    });
  }
};