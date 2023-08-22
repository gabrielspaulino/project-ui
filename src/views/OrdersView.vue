<template>
    <div class="home">
      <OrdersPage/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import OrdersPage from '@/components/OrdersPage.vue'
  
  export default {
    name: 'OrdersView',
    components: {
        OrdersPage
    }
  }
  </script>
  