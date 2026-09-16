<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Client } from '@/services/clientService'
import type { UserRole } from '@/stores/auth'
import {
  X,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Wrench,
  CheckCircle2,
  Trash2,
} from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  clientToEdit?: Client | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', client: Partial<Client>): void
  (e: 'delete', id: string): void
}>()

const clientTypes: Client['type'][] = ['Flotilla', 'Empresa', 'Taller Asociado', 'Particular']
const statusList: Client['status'][] = ['Activo', 'En Servicio', 'Inactivo']
const roleOptions: UserRole[] = ['Usuario de Taller', 'Administrador']

// Form fields
const name = ref('')
const company = ref('')
const type = ref<Client['type']>('Empresa')
const phone = ref('')
const email = ref('')
const address = ref('')
const city = ref('Monterrey, N.L.')
const status = ref<Client['status']>('Activo')
const assignedRole = ref<UserRole>('Usuario de Taller')
const equipmentDescription = ref('')

// Initialize or reset
watch(
  () => props.clientToEdit,
  (edit) => {
    if (edit) {
      name.value = edit.name
      company.value = edit.company
      type.value = edit.type
      phone.value = edit.phone
      email.value = edit.email
      address.value = edit.address
      city.value = edit.city
      status.value = edit.status
      assignedRole.value = edit.assignedRole
      equipmentDescription.value = edit.equipmentDescription
    } else {
      name.value = ''
      company.value = ''
      type.value = 'Empresa'
      phone.value = ''
      email.value = ''
      address.value = ''
      city.value = 'Monterrey, N.L.'
      status.value = 'Activo'
      assignedRole.value = 'Usuario de Taller'
      equipmentDescription.value = ''
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!name.value.trim() || !phone.value.trim()) return

  emit('save', {
    id: props.clientToEdit ? props.clientToEdit.id : undefined,
    name: name.value.trim(),
    company: company.value.trim() || (type.value === 'Particular' ? 'Cliente Particular' : name.value.trim()),
    type: type.value,
    phone: phone.value.trim(),
    email: email.value.trim(),
    address: address.value.trim() || 'Dirección de taller pendiente',
    city: city.value.trim() || 'Monterrey, N.L.',
    status: status.value,
    assignedRole: assignedRole.value,
    equipmentDescription: equipmentDescription.value.trim() || 'Mantenimiento General Preventivo y Correctivo',
  })
}

const handleDelete = () => {
  if (props.clientToEdit && confirm(`¿Deseas eliminar al cliente ${props.clientToEdit.name}?`)) {
    emit('delete', props.clientToEdit.id)
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white w-full max-w-2xl rounded-[2rem] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 sm:py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-[#05C7F2]/15 text-[#04C4D9] flex items-center justify-center shadow-inner">
            <User v-if="!clientToEdit" class="w-6 h-6" />
            <Wrench v-else class="w-6 h-6 text-slate-800" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 leading-tight">
              {{ clientToEdit ? 'Editar Registro de Cliente' : 'Nuevo Cliente de Taller' }}
            </h3>
            <p class="text-xs text-slate-500">
              JR Blanco • Usabilidad táctil para taller
            </p>
          </div>
        </div>

        <!-- Big Touch Close Button -->
        <button
          type="button"
          @click="$emit('close')"
          class="min-w-[44px] min-h-[44px] rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 flex items-center justify-center transition active:scale-95"
          aria-label="Cerrar modal"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body (Formulario Táctil) -->
      <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
        <!-- Selector Táctil de Tipo de Cliente (Chips Grandes) -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Tipo de Cliente
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              v-for="t in clientTypes"
              :key="t"
              type="button"
              @click="type = t"
              :class="[
                'min-h-[48px] px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 border active:scale-95',
                type === t
                  ? 'bg-[#0D0D0D] text-white border-[#0D0D0D] shadow-md shadow-slate-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
              ]"
            >
              <span>{{ t }}</span>
            </button>
          </div>
        </div>

        <!-- Nombre y Empresa -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5 pl-1">
              Nombre de Contacto / Encargado *
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User class="w-5 h-5" />
              </div>
              <input
                v-model="name"
                type="text"
                required
                placeholder="Ej. Ing. Carlos Mendoza"
                class="w-full min-h-[48px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5 pl-1">
              Empresa o Razón Social
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Building2 class="w-5 h-5" />
              </div>
              <input
                v-model="company"
                type="text"
                placeholder="Ej. Transportes del Norte S.A."
                class="w-full min-h-[48px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
              />
            </div>
          </div>
        </div>

        <!-- Teléfono y Correo (Inputs grandes táctiles) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5 pl-1">
              Teléfono Directo (Móvil / WhatsApp) *
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Phone class="w-5 h-5" />
              </div>
              <input
                v-model="phone"
                type="tel"
                required
                placeholder="+52 81 1234 5678"
                class="w-full min-h-[48px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5 pl-1">
              Correo Electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail class="w-5 h-5" />
              </div>
              <input
                v-model="email"
                type="email"
                placeholder="contacto@empresa.com"
                class="w-full min-h-[48px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
              />
            </div>
          </div>
        </div>

        <!-- Dirección y Ciudad -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1.5 pl-1">
              Dirección de Taller / Empresa (Para GPS/Mapa)
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <MapPin class="w-5 h-5" />
              </div>
              <input
                v-model="address"
                type="text"
                placeholder="Av. Industrial 1420, Nave 5"
                class="w-full min-h-[48px] pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5 pl-1">
              Ciudad / Zona
            </label>
            <input
              v-model="city"
              type="text"
              placeholder="Monterrey, N.L."
              class="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
            />
          </div>
        </div>

        <!-- Descripción del Equipo o Vehículos de Taller -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5 pl-1">
            Equipo, Maquinaria o Vehículos que atiende en JR Blanco
          </label>
          <textarea
            v-model="equipmentDescription"
            rows="2"
            placeholder="Ej. Flotilla de 10 tractocamiones Kenworth, reparación de válvulas y monoblocks..."
            class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
          ></textarea>
        </div>

        <!-- Estado y Rol Asignado (Chips Táctiles) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Estado del Cliente
            </label>
            <div class="flex gap-2">
              <button
                v-for="s in statusList"
                :key="s"
                type="button"
                @click="status = s"
                :class="[
                  'flex-1 min-h-[44px] py-2 rounded-2xl text-xs font-bold transition border active:scale-95',
                  status === s
                    ? 'bg-[#05C7F2] text-black border-[#05C7F2] shadow-sm font-extrabold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
                ]"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Rol de Atención Primaria
            </label>
            <div class="flex gap-2">
              <button
                v-for="r in roleOptions"
                :key="r"
                type="button"
                @click="assignedRole = r"
                :class="[
                  'flex-1 min-h-[44px] py-2 px-2 rounded-2xl text-xs font-bold transition border active:scale-95',
                  assignedRole === r
                    ? 'bg-[#0D0D0D] text-white border-[#0D0D0D] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
                ]"
              >
                {{ r === 'Usuario de Taller' ? 'Taller' : 'Administrador' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Actions (Botones Gigantes de Usabilidad de Taller) -->
        <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            v-if="clientToEdit"
            type="button"
            @click="handleDelete"
            class="w-full sm:w-auto min-h-[48px] px-4 py-3 rounded-full text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Trash2 class="w-4 h-4" />
            <span>Eliminar Cliente</span>
          </button>
          <div v-else></div>

          <div class="w-full sm:w-auto flex items-center gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 sm:flex-initial min-h-[48px] px-6 py-3 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 sm:flex-initial min-h-[48px] px-8 py-3 rounded-full bg-[#0D0D0D] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 class="w-4 h-4 text-[#05F2F2]" />
              <span>{{ clientToEdit ? 'Guardar Cambios' : 'Registrar Cliente' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
