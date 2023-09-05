<template>
    <div v-if="user">
        Welcome, {{ user.name }} <br>
        <router-link to="/cart"><button>My cart</button></router-link>
    </div>
    <div v-else>Hello, sign in to your account</div>
    <router-link to="/orders"><button id="ordersButton">My orders</button></router-link>
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
            if (!user) {
                window.alert("Please sign in to add items to your cart.")
                return
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8080/orders", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                "moment": moment.utc().format(),
                "orderStatus": "IN_CART",
                "client": {
                    "id":1,
                    "name":user.name,
                    "email":user.email,
                    "phone":user.phone,
                    "password":user.password
                },
                "items": [
                    {
                        "quantity":1,
                        "price":product.price,
                        "subTotal":product.price,
                        "product":{
                            "id":product.id,
                            "name":product.name,
                            "description":product.description,
                            "price":product.price,
                            "imgUrl":product.imgUrl,
                            "categories":[
                                {
                                    "id":product.categories[0].id,
                                    "name":product.categories[0].name
                                }
                            ]
                        }
                    }
                ],
                "payment": null,
                "total": product.price
            }));
            window.alert("Product added to your cart.")
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