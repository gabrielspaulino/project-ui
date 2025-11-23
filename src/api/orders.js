import apiClient from './config';

export const orderAPI = {
  // Get all orders for current user
  getAll(params = {}) {
    return apiClient.get('/orders', { params });
  },

  // Get order by ID
  getById(id) {
    return apiClient.get(`/orders/${id}`);
  },

  // Create new order
  create(orderData) {
    return apiClient.post('/orders', orderData);
  },

  // Update order status (admin)
  updateStatus(id, status) {
    return apiClient.put(`/orders/${id}/status`, { status });
  },

  // Cancel order
  cancel(id) {
    return apiClient.post(`/orders/${id}/cancel`);
  },

  // Get order history
  getHistory(params = {}) {
    return apiClient.get('/orders/history', { params });
  }
};