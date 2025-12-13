<template>
  <div class="auth-container">
    <div class="box">
      <h1>Cadastrar-se</h1>

      <div class="in">
          <label for="username">Name</label>
          <div>  <input type="text" v-model="username" placeholder="Nome" id="nameInput"></div>
      </div>

      <div class="in">
          <label for="phone">Telefone</label>
          <div>  <input type="text" v-model="phone" placeholder="Telefone (com DDD)" id="phoneInput" maxlength="11"></div>
      </div>
    
      <div class="in">
          <label for="email">E-Mail</label>
          <div>  <input type="text" v-model="email" placeholder="E-mail" id="emailInput"></div>
      </div>
    
      <div class="in">
        <label for="password">Senha</label>
        <div>
            <input v-model="password" type="password" placeholder="8 caracteres no mínimo" id="passwordInput" minlength="8" required/>
        </div>
      </div>

      <div class="in">
        <label for="confirmPassword">Confirmar Senha</label>
        <div>
            <input v-model="confirmPassword" type="password" placeholder="8 caracteres no mínimo" id="confirmPasswordInput" minlength="8" required/>
        </div>
      </div>
        <div id="loginInfo">{{ errorMessage }}</div>
    
      <div>
          <button class="log" ref="submitButton" v-on:click="registerUser()" :disabled="loading">
            {{ loading ? 'Cadastrando...' : 'Cadastrar conta' }}
          </button>
      </div>
      <span>Já tem uma conta? <a href="/login">Entrar</a> </span>
    </div>
  </div>
</template>
  
  
<script>
import AuthService from '../service/authService';

export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      phone: "",
      loading: false,
      errorMessage: ""
    };
  },
  methods: {
    async registerUser() {
      this.errorMessage = "";
      
      // Password match validation
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords are not equal";
        return;
      }
      
      // Info validation
      if (!this.validateInfo()) {
        this.errorMessage = "Review your information";
        return;
      }
      
      this.loading = true;
      
      try {
        // Create user via axios (no token needed for signup)
        const response = await AuthService.register(
          this.username,
          this.email,
          this.phone,
          this.password,
          this.enabled,
          this.roles
        );
        
        // Success - redirect to login
        window.alert("User registered successfully. Login to your account.");
        this.$router.push({ path: '/login' });
        
      } catch (error) {
        console.error('Signup error:', error);
        
        if (error.response) {
          // Handle specific error cases
          if (error.response.status === 400) {
            this.errorMessage = "This email is already registered";
          } else {
            this.errorMessage = error.response.data?.message || "Registration failed. Please try again.";
          }
        } else if (error.request) {
          this.errorMessage = "Network error. Please check your connection.";
        } else {
          this.errorMessage = "An error occurred. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },
    
    validateInfo() {
      return this.password.length > 7 && 
             (this.phone.length === 10 || this.phone.length === 11) && 
              this.email && 
              this.username;
    }
  }
};
</script>

<style>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  min-height: 80vh;
}

.box {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  margin-top: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(-bg--primary);
}

.in {
  margin-bottom: 1rem;
}

.in label {
  display: block;
  margin-bottom: 0.5rem;
}

.in input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.log {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: none;
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
}

#loginInfo {
  color: red;
  font-size: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>