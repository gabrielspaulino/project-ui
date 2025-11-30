import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async register(username, email, phone, password) {
    try {
      const response = await axios.post(`${API_URL}/users`, {
        username,
        email,
        phone,
        password,
        enabled: true,
        roles: ['USER_ROLE']
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
