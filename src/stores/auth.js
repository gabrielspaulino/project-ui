import { defineStore } from 'pinia';
import apiClient from '../api/config';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    userName: (state) => state.user?.name || 'Guest',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    async login(credentials) {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token);
        return response.data;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async register(userData) {
      try {
        const response = await apiClient.post('/auth/register', userData);
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', this.token);
        return response.data;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },

    async logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },

    async fetchUser() {
      try {
        const response = await apiClient.get('/auth/me');
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.logout();
      }
    },

    initAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.fetchUser();
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['token']
      }
    ]
  }
});