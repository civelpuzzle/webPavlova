import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/catalog', name: 'catalog', component: CatalogView },
  { path: '/admin', name: 'admin', component: AdminView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, behavior: 'smooth', top: 80 })
        }, 150)
      })
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
