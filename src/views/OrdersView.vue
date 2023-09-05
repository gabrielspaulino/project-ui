<template>
    <div class="home">
      <OrdersPage :cart="cart"/>
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
    props: {
      cart: Boolean
    }
  }
  </script>
  