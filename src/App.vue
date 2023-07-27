<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <div v-if="users">
      <h5>Users</h5>
      <ul class="mb-0">
          <li v-for="user in users" :key="user.id">{{user}}</li>
      </ul>
  </div>
  <div v-if="orders">
      <h5>Orders</h5>
      <ul class="mb-0">
          <li v-for="order in orders" :key="order.id">{{order}}</li>
      </ul>
  </div>
  <div v-if="products">
      <h5>Products</h5>
      <ul class="mb-0">
          <li v-for="product in products" :key="product.id">{{product}}</li>
      </ul>
  </div>
  <div v-if="categories">
      <h5>Categories</h5>
      <ul class="mb-0">
          <li v-for="category in categories" :key="category.id">{{category}}</li>
      </ul>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  data(){
    return{
      users: HelloWorld.props.users,
      orders: HelloWorld.props.orders,
      products: HelloWorld.props.products,
      categories: HelloWorld.props.categories
    }
  },
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
