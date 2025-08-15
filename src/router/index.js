import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CarDetails from '../views/CarDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/car/:id',
    name: 'CarDetails',
    component: CarDetails,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router