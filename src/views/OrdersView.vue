<template>
    <div class="home">
      <OrdersPage :cart="this.cart" :cartItems="this.cartItems"/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import OrdersPage from '@/components/OrdersPage.vue'
  export default {
    name: 'OrdersView',
    components: {
        OrdersPage
    },
    data() {
      return {
        cart: this.$route.params.cart,
        cartItems: this.$route.params.cartItems
      }
    }
  }
  </script>
  