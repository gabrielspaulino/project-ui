import { createRouter, createWebHistory } from 'vue-router';
import ProductList from '../views/ProductList.vue';
import ProductDetail from '../views/ProductDetail.vue';
import ProductComparison from '../views/ProductComparison.vue';
import Checkout from '../views/Checkout.vue';
import Orders from '../views/Orders.vue';
import OrderDetail from '../views/OrderDetail.vue';
import Login from '../views/Login.vue';
import Signup from '../views/SignUpView.vue';

const routes = [
  { path: '/', redirect: '/products' },
  { path: '/products', name: 'ProductList', component: ProductList, meta: { requiresAuth: true } },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true, meta: { requiresAuth: true } },
  { path: '/comparison', name: 'ProductComparison', component: ProductComparison, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },
  { path: '/orders', name: 'Orders', component: Orders, meta: { requiresAuth: true } },
  { path: '/orders/:id', name: 'OrderDetail', component: OrderDetail, props: true, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Signup', component: Signup }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    else return { top: 0 };
  }
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('token');

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to products if already logged in
    next('/products');
  } else {
    next();
  }
});

export default router;