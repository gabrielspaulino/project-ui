<template>
    <h2 v-if="!cart">Your orders</h2>
    <h2 v-else>Your cart</h2>
    <div class="cartSection" v-if="cart">
        <div v-for="cartItem in this.cartItems" :key="cartItem.id">
            <OrderCard :order="cartItem"></OrderCard>
        </div>
    </div>
    <div class="ordersSection" v-else>
        <div v-for="order in orders" :key="order.id">
            <OrderCard :order="order"></OrderCard>
        </div>
    </div>
    <button v-on:click="finalizeOrder()">Finalize order</button>
</template>

<script>
import moment from 'moment';
import OrderCard from './OrderCard.vue'

let response = await fetch('http://localhost:8080/orders');
const ordersResponse = await response.json();
response = await fetch('http://localhost:8080/users');
const usersResponse = await response.json();
export default {
    name: 'HomePage',
    data() {
        return {
            orders: ordersResponse ? ordersResponse.filter(order => order.client.id.toString() === document.cookie) : null,
            cart: this.$route.meta.cart,
            cartItems: window.cartItems
        };
    },
    components: {
        OrderCard
    },
    methods: {
        async finalizeOrder() {
            let items = []
            window.cartItems.forEach(cartItem => {
                cartItem.items.forEach(item => {
                    if (items.some(itemInArray => itemInArray.product.id === item.product.id)) {
                        items.find(itemInArray => itemInArray.product.id === item.product.id).quantity += 1
                    } else {
                        items.push(item)
                    }
                })
            })

            let user = usersResponse.find(user => user.id.toString() === document.cookie)
            if (!user) {
                window.alert("Please sign in to finalize your order.")
                return
            }
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8080/orders", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                "moment": moment.utc().format(),
                "orderStatus": "WAITING_PAYMENT",
                "client": {
                    "id":user.id,
                    "name":user.name,
                    "email":user.email,
                    "phone":user.phone,
                    "password":user.password
                },
                "items": items,
                "payment": null,
                "total": function(items, price) {
                    return items.reduce( function(a, b){
                        return a + b[price];
                    }, 0);
                }
            }));
            window.alert("Your order was finalized.")
        }
    }
}
</script>