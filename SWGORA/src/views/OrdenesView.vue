<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ordersService, type Order } from '@/services/ordersService'
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  FileText 
} from 'lucide-vue-next'

const orders = ref<Order[]>([])
const searchQuery = ref('')
const selectedStatus = ref<string>('Todos')

onMounted(async () => {
  orders.value = await ordersService.getOrders()
})

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = 
      selectedStatus.value === 'Todos' || order.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
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
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Módulo de Órdenes</h1>
        <p class="text-sm text-slate-500 mt-1">
          Gestión, seguimiento y control de pedidos en curso y despachados.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex items-center px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition"
        >
          <Download class="w-4 h-4 mr-2 text-slate-500" />
          Exportar
        </button>
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition shadow-indigo-200"
        >
          <Plus class="w-4 h-4 mr-1.5" />
          Nueva Orden
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full md:w-96">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por código u cliente..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        <span class="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1 hidden lg:flex">
          <Filter class="w-3.5 h-3.5" /> Filtro:
        </span>
        <button
          v-for="status in ['Todos', 'Completada', 'En Proceso', 'Pendiente', 'Cancelada']"
          :key="status"
          type="button"
          @click="selectedStatus = status"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition',
            selectedStatus === status
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200/70',
          ]"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-6 py-3.5">N° Orden</th>
              <th class="px-6 py-3.5">Cliente</th>
              <th class="px-6 py-3.5">Fecha</th>
              <th class="px-6 py-3.5">Ítems</th>
              <th class="px-6 py-3.5">Estado</th>
              <th class="px-6 py-3.5 text-right">Total</th>
              <th class="px-6 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-slate-50/70 transition"
            >
              <td class="px-6 py-4 font-semibold text-indigo-600 text-xs">
                {{ order.orderNumber }}
              </td>
              <td class="px-6 py-4 font-medium text-slate-900 text-xs">
                {{ order.customer }}
              </td>
              <td class="px-6 py-4 text-slate-500 text-xs">
                {{ order.date }}
              </td>
              <td class="px-6 py-4 text-slate-600 text-xs">
                {{ order.itemsCount }} arts.
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getStatusBadge(order.status)
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right font-bold text-slate-900 text-xs">
                ${{ order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Ver detalles"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Ver factura"
                  >
                    <FileText class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-slate-400 text-sm">
                No se encontraron órdenes con los filtros seleccionados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
