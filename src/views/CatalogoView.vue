<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { catalogService, type CatalogProduct } from '@/services/catalogService'
import { Search, Plus, ShoppingCart, Tag, CheckCircle2, AlertTriangle, XCircle } from 'lucide-vue-next'

const products = ref<CatalogProduct[]>([])
const searchQuery = ref('')
const selectedCategory = ref('Todas')

onMounted(async () => {
  products.value = await catalogService.getProducts()
})

const categories = computed(() => {
  const cats = ['Todas', ...new Set(products.value.map(p => p.category))]
  return cats
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = 
      selectedCategory.value === 'Todas' || p.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const getStockBadge = (status: CatalogProduct['status']) => {
  switch (status) {
    case 'Disponible':
      return { class: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 }
    case 'Bajo Stock':
      return { class: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle }
    case 'Agotado':
      return { class: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Productos</h1>
        <p class="text-sm text-slate-500 mt-1">
          Inventario de artículos y productos disponibles para órdenes de compra.
        </p>
      </div>
      <div>
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition shadow-indigo-200"
        >
          <Plus class="w-4 h-4 mr-1.5" />
          Nuevo Producto
        </button>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="relative w-full md:w-96">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar producto o código..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Categories Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          @click="selectedCategory = category"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition',
            selectedCategory === category
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 bg-slate-100 hover:bg-slate-200/70',
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
      >
        <!-- Product Image -->
        <div class="h-48 w-full bg-slate-100 relative overflow-hidden">
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm border border-slate-200/60">
            {{ product.code }}
          </span>
          <span
            :class="[
              'absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm border backdrop-blur-sm flex items-center gap-1',
              getStockBadge(product.status).class
            ]"
          >
            <component :is="getStockBadge(product.status).icon" class="w-3 h-3" />
            {{ product.status }}
          </span>
        </div>

        <!-- Product Info -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1 text-xs text-indigo-600 font-medium mb-1">
              <Tag class="w-3 h-3" />
              <span>{{ product.category }}</span>
            </div>
            <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
              {{ product.name }}
            </h3>
            <p class="text-xs text-slate-500 mt-1">
              Stock actual: <strong class="text-slate-700">{{ product.stock }} unidades</strong>
            </p>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-slate-400 block uppercase font-medium">Precio Unitario</span>
              <span class="text-lg font-bold text-slate-900">
                ${{ product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}
              </span>
            </div>

            <button
              type="button"
              :disabled="product.status === 'Agotado'"
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition shadow-sm',
                product.status === 'Agotado'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              ]"
            >
              <ShoppingCart class="w-3.5 h-3.5" />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredProducts.length === 0"
      class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 shadow-sm"
    >
      <p class="text-sm">No se encontraron productos coincidentes con tu búsqueda.</p>
    </div>
  </div>
</template>
