<template>
  <div class="order-detail-page">
    <div class="container">
      <button class="back-button" @click="goBack">
        ← Back to Orders
      </button>

      <div v-if="loading" class="loading">Loading order details...</div>

      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="order" class="order-detail">
        <div class="order-header-section card">
          <div class="header-top">
            <div>
              <h1>Order #{{ order.id }}</h1>
              <p class="order-date">Placed on {{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="order-status" :class="getStatusClass(order.status)">
              {{ order.status }}
            </div>
          </div>

          <div class="order-actions" v-if="order.status === 'PENDING'">
            <button class="btn-danger" @click="cancelOrder" :disabled="cancelling">
              {{ cancelling ? 'Cancelling...' : 'Cancel Order' }}
            </button>
          </div>
        </div>

        <div class="order-content">
          <div class="order-main">
            <div class="card">
              <h2>Order Items</h2>
              <div class="order-items">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <img :src="item.product?.imageUrl || '/placeholder.jpg'" :alt="item.product?.name" />
                  <div class="item-details">
                    <h3>{{ item.product?.name || 'Product' }}</h3>
                    <p class="item-sku">SKU: {{ item.product?.id || 'N/A' }}</p>
                    <div class="item-quantity">
                      <span>Quantity: {{ item.quantity }}</span>
                      <span class="item-unit-price">${{ item.price.toFixed(2) }} each</span>
                    </div>
                  </div>
                  <div class="item-total">
                    <span class="total-label">Total</span>
                    <span class="total-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card" v-if="order.shippingAddress">
              <h2>Shipping Address</h2>
              <div class="address-info">
                <p class="address-name">{{ order.shippingAddress.fullName }}</p>
                <p>{{ order.shippingAddress.address }}</p>
                <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
                <p>{{ order.shippingAddress.country }}</p>
              </div>
            </div>

            <div class="card" v-if="order.contactEmail || order.contactPhone">
              <h2>Contact Information</h2>
              <div class="contact-info">
                <p v-if="order.contactEmail">
                  <strong>Email:</strong> {{ order.contactEmail }}
                </p>
                <p v-if="order.contactPhone">
                  <strong>Phone:</strong> {{ order.contactPhone }}
                </p>
              </div>
            </div>

            <div class="card" v-if="order.notes">
              <h2>Order Notes</h2>
              <p class="order-notes">{{ order.notes }}</p>
            </div>
          </div>

          <div class="order-sidebar">
            <div class="card">
              <h2>Order Summary</h2>
              <div class="summary-details">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>${{ calculateSubtotal().toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div class="summary-row">
                  <span>Tax:</span>
                  <span>${{ calculateTax().toFixed(2) }}</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>${{ order.totalAmount?.toFixed(2) || '0.00' }}</span>
                </div>
              </div>
            </div>

            <div class="card">
              <h2>Order Timeline</h2>
              <div class="timeline">
                <div class="timeline-item active">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <p class="timeline-title">Order Placed</p>
                    <p class="timeline-date">{{ formatDate(order.createdAt) }}</p>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: isStatusActive('PROCESSING') }">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <p class="timeline-title">Processing</p>
                    <p class="timeline-date">{{ order.status === 'PROCESSING' ? 'In progress' : 'Pending' }}</p>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: isStatusActive('SHIPPED') }">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <p class="timeline-title">Shipped</p>
                    <p class="timeline-date">{{ order.status === 'SHIPPED' ? 'In transit' : 'Pending' }}</p>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: isStatusActive('DELIVERED') }">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <p class="timeline-title">Delivered</p>
                    <p class="timeline-date">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { orderAPI } from '../api/orders';

const router = useRouter();
const route = useRoute();

const order = ref(null);
const loading = ref(false);
const error = ref(null);
const cancelling = ref(false);

onMounted(async () => {
  await fetchOrderDetails();
});

const fetchOrderDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const orderId = route.params.id;
    const response = await orderAPI.getById(orderId);
    order.value = response.data;
  } catch (err) {
    error.value = 'Failed to load order details';
    console.error('Error fetching order:', err);
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

const calculateSubtotal = () => {
  if (!order.value?.items) return 0;
  return order.value.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateTax = () => {
  return calculateSubtotal() * 0.1; // 10% tax
};

const isStatusActive = (status) => {
  const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentIndex = statusOrder.indexOf(order.value?.status?.toUpperCase());
  const checkIndex = statusOrder.indexOf(status);
  return currentIndex >= checkIndex;
};

const cancelOrder = async () => {
  if (!confirm('Are you sure you want to cancel this order?')) return;

  cancelling.value = true;
  try {
    await orderAPI.cancel(order.value.id);
    await fetchOrderDetails(); // Refresh order details
    alert('Order cancelled successfully');
  } catch (err) {
    alert('Failed to cancel order');
    console.error('Error cancelling order:', err);
  } finally {
    cancelling.value = false;
  }
};

const goBack = () => {
  router.push('/orders');
};
</script>

<style scoped>
.order-detail-page {
  padding: 40px 0;
  min-height: calc(100vh - 56px);
}

.back-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 8px 0;
  transition: color 0.2s;
}

.back-button:hover {
  color: var(--primary-hover);
}

.order-header-section {
  margin-bottom: 32px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

h1 {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.order-date {
  font-size: 14px;
  color: var(--text-secondary);
}

.order-status {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
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

.order-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
}

.order-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h2 {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.order-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.item-sku {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-bottom: 8px;
}

.item-quantity {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text-secondary);
}

.item-unit-price {
  color: var(--text-tertiary);
}

.item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.total-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.total-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.address-info, .contact-info {
  line-height: 1.8;
  color: var(--text-secondary);
}

.address-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.contact-info p {
  margin-bottom: 8px;
}

.order-notes {
  color: var(--text-secondary);
  line-height: 1.6;
}

.order-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text-secondary);
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
}

.summary-row.total {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 4px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  position: relative;
  opacity: 0.4;
}

.timeline-item.active {
  opacity: 1;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 7px;
  top: 40px;
  bottom: -16px;
  width: 2px;
  background: var(--border-color);
}

.timeline-item.active:not(:last-child)::after {
  background: var(--primary-color);
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  flex-shrink: 0;
  margin-top: 2px;
}

.timeline-item.active .timeline-dot {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
  font-size: 14px;
}

.timeline-date {
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 968px) {
  .order-content {
    grid-template-columns: 1fr;
  }

  .order-sidebar {
    order: -1;
  }

  h1 {
    font-size: 24px;
  }

  .header-top {
    flex-direction: column;
    gap: 16px;
  }
}
</style>