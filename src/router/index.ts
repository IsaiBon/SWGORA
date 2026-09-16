import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import OrdenesView from '@/views/OrdenesView.vue'
import CatalogoView from '@/views/CatalogoView.vue'
import ClientesView from '@/views/ClientesView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { layout: 'main', title: 'Dashboard - JR Blanco' },
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesView,
    meta: { layout: 'main', title: 'Clientes y Flotillas - JR Blanco' },
  },
  {
    path: '/ordenes',
    name: 'Ordenes',
    component: OrdenesView,
    meta: { layout: 'main', title: 'Órdenes - JR Blanco' },
  },
  {
    path: '/catalogo',
    name: 'Catalogo',
    component: CatalogoView,
    meta: { layout: 'main', title: 'Catálogo - JR Blanco' },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { layout: 'auth', title: 'Iniciar Sesión - SWGORA' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
