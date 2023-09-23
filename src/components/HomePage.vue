<template>
    <div v-if="user">
        Welcome, {{ user.name }} <br>
    </div>
    <div v-else>Hello, sign in to your account</div>
    <router-link to="/orders"><button id="ordersButton">My orders</button></router-link>
    <router-link to="/cart"><button id="cartButton">My cart</button></router-link>
    <button id="logoutButton">Logout</button>
    <h1>Products</h1>
    <div class="categorySection" v-for="category in categories" :key="category.id">
        <h2 id="categoryName">{{ category.name }}</h2>
        <div class="productsSection" v-for="product in products" :key="product.id">
            <div v-if="Object.keys(product.categories).length > 0 && product.categories[0].id === category.id" class="productCard">
                <ProductCard :product="product"/>
                <button id="addToCartButton" v-on:click="addToCart(product)">Add to cart</button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import ProductCard from './ProductCard.vue'

let response = await fetch('http://localhost:8080/products');
const productsResponse = await response.json();
response = await fetch('http://localhost:8080/categories');
const categoriesResponse = await response.json();
response = await fetch('http://localhost:8080/users');
const usersResponse = await response.json();
window.cartItems = []

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
    methods: {
        async addToCart(product) {
            let user = usersResponse.find(user => user.id.toString() === document.cookie)
            if (user) {
                window.cartItems.push(
                {
                    "moment": moment.utc().format(),
                    "orderStatus": "",
                    "client": {
                        "id":user.id,
                        "name":user.name,
                        "email":user.email,
                        "phone":user.phone,
                        "password":user.password
                    },
                    "items": [{
                        "quantity":1,
                        "price": product.price,
                        "product": product,
                        "subTotal": product.price
                    }],
                    "payment": null,
                    "total": function(items, price) {
                        return items.reduce( function(a, b){
                            return a + b[price];
                        }, 0);
                    }
                })
                window.alert("Product added to your cart.")
            } else {
                window.alert("Please sign in to add items to your cart.")
            }
        }
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

<style>
    .productCard {
        width: 360px;
        border-radius: 10px;
        border: 2px solid blueviolet;
    }
</style>