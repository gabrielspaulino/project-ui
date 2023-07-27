<template>
  <div></div>
</template>

<script>

let response = await fetch('http://localhost:8080/users');
const users = await response.json();
response = await fetch('http://localhost:8080/orders');
const orders = await response.json();
response = await fetch('http://localhost:8080/products');
const products = await response.json();
response = await fetch('http://localhost:8080/categories');
const categories = await response.json();
//console.log(users)

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    users: users,
    orders: orders,
    products: products,
    categories: categories
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
