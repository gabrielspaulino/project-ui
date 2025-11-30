<template>
  <div class="auth-page">
    <div class="auth-card card">
      <h1>Welcome Back</h1>
      <p class="subtitle">Login to your account</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email" 
            placeholder="Enter your email"
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            placeholder="Enter your password"
            required 
          />
        </div>

        <div class="form-actions">
          <label class="remember-me">
            <input type="checkbox" v-model="form.rememberMe" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button 
          type="submit" 
          class="btn-primary btn-large" 
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <div v-if="error" class="error-message">{{ error }}</div>
      </form>

      <div class="auth-footer">
        <p>Don't have an account? <router-link to="/register">Sign up</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
  rememberMe: false
});

const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    await authStore.login({
      username: form.value.email,
      password: form.value.password
    });
    router.push('/products');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-secondary);
}

.auth-card {
  max-width: 440px;
  width: 100%;
  padding: 40px;
}

h1 {
  text-align: center;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 28px;
}

.subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 32px;
  font-size: 15px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 14px;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 15px;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-bg);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
}

.remember-me input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-large {
  width: 100%;
  padding: 14px;
  margin-bottom: 16px;
  font-size: 16px;
}

.auth-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.auth-footer p {
  color: var(--text-secondary);
  font-size: 14px;
}

.auth-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>