<template>
  <div class="orders-page">
    <div class="container">
      <h1>My Orders</h1>

      <div v-if="loading" class="loading">Loading orders...</div>

      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="orders.length === 0" class="empty-state card">
        <div class="empty-icon">📦</div>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet.</p>
        <button class="btn-primary" @click="goToProducts">Start Shopping</button>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card card">
          <div class="order-header">
            <div class="order-info">
              <h3>Order #{{ order.id }}</h3>
              <p class="order-date">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="order-status" :class="getStatusClass(order.status)">
              {{ order.status }}
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <img :src="item.product?.imageUrl || '/placeholder.jpg'" :alt="item.product?.name" />
              <div class="item-details">
                <h4>{{ item.product?.name || 'Product' }}</h4>
                <p>Quantity: {{ item.quantity }}</p>
              </div>
              <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <span>Total:</span>
              <span class="total-amount">${{ order.totalAmount?.toFixed(2) }}</span>
            </div>
            <button class="btn-primary" @click="viewOrderDetails(order.id)">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderAPI } from '../api/orders';

const router = useRouter();

const orders = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  await fetchOrders();
});

const fetchOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await orderAPI.getAll();
    orders.value = response.data;
  } catch (err) {
    error.value = 'Failed to load orders';
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status) => {
  const statusMap = {
    PENDING: 'status-pending',
    PROCESSING: 'status-processing',
    SHIPPED: 'status-shipped',
    DELIVERED: 'status-delivered',
    CANCELLED: 'status-cancelled'
  };
  return statusMap[status?.toUpperCase()] || 'status-pending';
};

const viewOrderDetails = (orderId) => {
  router.push(`/orders/${orderId}`);
};

const goToProducts = () => {
  router.push('/products');
};
</script>

<style scoped>
.orders-page {
  padding: 40px 0;
  min-height: calc(100vh - 56px);
}

h1 {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 32px;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 32px;
  font-size: 16px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.order-info h3 {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.order-date {
  font-size: 14px;
  color: var(--text-secondary);
}

.order-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: rgba(251, 191, 36, 0.2);
  color: #f59e0b;
}

.status-processing {
  background: rgba(59, 130, 246, 0.2);
  color: var(--primary-color);
}

.status-shipped {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
}

.status-delivered {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success-color);
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger-color);
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.item-details p {
  font-size: 13px;
  color: var(--text-secondary);
}

.item-price {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 16px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.order-total {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-total span:first-child {
  font-size: 14px;
  color: var(--text-secondary);
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }

  .order-header {
    flex-direction: column;
    gap: 12px;
  }

  .order-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .order-total {
    flex-direction: row;
    justify-content: space-between;
  }

  .btn-primary {
    width: 100%;
  }
}
</style>