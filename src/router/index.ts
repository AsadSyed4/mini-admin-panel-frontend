import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Employees from '@/views/Employees.vue'
import Login from '@/views/Login.vue'
import Companies from '@/views/Companies.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies,
    meta: { requiresAuth: true },
  },
  {
    path: '/employees',
    name: 'Employees',
    component: Employees,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
