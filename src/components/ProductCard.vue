<template>
    <div class="productBox">
        <h3>{{ product.name }}</h3>
        {{ product.description }} <br>
        R$ {{ product.price.toFixed(2).replace(".", ",") }} <br>
        <button>Add to cart</button>
    </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: Object
  }
}
</script>

<style>
.productBox {
  background-color: blueviolet;
  color: white;
  padding: 10px;
  border-radius: 10px;
}

button {
  background-color: white;
  color: blueviolet;
  border: none;
  border-radius: 5px;
}
</style>