import { defineStore } from 'pinia';
import apiClient from '../api/config';

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    return {
      email: decoded.sub,
      name: decoded.sub.split('@')[0]
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

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
        this.user = decodeToken(this.token);
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
        this.user = decodeToken(this.token);
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
        const token = localStorage.getItem('token');
        if (token) {
          this.user = decodeToken(token);
          this.isAuthenticated = true;
        }
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