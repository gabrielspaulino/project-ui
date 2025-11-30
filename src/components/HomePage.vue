<template>
    <div v-if="user">
        Welcome, {{ user.name }} <br>
    </div>
    <div v-else>Hello, sign in to your account</div>
    <router-link to="/orders"><button id="ordersButton">My orders</button></router-link>
    <router-link to="/cart"><button id="cartButton">My cart</button></router-link>
    <button id="logoutButton" @click="handleLogout">Logout</button>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import axiosInstance from '@/config/axiosConfig';
import authService from '@/services/authService';
import ProductCard from './ProductCard.vue';

export default {
    name: 'HomePage',
    components: {
        ProductCard
    },
    setup() {
        const router = useRouter();
        const products = ref([]);
        const categories = ref([]);
        const user = ref(null);
        const loading = ref(false);
        const error = ref('');
        
        // Initialize cart items globally
        if (!window.cartItems) {
            window.cartItems = [];
        }

        // Fetch all data
        const fetchData = async () => {
            loading.value = true;
            error.value = '';
            
            try {
                // All these requests automatically include the JWT token
                const [productsRes, categoriesRes, usersRes] = await Promise.all([
                    axiosInstance.get('/products'),
                    axiosInstance.get('/categories'),
                    axiosInstance.get('/users')
                ]);
                
                products.value = productsRes.data;
                categories.value = categoriesRes.data;
                
                // Get current user from cookie (you might want to improve this)
                const userId = document.cookie;
                user.value = usersRes.data.find(u => u.id.toString() === userId);
            } catch (err) {
                console.error('Error fetching data:', err);
                error.value = 'Failed to load data. Please try again.';
                
                // If unauthorized, redirect to login
                if (err.response?.status === 401) {
                    authService.logout();
                    router.push('/login');
                }
            } finally {
                loading.value = false;
            }
        };

        // Add product to cart
        const addToCart = async (product) => {
            // Get fresh user data
            const userId = document.cookie;
            
            if (!userId || userId === 'null') {
                window.alert("Please sign in to add items to your cart.");
                router.push('/login');
                return;
            }
            
            try {
                // Fetch current user
                const response = await axiosInstance.get('/users');
                const currentUser = response.data.find(u => u.id.toString() === userId);
                
                if (currentUser) {
                    window.cartItems.push({
                        "moment": moment.utc().format(),
                        "orderStatus": "",
                        "client": {
                            "id": currentUser.id,
                            "name": currentUser.name,
                            "email": currentUser.email,
                            "phone": currentUser.phone,
                            "password": currentUser.password
                        },
                        "items": [{
                            "quantity": 1,
                            "price": product.price,
                            "product": product,
                            "subTotal": product.price
                        }],
                        "payment": null,
                        "total": function(items, price) {
                            return items.reduce(function(a, b) {
                                return a + b[price];
                            }, 0);
                        }
                    });
                    
                    window.alert("Product added to your cart.");
                } else {
                    window.alert("User not found. Please sign in again.");
                    router.push('/login');
                }
            } catch (err) {
                console.error('Error adding to cart:', err);
                window.alert("Failed to add product to cart.");
            }
        };

        // Handle logout
        const handleLogout = () => {
            if (document.cookie && document.cookie !== "null") {
                document.cookie = "null";
                authService.logout();
                router.push('/login');
            }
        };

        // Load data on mount
        onMounted(() => {
            fetchData();
        });

        return {
            products,
            categories,
            user,
            loading,
            error,
            addToCart,
            handleLogout
        };
    }
}
</script>

<style scoped>
    .productCard {
        width: 360px;
        border-radius: 10px;
        border: 2px solid blueviolet;
        margin: 5px;
    }
    
    button {
        margin: 5px;
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
        font-size: 1.2rem;
    }
    
    .error {
        background-color: #fee;
        color: #c33;
        padding: 1rem;
        border-radius: 4px;
        margin: 1rem 0;
        text-align: center;
    }
    
    .categorySection {
        margin-bottom: 2rem;
    }
    
    .productsSection {
        display: inline-block;
    }
    
    #categoryName {
        color: #333;
        margin: 1rem 0;
    }
</style>