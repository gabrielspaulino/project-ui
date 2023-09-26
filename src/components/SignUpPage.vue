<template>
  <div class="box">
   
    <h1>Cadastrar-se</h1>

    <div class="in">
        <label for="name">Name</label>
        <div>  <input type="text" :value="username" placeholder="Nome" id="nameInput"></div>
    </div>

    <div class="in">
        <label for="phone">Telefone</label>
        <div>  <input type="text" :value="username" placeholder="Telefone (com DDD)" id="phoneInput" maxlength="11"></div>
    </div>
   
    <div class="in">
        <label for="name">E-Mail</label>
        <div>  <input type="text" :value="username" placeholder="E-mail" id="emailInput"></div>
    </div>
  
    <div class="in">
      <label for="name">Senha</label>
      <div>
          <input :value="password" type="password" :name="string" placeholder="8 caracteres no mínimo" id="passwordInput" minlength="8" required/>
      </div>
    </div>

    <div class="in">
      <label for="name">Confirmar Senha</label>
      <div>
          <input :value="password" type="password" :name="string" placeholder="8 caracteres no mínimo" id="confirmPasswordInput" minlength="8" required/>
      </div>
    </div>
      <div id="signUpInfo"></div>
  
    <div>
        <button class="log" ref="submitButton" v-on:click="registerUser()">Cadastrar conta</button>
    </div>
  </div>
  
</template>
  
  
<script>
let response = await fetch('http://localhost:8080/users');
const usersResponse = await response.json();

export default {
data() {
  return {
    userLoggedIn: false,
    email:"",
    password: "",
    confirmPassword: "",
    name: "",
    phone: ""
  };
},
methods: {
  registerUser() {
    this.name = document.getElementById("nameInput").value
    this.phone = document.getElementById("phoneInput").value
    this.email = document.getElementById("emailInput").value
    this.password = document.getElementById("passwordInput").value
    this.confirmPassword = document.getElementById("confirmPasswordInput").value
    let user = usersResponse.find(user => user.email === this.email);
    if (!user) {
      if (this.password === this.confirmPassword) {
        if (this.validateInfo()) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8080/users", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
              "name": this.name,
              "email": this.email,
              "phone": this.phone,
              "password": this.password
            }))
            document.getElementById("signUpInfo").textContent = ""
            window.alert("User register successfully. Login to your account.")
            this.$router.push({ path: '/login' })
          } else {
            document.getElementById("signUpInfo").textContent = "Review your information"
          }
      } else {
        document.getElementById("signUpInfo").textContent = "Passwords are not equal"
      }
    } else {
        document.getElementById("signUpInfo").textContent = "This email is already registered"
    }
  },
  validateInfo() {
    return this.password.length > 7 && (this.phone.length === 10 || this.phone.length === 11) && this.email && this.name
  }
}
};
</script>

<style>
button {
background-color: blueviolet;
color: white;
padding: 5px 15px;
}
#signUpInfo {
color: red;
font-size: 10px
}
</style>