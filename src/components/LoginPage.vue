<template>
  <div class="auth-container">
    <div class="box">
      <h1>Entrar</h1>
      <form @submit.prevent="handleLogin">
        <div class="in">
          <label for="email">E-Mail</label>
          <div><input type="email" v-model="email" placeholder="E-mail" id="emailInput" required /></div>
        </div>
        <div class="in">
          <label for="password">Senha</label>
          <div><input type="password" v-model="password" placeholder="Senha" id="passwordInput" required /></div>
        </div>
        <div id="loginInfo" v-if="errorMessage">{{ errorMessage }}</div>
        <div>
          <button class="log" type="submit" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
      </form>
      <span>Ainda não tem conta? <a href="/signup">Se cadastrar</a> </span>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";
      const authStore = useAuthStore();
      try {
        await authStore.login({ email: this.email, password: this.password });
        this.$router.push('/');
      } catch (error) {
        this.errorMessage = "Failed to login. Please check your credentials.";
        console.error('Login error:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.box {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
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
  border: 1px solid #ccc;
}

.log {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: none;
  background-color: blueviolet;
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