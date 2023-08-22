<template>
    <h2>Your orders</h2>
    <div class="ordersSection" v-for="order in orders" :key="order.id">
        <OrderCard :order="order"></OrderCard>
    </div>
</template>

<script>
import OrderCard from './OrderCard.vue'

let response = await fetch('http://localhost:8080/orders');
const ordersResponse = await response.json();

export default {
    name: 'HomePage',
    data() {
        return {
            orders: ordersResponse ? ordersResponse.filter(order => order.client.id.toString() === document.cookie) : null
        };
    },
    components: {
        OrderCard
    }
}
</script>