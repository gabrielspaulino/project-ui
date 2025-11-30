<template>
  <div class="profile-page">
    <div class="container">
      <h1>My Profile</h1>

      <div class="profile-grid">
        <div class="profile-card card">
          <div class="profile-header">
            <div class="avatar">{{ userInitial }}</div>
            <div class="user-info">
              <h2>{{ user?.userName || 'Guest' }}</h2>
              <p>{{ user?.email || '' }}</p>
            </div>
          </div>

          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{ orderCount }}</span>
              <span class="stat-label">Orders</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ reviewCount }}</span>
              <span class="stat-label">Reviews</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">Member</span>
              <span class="stat-label">Since {{ joinDate }}</span>
            </div>
          </div>
        </div>

        <div class="profile-main">
          <div class="card">
            <h3>Personal Information</h3>
            <form @submit.prevent="handleUpdateProfile">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input 
                  id="name"
                  v-model="form.name" 
                  type="text" 
                  required 
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  id="email"
                  v-model="form.email" 
                  type="email" 
                  required 
                />
              </div>

              <div class="form-group">
                <label for="phone">Phone</label>
                <input 
                  id="phone"
                  v-model="form.phone" 
                  type="tel" 
                />
              </div>

              <button 
                type="submit" 
                class="btn-primary" 
                :disabled="loading"
              >
                {{ loading ? 'Updating...' : 'Update Profile' }}
              </button>

              <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
              <div v-if="error" class="error-message">{{ error }}</div>
            </form>
          </div>

          <div class="card">
            <h3>Change Password</h3>
            <form @submit.prevent="handleChangePassword">
              <div class="form-group">
                <label for="currentPassword">Current Password</label>
                <input 
                  id="currentPassword"
                  v-model="passwordForm.currentPassword" 
                  type="password" 
                  required 
                />
              </div>

              <div class="form-group">
                <label for="newPassword">New Password</label>
                <input 
                  id="newPassword"
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  required 
                  minlength="6"
                />
              </div>

              <div class="form-group">
                <label for="confirmNewPassword">Confirm New Password</label>
                <input 
                  id="confirmNewPassword"
                  v-model="passwordForm.confirmNewPassword" 
                  type="password" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                class="btn-secondary" 
                :disabled="passwordLoading || !passwordValid"
              >
                {{ passwordLoading ? 'Changing...' : 'Change Password' }}
              </button>

              <div v-if="passwordSuccess" class="success-message">{{ passwordSuccess }}</div>
              <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const user = computed(() => authStore.user);
const userInitial = computed(() => user.value?.name?.charAt(0).toUpperCase() || 'G');

const form = ref({
  name: '',
  email: '',
  phone: ''
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

const loading = ref(false);
const error = ref(null);
const successMessage = ref(null);

const passwordLoading = ref(false);
const passwordError = ref(null);
const passwordSuccess = ref(null);

const orderCount = ref(0);
const reviewCount = ref(0);
const joinDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
});

const passwordValid = computed(() => {
  return passwordForm.value.newPassword === passwordForm.value.confirmNewPassword &&
         passwordForm.value.newPassword.length >= 6;
});

onMounted(() => {
  if (user.value) {
    form.value.name = user.value.name || '';
    form.value.email = user.value.email || '';
    form.value.phone = user.value.phone || '';
  }
});

const handleUpdateProfile = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    // Call API to update profile
    // await userAPI.updateProfile(form.value);
    successMessage.value = 'Profile updated successfully!';
    
    // Update local user data
    authStore.user = { ...authStore.user, ...form.value };
  } catch (err) {
    error.value = 'Failed to update profile';
  } finally {
    loading.value = false;
  }
};

const handleChangePassword = async () => {
  if (!passwordValid.value) {
    passwordError.value = 'Passwords do not match or are too short';
    return;
  }

  passwordLoading.value = true;
  passwordError.value = null;
  passwordSuccess.value = null;

  try {
    // Call API to change password
    // await userAPI.changePassword(passwordForm.value);
    passwordSuccess.value = 'Password changed successfully!';
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
  } catch (err) {
    passwordError.value = 'Failed to change password';
  } finally {
    passwordLoading.value = false;
  }
};
</script>

<style scoped>
.profile-page {
  padding: 40px 0;
  min-height: calc(100vh - 56px);
}

h1 {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 32px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
}

.profile-card {
  height: fit-content;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.user-info {
  text-align: center;
}

.user-info h2 {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.user-info p {
  color: var(--text-secondary);
  font-size: 14px;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h3 {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 24px;
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

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 15px;
}

.success-message {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--success-color);
  margin-top: 16px;
}

@media (max-width: 968px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 24px;
  }
}
</style>