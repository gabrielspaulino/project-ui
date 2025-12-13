import { defineStore } from 'pinia';
import { orderAPI } from '../api/orders';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    isCartOpen: false
  }),

  getters: {
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },

    total: (state) => {
      // You can add tax, shipping, etc. here
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },

    hasItems: (state) => state.items.length > 0
  },

  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imgUrl,
          quantity: quantity
        });
      }
    },

    removeItem(productId) {
      const index = this.items.findIndex(item => item.productId === productId);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.productId === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    clearCart() {
      this.items = [];
    },

    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },

    closeCart() {
      this.isCartOpen = false;
    },

    async checkout(orderData) {
      this.loading = true;
      this.error = null;

      try {
        // Prepare order items from cart
        const orderItems = this.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }));

        // Create order
        const response = await orderAPI.create({
          ...orderData,
          items: orderItems,
          totalAmount: this.total
        });

        // Clear cart after successful order
        this.clearCart();
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order';
        console.error('Checkout failed:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'cart',
        storage: localStorage,
        paths: ['items']
      }
    ]
  }
});