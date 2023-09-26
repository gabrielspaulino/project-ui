<template>
    <div class="productBox">
      <img v-if="product.categories[0].id===1" src="../assets/eletronicsIcon.png">
      <img v-if="product.categories[0].id===2" src="../assets/booksIcon.png">
      <img v-if="product.categories[0].id===3" src="../assets/computersIcon.png">
        <h3>{{ product.name }}</h3>
        {{ product.description }} <br>
        R$ {{ product.price.toFixed(2).replace(".", ",") }} <br>
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
h3 {
  margin: 0px;
}

img {
  filter: invert(1);
  width: 30px;
}

.productBox {
  background-color: blueviolet;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  height: 100px;
  margin: 10px;
  margin-bottom: 0;
}
</style>