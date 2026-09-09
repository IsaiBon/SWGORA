<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowUpRight, 
  CheckCircle2
} from 'lucide-vue-next'
import { ordersService, type Order } from '@/services/ordersService'

const recentOrders = ref<Order[]>([])

const stats = [
  {
    name: 'Total Órdenes',
    value: '1,284',
    change: '+12.5%',
    changeType: 'increase',
    icon: ShoppingCart,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Ventas Mensuales',
    value: '$48,250.00',
    change: '+8.2%',
    changeType: 'increase',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Productos en Catálogo',
    value: '356',
    change: '+4 nuevos',
    changeType: 'neutral',
    icon: Package,
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Clientes Activos',
    value: '89',
    change: '+3 este mes',
    changeType: 'increase',
    icon: Users,
    color: 'from-amber-500 to-orange-600',
  },
]

onMounted(async () => {
  recentOrders.value = await ordersService.getOrders()
})

const getStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'Completada':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'En Proceso':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'Pendiente':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Cancelada':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header de Vista -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Principal</h1>
        <p class="text-sm text-slate-500 mt-1">
          Bienvenido a SWGORA. Resumen de operaciones y estado general de la plataforma.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <router-link
          to="/ordenes"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition shadow-indigo-200"
        >
          <ShoppingCart class="w-4 h-4 mr-2" />
          Ver Órdenes
        </router-link>
        <router-link
          to="/catalogo"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition"
        >
          <Package class="w-4 h-4 mr-2" />
          Ver Catálogo
        </router-link>
      </div>
    </div>

    <!-- Grid de Métricas (KPIs) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {{ stat.name }}
          </span>
          <div
            :class="[
              'w-10 h-10 rounded-xl bg-gradient-to-tr text-white flex items-center justify-center shadow-md',
              stat.color
            ]"
          >
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-2xl font-bold text-slate-900">{{ stat.value }}</span>
          <span class="inline-flex items-center text-xs font-semibold text-emerald-600">
            <ArrowUpRight class="w-3.5 h-3.5 mr-0.5" />
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actividad Reciente y Órdenes -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Tabla de Órdenes Recientes -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">Órdenes Recientes</h2>
            <p class="text-xs text-slate-500">Últimos movimientos registrados en el sistema</p>
          </div>
          <router-link
            to="/ordenes"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            Ver todas &rarr;
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th class="pb-3">Código</th>
                <th class="pb-3">Cliente</th>
                <th class="pb-3">Estado</th>
                <th class="pb-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="order in recentOrders.slice(0, 4)" :key="order.id" class="hover:bg-slate-50/80 transition">
                <td class="py-3 font-medium text-indigo-600 text-xs">
                  {{ order.orderNumber }}
                </td>
                <td class="py-3 text-slate-700 text-xs">
                  {{ order.customer }}
                </td>
                <td class="py-3">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border',
                      getStatusBadge(order.status)
                    ]"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-3 text-right font-semibold text-slate-800 text-xs">
                  ${{ order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estado del Sistema / Novedades -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900 mb-1">Estado de la Arquitectura</h2>
          <p class="text-xs text-slate-500 mb-4">Módulos verificados del Sprint 1</p>

          <div class="space-y-3">
            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-semibold text-slate-800">Vue 3 + Vite + TypeScript</p>
                <p class="text-[11px] text-slate-500">Compilación rápida con HMR activo.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-semibold text-slate-800">Tailwind CSS & PostCSS</p>
                <p class="text-[11px] text-slate-500">Sistema de diseño utility-first responsive.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-semibold text-slate-800">Vue Router & Pinia Store</p>
                <p class="text-[11px] text-slate-500">Navegación SPA y estado reactivo global.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-semibold text-slate-800">Estructura Modular</p>
                <p class="text-[11px] text-slate-500">Carpetas /components, /views, /layouts, /services, /composables.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Sprint 1: Frontend Base</span>
          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium text-[11px]">100% Completado</span>
        </div>
      </div>
    </div>
  </div>
</template>
