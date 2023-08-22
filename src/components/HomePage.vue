<template>
    <div v-if="user">Welcome, {{ user.name }}</div>
    <div v-else>Hello, sign in to your account</div>
    <router-link to="/orders"><button id="ordersButton">My orders</button></router-link>
    <button id="logoutButton">Logout</button>
    <h1>Products</h1>
    <div class="categorySection" v-for="category in categories" :key="category.id">
        <h2 id="categoryName">{{ category.name }}</h2>
        <div class="productsSection" v-for="product in products" :key="product.id">
        <div v-if="Object.keys(product.categories).length > 0 && product.categories[0].id === category.id">
            <ProductCard :product="product"/>
        </div>
        </div>
    </div>
</template>

<script>
import ProductCard from './ProductCard.vue'

let response = await fetch('http://localhost:8080/products');
const productsResponse = await response.json();
response = await fetch('http://localhost:8080/categories');
const categoriesResponse = await response.json();
response = await fetch('http://localhost:8080/users');
const usersResponse = await response.json();

export default {
    name: 'HomePage',
    data() {
        return {
            products: productsResponse,
            categories: categoriesResponse,
            user: usersResponse.find(user => user.id.toString() === document.cookie)
        };
    },
    components: {
        ProductCard
    },
    mounted() {
    document.getElementById("logoutButton").addEventListener("click", () => {
        if (document.cookie != "null") {
            document.cookie = null
            window.location.reload()
        }
    })
  }
}
</script>