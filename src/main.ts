import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/main.css'
import { useUserSession } from "@/composables/userSession";
import DashboardLayout from '@/components/DashboardLayout.vue'
import EmptyLayout from '@/components/EmptyLayout.vue'
import Icon from '@/components/Icon.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.component('Icon', Icon)

const userSession = useUserSession()

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);    
  
    if (requiresAuth && !userSession.isLoggedIn) {
      next('/');
    } else if (to.path === '/'  && userSession.isLoggedIn) {
      next('/dashboard');
    } else {
      next();
    }
  });
app.use(router)
app.mount('#app')
