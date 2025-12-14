<template>
  <div class="checkout-page">
    <div class="container">
      <h1>Checkout</h1>

      <div v-if="!hasItems" class="empty-state">
        <p>Your cart is empty</p>
        <button class="btn-primary" @click="goToProducts">Continue Shopping</button>
      </div>

      <div v-else class="checkout-grid">
        <div class="checkout-form">
          <div class="card">
            <h2>Shipping Information</h2>
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Full Name *</label>
                <input v-model="form.fullName" type="text" required />
              </div>

              <div class="form-group">
                <label>Email *</label>
                <input v-model="form.email" type="email" required />
              </div>

              <div class="form-group">
                <label>Phone *</label>
                <input v-model="form.phone" type="tel" required />
              </div>

              <div class="form-group">
                <label>Address *</label>
                <input v-model="form.address" type="text" required />
              </div>

              <div class="form-group">
                <label>Supplement</label>
                <input v-model="form.notes" type="text"></input>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>City *</label>
                  <input v-model="form.city" type="text" required />
                </div>
                <div class="form-group">
                  <label>State *</label>
                  <input v-model="form.state" type="text" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>ZIP Code *</label>
                  <input v-model="form.zipCode" type="text" required />
                </div>
                <div class="form-group">
                  <label>Country *</label>
                  <input v-model="form.country" type="text" required />
                </div>
              </div>

              <button 
                type="submit" 
                class="btn-primary btn-large" 
                :disabled="loading"
              >
                {{ loading ? 'Processing...' : 'Place Order' }}
              </button>

              <div v-if="error" class="error-message">{{ error }}</div>
            </form>
          </div>
        </div>

        <div class="order-summary">
          <div class="card">
            <h2>Order Summary</h2>
            <div class="summary-items">
              <div v-for="item in items" :key="item.productId" class="summary-item">
                <img :src="item.imageUrl || '/placeholder.jpg'" :alt="item.name" />
                <div class="summary-item-details">
                  <h4>{{ item.name }}</h4>
                  <p>Qty: {{ item.quantity }}</p>
                </div>
                <span class="summary-item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="summary-totals">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref(null);

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  notes: ''
});

const items = computed(() => cartStore.items);
const hasItems = computed(() => cartStore.hasItems);
const subtotal = computed(() => cartStore.subtotal);
const total = computed(() => cartStore.total);
const user = computed(() => authStore.user);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const orderData = {
      moment: new Date().toISOString().split('.')[0] + 'Z',
      orderStatus: 'WAITING_PAYMENT',
      client: user.value,
      address: {
        address: form.value.address,
        supplement: form.value.notes,
        city: form.value.city,
        state: form.value.state,
        country: form.value.country,
        zipCode: form.value.zipCode
      },
      items: items.value.map(item => ({
        quantity: item.quantity,
        price: item.price,
        product: { id: item.productId }
      }))
    };

    const order = await cartStore.checkout(orderData);
    
    // Redirect to order confirmation
    router.push(`/orders/${order.id}`);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to place order. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goToProducts = () => {
  router.push('/products');
};
</script>

<style scoped>
.checkout-page {
  padding: 40px 0;
}

h1 {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 32px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state p {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

h2 {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 14px;
}

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

textarea {
  resize: vertical;
}

.btn-large {
  width: 100%;
  padding: 14px;
  font-size: 16px;
}

.order-summary {
  position: sticky;
  top: 72px;
  height: fit-content;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.summary-item-details {
  flex: 1;
}

.summary-item-details h4 {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.summary-item-details p {
  font-size: 12px;
  color: var(--text-secondary);
}

.summary-item-price {
  font-weight: 600;
  color: var(--text-primary);
}

.summary-totals {
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
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

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 968px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}
</style>