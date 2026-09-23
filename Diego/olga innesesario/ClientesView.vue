<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { clientService, type Client } from '@/services/clientService'
import ClientCard from '@/components/ClientCard.vue'
import ClientModal from '@/components/ClientModal.vue'
import EmptyState from '@/components/EmptyState.vue'
import {
  Users,
  Search,
  Plus,
  Filter,
  RotateCcw,
  Sparkles,
  CheckCircle,
  FolderX,
} from 'lucide-vue-next'

const clients = ref<Client[]>(clientService.getClients())
const searchQuery = ref('')
const selectedType = ref<string>('Todos')
const isModalOpen = ref(false)
const clientToEdit = ref<Client | null>(null)
const toastMessage = ref('')

const loadClients = () => {
  clients.value = clientService.getClients()
}

onMounted(() => {
  loadClients()
})

const categories = ['Todos', 'Flotilla', 'Empresa', 'Taller Asociado', 'Particular']

const filteredClients = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return clients.value.filter((c) => {
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.company.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.address.toLowerCase().includes(query) ||
      c.equipmentDescription.toLowerCase().includes(query)

    const matchesType = selectedType.value === 'Todos' || c.type === selectedType.value

    return matchesQuery && matchesType
  })
})

const stats = computed(() => {
  const total = clients.value.length
  const enServicio = clients.value.filter((c) => c.status === 'En Servicio').length
  const flotillas = clients.value.filter((c) => c.type === 'Flotilla').length
  return { total, enServicio, flotillas }
})

// Modal handlers
const openCreateModal = () => {
  clientToEdit.value = null
  isModalOpen.value = true
}

const openEditModal = (client: Client) => {
  clientToEdit.value = client
  isModalOpen.value = true
}

const handleSaveClient = (clientData: Partial<Client>) => {
  clientService.saveClient(clientData as any)
  loadClients()
  isModalOpen.value = false
  showToast(clientData.id ? 'Cliente actualizado exitosamente' : 'Cliente registrado exitosamente')
}

const handleDeleteClient = (id: string) => {
  clientService.deleteClient(id)
  loadClients()
  isModalOpen.value = false
  showToast('Cliente eliminado del sistema')
}

// Empty State Demo helpers
const handleClearAll = () => {
  if (confirm('¿Deseas vaciar la lista para probar los Empty States amigables?')) {
    clientService.clearAll()
    loadClients()
    showToast('Lista vaciada para demostración')
  }
}

const handleRestoreDemo = () => {
  clientService.resetClients()
  loadClients()
  showToast('Clientes demo restaurados')
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = 'Todos'
}

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed bottom-6 right-6 z-50 bg-[#0D0D0D] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#05C7F2]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <CheckCircle class="w-5 h-5 text-[#05F2F2]" />
      <span class="text-xs font-semibold">{{ toastMessage }}</span>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#05C7F2]/15 text-[#04C4D9] border border-[#05C7F2]/30 uppercase tracking-wider">
            Sprint 2 • JR Blanco
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestión de Clientes y Flotillas
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Directorio centralizado con accesos directos táctiles a llamada telefónica, ubicación en mapa y seguimiento de servicios en taller.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <!-- Demo Empty State Toggle -->
        <button
          v-if="clients.length > 0"
          type="button"
          @click="handleClearAll"
          class="min-h-[44px] px-3.5 py-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition flex items-center gap-1.5"
          title="Vacía la lista para evaluar el estado vacío amigable"
        >
          <FolderX class="w-4 h-4 text-slate-400" />
          <span>Probar Empty State</span>
        </button>

        <button
          v-else
          type="button"
          @click="handleRestoreDemo"
          class="min-h-[44px] px-3.5 py-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
        >
          <RotateCcw class="w-4 h-4 text-[#04C4D9]" />
          <span>Restaurar Demo</span>
        </button>

        <!-- New Client Button (Touch Friendly) -->
        <button
          type="button"
          @click="openCreateModal"
          class="min-h-[46px] px-6 py-2.5 rounded-full bg-[#0D0D0D] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-300 hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4 text-[#05F2F2]" />
          <span>Nuevo Cliente</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Clientes</div>
          <div class="text-2xl font-extrabold text-slate-900 mt-0.5">{{ stats.total }}</div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-[#05C7F2]/10 text-[#04C4D9] flex items-center justify-center">
          <Users class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">En Servicio en Taller</div>
          <div class="text-2xl font-extrabold text-[#04C4D9] mt-0.5">{{ stats.enServicio }}</div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-sky-50 text-[#05C7F2] flex items-center justify-center">
          <Sparkles class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Flotillas / Empresas</div>
          <div class="text-2xl font-extrabold text-slate-900 mt-0.5">{{ stats.flotillas }}</div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Filter class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Filters & Search Bar (Touch friendly) -->
    <div class="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search class="w-5 h-5" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre, empresa, teléfono, dirección o equipo..."
            class="w-full min-h-[46px] pl-11 pr-4 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#05C7F2] transition shadow-inner"
          />
        </div>

        <!-- Filter Count -->
        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium px-2">
          <span>Mostrando <strong>{{ filteredClients.length }}</strong> de {{ clients.length }}</span>
        </div>
      </div>

      <!-- Category Filter Chips (Touch Friendly) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mr-1 hidden sm:inline">
          Filtro:
        </span>
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectedType = cat"
          :class="[
            'min-h-[40px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border active:scale-95',
            selectedType === cat
              ? 'bg-[#0D0D0D] text-white border-[#0D0D0D] shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Clients Grid or Empty States -->
    <div v-if="filteredClients.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <ClientCard
        v-for="client in filteredClients"
        :key="client.id"
        :client="client"
        @edit="openEditModal"
      />
    </div>

    <!-- Empty State: When search has 0 results -->
    <div v-else-if="clients.length > 0">
      <EmptyState
        title="Sin coincidencias encontradas"
        :description="`No encontramos ningún cliente que coincida con '${searchQuery || selectedType}'. Prueba modificando tu búsqueda o restableciendo los filtros.`"
        actionText="Limpiar Filtros"
        @action="clearFilters"
      />
    </div>

    <!-- Empty State: When no clients exist at all -->
    <div v-else>
      <EmptyState
        title="No hay clientes registrados aún"
        description="El directorio de clientes se encuentra vacío. Comienza registrando tu primer cliente de taller o restaura los datos de demostración para explorar la interfaz."
        actionText="Registrar Primer Cliente"
        secondaryActionText="Restaurar Clientes Demo"
        @action="openCreateModal"
        @secondaryAction="handleRestoreDemo"
      />
    </div>

    <!-- Modal for Create and Edit -->
    <ClientModal
      :isOpen="isModalOpen"
      :clientToEdit="clientToEdit"
      @close="isModalOpen = false"
      @save="handleSaveClient"
      @delete="handleDeleteClient"
    />
  </div>
</template>
