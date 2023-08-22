<template>
    <div class="orderBox">
      <header id="orderDate">Order made in {{ order.moment.slice(0, 4) + "/" + order.moment.slice(5, 7) + "/" + order.moment.slice(8, 10) }} - ID: {{ order.id }}</header>
      <br><div class="itemsSection" v-for="item in order.items" :key="item.id">
        {{ item.product.name }}<br>
        Quantity: {{ item.quantity }} <br>
        Price: ${{ item.price }} <br>
        Subtotal: ${{ item.subTotal }}<br><br>
      </div>
      <br>Order status: {{ order.orderStatus.replace("_", " ") }}
    </div>
</template>

<script>
export default {
  name: 'OrderCard',
  props: {
    order: Object
  }
}
</script>

<style>
h3 {
  margin: 0px;
}

img {
  filter: invert(1);
  width: 30px;
}

#orderDate {
  background-color: rgb(239, 239, 239);
  padding: 10px;
  border-bottom: lightgray 2px solid;
}

.itemsSection {
  display: flex inline;
  text-align: start;
  background-color: white;
  padding: 10px;
  margin: 5px;
  border: lightgray 2px solid;
  border-radius: 10px;
  width: 190px;
}

.orderBox {
  border: lightgray solid 2px;
  padding: 0;
  border-radius: 10px;
  margin: 10px;
}

button {
  background-color: white;
  font-size: 1em;
  color: blueviolet;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
}
</style>