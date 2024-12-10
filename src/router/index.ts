import { createRouter, createWebHistory } from 'vue-router'
import DroneManagement from '../components/DroneManagement.vue'
import OrderManagement from '../components/OrderManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/drone-management',
    },
    {
      path: '/drone-management',
      name: 'drone-management',
      component: DroneManagement,
    },
    {
      path: '/order-management',
      name: 'order-management',
      component: OrderManagement,
    },
  ],
})

export default router
