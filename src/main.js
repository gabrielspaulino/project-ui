import { createApp } from 'vue'
import App from './App.vue'
import LoginPage from './components/LoginPage.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.user = LoginPage.user
app.use(router).mount('#app')

export function getApp() {
    return app
}