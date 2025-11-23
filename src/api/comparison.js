import apiClient from './config';

export const comparisonAPI = {
  getComparison(productIds) {
    return apiClient.get('/products/compare', {
      params: { productIds: productIds.join(',') }
    });
  }
};