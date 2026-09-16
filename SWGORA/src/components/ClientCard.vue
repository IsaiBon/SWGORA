<script setup lang="ts">
import { computed } from 'vue'
import type { Client } from '@/services/clientService'
import RoleBadge from '@/components/RoleBadge.vue'
import {
  PhoneCall,
  MapPin,
  MessageCircle,
  Pencil,
  Truck,
  Building2,
  Wrench,
  User,
  ExternalLink,
} from 'lucide-vue-next'

const props = defineProps<{
  client: Client
}>()

defineEmits<{
  (e: 'edit', client: Client): void
}>()

const typeIcon = computed(() => {
  switch (props.client.type) {
    case 'Flotilla':
      return Truck
    case 'Empresa':
      return Building2
    case 'Taller Asociado':
      return Wrench
    case 'Particular':
    default:
      return User
  }
})

const statusBadge = computed(() => {
  switch (props.client.status) {
    case 'En Servicio':
      return 'bg-[#05C7F2]/15 text-[#04C4D9] border-[#05C7F2]/40'
    case 'Activo':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Inactivo':
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
})

const mapsUrl = computed(() => {
  const query = encodeURIComponent(`${props.client.address}, ${props.client.city}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
})

const cleanPhoneForWa = computed(() => {
  return props.client.phone.replace(/[^0-9]/g, '')
})
</script>

<template>
  <div
    class="bg-white rounded-3xl border border-slate-200/90 hover:border-[#05C7F2]/60 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
  >
    <!-- Card Top Header -->
    <div class="p-5 sm:p-6 pb-4">
      <div class="flex items-start justify-between gap-2.5 mb-3">
        <!-- Client Avatar / Type Icon -->
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:from-[#05C7F2]/15 group-hover:to-[#05F2F2]/20 group-hover:text-[#04C4D9] transition-all shadow-inner"
          >
            <component :is="typeIcon" class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-base font-bold text-slate-900 leading-tight group-hover:text-[#04C4D9] transition-colors">
              {{ client.name }}
            </h4>
            <span class="text-xs text-slate-500 font-medium block truncate max-w-[180px]">
              {{ client.company }}
            </span>
          </div>
        </div>

        <!-- Status Badge -->
        <span
          :class="[
            'text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border',
            statusBadge,
          ]"
        >
          {{ client.status }}
        </span>
      </div>

      <!-- Equipment / Vehicle Scope in Workshop -->
      <div class="mt-3 p-2.5 rounded-2xl bg-[#F2F2F2] border border-slate-200/60 text-xs">
        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
          Equipo o Flotilla en Taller:
        </div>
        <p class="font-medium text-slate-800 line-clamp-2">
          {{ client.equipmentDescription }}
        </p>
      </div>

      <!-- Address Snippet -->
      <div class="mt-3 flex items-start gap-2 text-xs text-slate-600">
        <MapPin class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <span class="line-clamp-1">{{ client.address }}, {{ client.city }}</span>
      </div>
    </div>

    <!-- Middle: Big Touch Action Shortcuts (Usabilidad Táctil de Taller) -->
    <div class="px-5 sm:px-6 py-3 bg-slate-50/90 border-t border-b border-slate-100 flex items-center gap-2">
      <!-- Direct Call Button -->
      <a
        :href="'tel:' + client.phone"
        class="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-[#0D0D0D] hover:bg-black text-white text-xs font-bold transition shadow-sm active:scale-95"
        title="Llamar al cliente"
      >
        <PhoneCall class="w-4 h-4 text-[#05F2F2]" />
        <span>Llamar</span>
      </a>

      <!-- Direct Map / Location Button -->
      <a
        :href="mapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white hover:bg-[#05C7F2]/10 border border-slate-200 hover:border-[#05C7F2] text-slate-800 hover:text-[#04C4D9] text-xs font-bold transition shadow-sm active:scale-95"
        title="Abrir ubicación en Google Maps"
      >
        <MapPin class="w-4 h-4 text-[#04C4D9]" />
        <span>Ubicación</span>
        <ExternalLink class="w-3 h-3 opacity-60" />
      </a>

      <!-- Direct WhatsApp Button -->
      <a
        :href="'https://wa.me/' + cleanPhoneForWa"
        target="_blank"
        rel="noopener noreferrer"
        class="min-h-[46px] min-w-[46px] inline-flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-sm active:scale-95"
        title="Enviar mensaje de WhatsApp"
      >
        <MessageCircle class="w-5 h-5" />
      </a>

      <!-- Edit Button -->
      <button
        type="button"
        @click="$emit('edit', client)"
        class="min-h-[46px] min-w-[46px] inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition shadow-sm active:scale-95"
        title="Editar información del cliente"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <!-- Card Bottom Footer: Assigned Role & Stats -->
    <div class="px-5 sm:px-6 py-3.5 flex items-center justify-between text-xs text-slate-500 bg-white">
      <div class="flex items-center gap-1.5">
        <span class="text-[11px]">Atiende:</span>
        <RoleBadge :role="client.assignedRole" size="sm" />
      </div>

      <div class="text-[11px] font-medium text-slate-500">
        <span class="font-bold text-slate-800">{{ client.totalServices }}</span> servicios
      </div>
    </div>
  </div>
</template>
