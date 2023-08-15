<template>
    <h1>Products</h1>
    <div class="categorySection" v-for="category in categories" :key="category.id">
        <h2>{{ category.name }}</h2>
        <div class="productsSection" v-for="product in products" :key="product.id">
        <div v-if="Object.keys(product.categories).length > 0 && product.categories[0].id === category.id">
            <ProductCard :product="product"/>
        </div>
        </div>
    </div>
</template>

<script>
import ProductCard from './ProductCard.vue'

let response = await fetch('http://localhost:8080/orders');
const ordersResponse = await response.json();
response = await fetch('http://localhost:8080/products');
const productsResponse = await response.json();
response = await fetch('http://localhost:8080/categories');
const categoriesResponse = await response.json();

export default {
    name: 'HomePage',
    data() {
        return {
            orders: ordersResponse,
            products: productsResponse,
            categories: categoriesResponse
        };
    },
    components: {
        ProductCard
    },
}
</script>