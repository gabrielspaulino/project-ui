<template>
  <div id="app" :class="{ dark: isDark }">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="logo">
          <span class="logo-icon">🛍️</span>
          <span class="logo-text">ShopHub</span>
        </router-link>
        
        <div class="nav-center">
          <router-link to="/products" class="nav-link">
            <span class="nav-icon">📦</span>
            Products
          </router-link>
          <router-link 
            v-if="hasComparisonProducts" 
            to="/comparison" 
            class="nav-link comparison-badge"
          >
            <span class="nav-icon">⚖️</span>
            Compare
            <span class="badge">{{ comparisonCount }}</span>
          </router-link>
        </div>
        
        <div class="nav-right">
          <button class="icon-button" @click="toggleTheme" :title="isDark ? 'Light Mode' : 'Dark Mode'">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
          
          <button class="icon-button cart-button" @click="toggleCart">
            <span class="cart-icon">🛒</span>
            <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
          </button>
          
          <div class="user-menu">
            <button class="user-button" @click="toggleUserMenu">
              <span class="user-avatar">{{ userInitial }}</span>
              <span class="user-name">{{ userName }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            
            <div v-if="showUserMenu" class="user-dropdown" @click.stop>
              <div v-if="!isAuthenticated">
                <router-link to="/login" class="dropdown-item" @click="closeUserMenu">
                  <span>🔐</span> Login
                </router-link>
                <router-link to="/register" class="dropdown-item" @click="closeUserMenu">
                  <span>📝</span> Register
                </router-link>
              </div>
              <div v-else>
                <router-link to="/orders" class="dropdown-item" @click="closeUserMenu">
                  <span>📋</span> My Orders
                </router-link>
                <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                  <span>👤</span> Profile
                </router-link>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" @click="handleLogout">
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <CartSidebar :show="showCart" @close="closeCart" />
    <ComparisonBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useComparisonStore } from './stores/comparison';
import { useThemeStore } from './stores/theme';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import ComparisonBar from './components/ComparisonBar.vue';
import CartSidebar from './components/CartSidebar.vue';

const comparisonStore = useComparisonStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const showUserMenu = ref(false);
const showCart = ref(false);

const hasComparisonProducts = computed(() => comparisonStore.hasProducts);
const comparisonCount = computed(() => comparisonStore.selectedProducts.length);
const isDark = computed(() => themeStore.isDark);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userName = computed(() => authStore.userName);
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());
const cartItemCount = computed(() => cartStore.itemCount);

onMounted(() => {
  themeStore.initTheme();
  authStore.initAuth();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toggleTheme = () => {
  themeStore.toggleTheme();
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    showUserMenu.value = false;
  }
};

const toggleCart = () => {
  showCart.value = !showCart.value;
};

const closeCart = () => {
  showCart.value = false;
};

const handleLogout = () => {
  authStore.logout();
  closeUserMenu();
};
</script>

<style scoped>
.navbar {
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--primary-color);
  font-weight: 700;
  font-size: 20px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  color: var(--text-primary);
}

.nav-center {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.nav-link.router-link-active {
  background: var(--primary-bg);
  color: var(--primary-color);
}

.nav-icon {
  font-size: 16px;
}

.comparison-badge {
  position: relative;
}

.badge {
  background: var(--primary-color);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background: var(--hover-bg);
}

.cart-button {
  position: relative;
}

.cart-icon {
  font-size: 22px;
}

.cart-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}

.user-button:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 10px;
  color: var(--text-secondary);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--dropdown-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  min-width: 200px;
  box-shadow: var(--shadow-lg);
  padding: 8px;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 14px;
  transition: background 0.2s;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--hover-bg);
}

.dropdown-item span:first-child {
  font-size: 16px;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
}

.main-content {
  min-height: calc(100vh - 56px);
  padding-bottom: 100px;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .logo-text {
    display: none;
  }
  
  .nav-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .nav-link span:not(.nav-icon):not(.badge) {
    display: none;
  }
  
  .user-name {
    display: none;
  }
}
</style>