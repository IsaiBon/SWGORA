<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LogIn,
  X,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-vue-next'

const uiStore = useUiStore()
const route = useRoute()

interface NavItem {
  name: string
  path: string
  icon: any
  badge?: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Órdenes', path: '/ordenes', icon: ShoppingCart, badge: '6' },
  { name: 'Catálogo', path: '/catalogo', icon: Package },
  { name: 'Login / Acceso', path: '/login', icon: LogIn },
]

const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="uiStore.isMobileSidebarOpen"
      @click="uiStore.closeMobileSidebar"
      class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar Container -->
    <aside
      :class="[
        'fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0',
        uiStore.isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Sidebar Header -->
      <div class="h-16 flex items-center justify-between px-5 border-b border-slate-800">
        <router-link
          to="/dashboard"
          @click="uiStore.closeMobileSidebar"
          class="flex items-center gap-3 text-white font-bold text-lg tracking-wider"
        >
          <div class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-900/50">
            <Layers class="w-5 h-5" />
          </div>
          <span>SWGORA</span>
        </router-link>

        <!-- Close Button (Mobile only) -->
        <button
          type="button"
          @click="uiStore.closeMobileSidebar"
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Cerrar menú"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navegación Principal
        </div>

        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="uiStore.closeMobileSidebar"
          :class="[
            'group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            isActive(item.path)
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
          ]"
        >
          <div class="flex items-center gap-3">
            <component
              :is="item.icon"
              :class="[
                'w-5 h-5 transition-transform group-hover:scale-110',
                isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400',
              ]"
            />
            <span>{{ item.name }}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <span
              v-if="item.badge"
              :class="[
                'text-[11px] px-2 py-0.5 rounded-full font-semibold',
                isActive(item.path)
                  ? 'bg-indigo-800 text-white'
                  : 'bg-slate-800 text-indigo-300',
              ]"
            >
              {{ item.badge }}
            </span>
            <ChevronRight
              :class="[
                'w-4 h-4 transition-transform opacity-0 group-hover:opacity-100',
                isActive(item.path) && 'opacity-100',
              ]"
            />
          </div>
        </router-link>
      </nav>

      <!-- Sidebar Footer / Sprint status -->
      <div class="p-4 border-t border-slate-800">
        <div class="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
            <Sparkles class="w-4 h-4" />
          </div>
          <div class="text-xs">
            <div class="font-semibold text-slate-200">Sprint 1 - Base</div>
            <div class="text-slate-400 text-[11px] mt-0.5">Vue 3 + Vite + Tailwind</div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
