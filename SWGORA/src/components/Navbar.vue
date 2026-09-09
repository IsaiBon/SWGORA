<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { 
  Menu, 
  Bell, 
  Search, 
  LogOut, 
  User as UserIcon,
  Layers
} from 'lucide-vue-next'

const uiStore = useUiStore()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
    <!-- Left: Hamburger (Mobile) + Brand / Breadcrumb -->
    <div class="flex items-center gap-3 sm:gap-4">
      <button
        type="button"
        @click="uiStore.toggleMobileSidebar"
        class="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Abrir menú de navegación"
      >
        <Menu class="w-6 h-6" />
      </button>

      <div class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <Layers class="w-5 h-5" />
        </div>
        <div class="hidden sm:block">
          <span class="text-base font-bold tracking-tight text-slate-900">SWGORA</span>
          <span class="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Frontend v1.0
          </span>
        </div>
      </div>
    </div>

    <!-- Center: Search input (desktop) -->
    <div class="hidden md:flex items-center flex-1 max-w-md mx-6">
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search class="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Buscar órdenes, productos, clientes..."
          class="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>
    </div>

    <!-- Right: Notifications & User Profile -->
    <div class="flex items-center gap-3">
      <!-- Notification Icon -->
      <button 
        type="button"
        class="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
        title="Notificaciones"
      >
        <Bell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
      </button>

      <div class="h-6 w-px bg-slate-200"></div>

      <!-- User Profile / Auth Actions -->
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            <img 
              v-if="authStore.user?.avatar" 
              :src="authStore.user.avatar" 
              :alt="authStore.user.name"
              class="w-full h-full object-cover" 
            />
            <UserIcon v-else class="w-4 h-4 text-slate-500" />
          </div>
          <div class="hidden lg:block text-left">
            <div class="text-xs font-semibold text-slate-800 leading-tight">
              {{ authStore.user?.name }}
            </div>
            <div class="text-[10px] text-slate-500">
              {{ authStore.user?.role }}
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="handleLogout"
          class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          title="Cerrar sesión"
        >
          <LogOut class="w-5 h-5" />
        </button>
      </div>

      <router-link
        v-else
        to="/login"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
      >
        <UserIcon class="w-4 h-4" />
        <span>Iniciar Sesión</span>
      </router-link>
    </div>
  </header>
</template>
