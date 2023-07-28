<template>
  <h1>Products</h1>
  <div class="productsSection" v-for="product in products" :key="product.id">
    <ProductCard :product="product"/>
  </div>
</template>

<script>
import ProductCard from './components/ProductCard.vue'

let response = await fetch('http://localhost:8080/users');
const usersResponse = await response.json();
response = await fetch('http://localhost:8080/orders');
const ordersResponse = await response.json();
response = await fetch('http://localhost:8080/products');
const productsResponse = await response.json();
response = await fetch('http://localhost:8080/categories');
const categoriesResponse = await response.json();

console.log(productsResponse)
export default {
    name: "App",
    data() {
        return {
            users: usersResponse,
            orders: ordersResponse,
            products: productsResponse,
            categories: categoriesResponse
        };
    },
    components: { 
        ProductCard
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

.productsSection {
    display: flex inline;
    margin: 10px;
}
</style>
