<template>
    <div class="box">
      <div class="banner_high">
        <div class="language">
        <div class="flag"><img src="../assets/booksIcon.png" alt=""></div>
        <div class="flag active"><img src="../assets/booksIcon.png" alt=""></div>
      </div>
      </div>
     
      <h1>Entrar</h1>
     
      <div class="in">
          <label for="name">E-Mail</label>
          <div>  <input type="text" :value="username" placeholder="E-mail" id="emailInput"></div>
      </div>
    
      <div class="in">
      <label for="name">Senha</label>
      <div>
          <input :value="password" type="password" :name="string" placeholder="8 caracteres no mínimo" id="passwordInput" required/>
      </div>
      <div id="loginInfo"></div>
    
      </div>
     
      <div class="check_bar">
        <div> <input type="checkbox" name="" id="">
        <label for="">Lembrar-se de mim</label></div>
       
        <a href="">Esqueceu a senha?</a>
    
      </div>
    
    <div>
        <button class="log" ref="submitButton">Entrar</button>
    </div>
       
    <span>Ainda não tem conta? <a href="/signup">Se cadastrar</a> </span> 
    </div>
    
</template>
    
    
<script>
let response = await fetch('http://localhost:8080/users');
const usersResponse = await response.json();

export default {
  data() {
    return {
      userLoggedIn: false,
      username:"",
      password: "",
    };
  },
  mounted() {
    document.getElementsByClassName("log")[0].addEventListener("click", () => {
      this.username = document.getElementById("emailInput").value
      this.password = document.getElementById("passwordInput").value
      let user = usersResponse.find(user => user.email === this.username);
      if (user) {
        if (user.password !== this.password) {
          document.getElementById("loginInfo").textContent = "Wrong password"
        } else {
          document.getElementById("loginInfo").textContent = ""
          this.username = document.getElementById("emailInput").textContent = ""
          this.password = document.getElementById("passwordInput").textContent = ""
          document.cookie = user.id
          window.location.href='/'
        }
      } else {
          document.getElementById("loginInfo").textContent = "E-mail not registered"
      }
    })
  },
};
</script>

<style>
button {
  background-color: blueviolet;
  color: white;
  padding: 5px 15px;
}
#loginInfo {
  color: red;
  font-size: 10px
}
</style>