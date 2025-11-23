<template>
  <transition name="slide">
    <div v-if="show" class="cart-overlay" @click="$emit('close')">
      <div class="cart-sidebar" @click.stop>
        <div class="cart-header">
          <h2>Shopping Cart</h2>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>

        <div v-if="!hasItems" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <button class="btn-primary" @click="$emit('close')">Continue Shopping</button>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items">
            <div v-for="item in items" :key="item.productId" class="cart-item">
              <img :src="item.imageUrl || '/placeholder.jpg'" :alt="item.name" />
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <p class="item-price">${{ item.price.toFixed(2) }}</p>
                <div class="quantity-controls">
                  <button @click="decreaseQuantity(item.productId)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item.productId)">+</button>
                </div>
              </div>
              <button class="remove-btn" @click="removeItem(item.productId)">
                🗑️
              </button>
            </div>
          </div>

          <div class="cart-footer">
            <div class="cart-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>
            <button class="btn-primary btn-checkout" @click="goToCheckout">
              Proceed to Checkout
            </button>
            <button class="btn-secondary" @click="clearCart">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const router = useRouter();
const cartStore = useCartStore();

const items = computed(() => cartStore.items);
const hasItems = computed(() => cartStore.hasItems);
const subtotal = computed(() => cartStore.subtotal);
const total = computed(() => cartStore.total);

const increaseQuantity = (productId) => {
  const item = items.value.find(i => i.productId === productId);
  cartStore.updateQuantity(productId, item.quantity + 1);
};

const decreaseQuantity = (productId) => {
  const item = items.value.find(i => i.productId === productId);
  if (item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1);
  }
};

const removeItem = (productId) => {
  cartStore.removeItem(productId);
};

const clearCart = () => {
  if (confirm('Are you sure you want to clear the cart?')) {
    cartStore.clearCart();
  }
};

const goToCheckout = () => {
  emit('close');
  router.push('/checkout');
};
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.cart-sidebar {
  width: 100%;
  max-width: 420px;
  background: var(--card-bg);
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.cart-header h2 {
  font-size: 20px;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-primary);
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.5;
}

.empty-cart p {
  color: var(--text-secondary);
  font-size: 16px;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
  position: relative;
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-details h4 {
  font-size: 14px;
  color: var(--text-primary);
  margin: 0;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.quantity-controls button {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.quantity-controls button:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
}

.quantity-controls span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.remove-btn:hover {
  opacity: 1;
}

.cart-footer {
  border-top: 1px solid var(--border-color);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 14px;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.btn-checkout {
  width: 100%;
  padding: 14px;
  font-size: 16px;
}

.btn-secondary {
  width: 100%;
}

@media (max-width: 480px) {
  .cart-sidebar {
    max-width: 100%;
  }
}
</style>