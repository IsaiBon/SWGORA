<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, type UserRole } from '@/stores/auth'
import JrLogo from '@/components/JrLogo.vue'
import {
  ShieldCheck,
  Wrench,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// State
const username = ref('admin@jrblanco.com')
const password = ref('password123')
const selectedRole = ref<UserRole>('Administrador')
const isSubmitting = ref(false)
const errorMessage = ref('')

// Recovery modal state
const isRecoveryOpen = ref(false)
const recoveryInput = ref('')
const isRecoverySubmitting = ref(false)
const recoverySent = ref(false)

const handleLogin = () => {
  errorMessage.value = ''
  if (!username.value.trim()) {
    errorMessage.value = 'Por favor ingresa tu usuario o correo.'
    return
  }
  if (!password.value) {
    errorMessage.value = 'Por favor ingresa tu contraseña.'
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    authStore.login(username.value, password.value, selectedRole.value)
    isSubmitting.value = false
    router.push('/dashboard')
  }, 450)
}

const setDemoRole = (role: UserRole) => {
  selectedRole.value = role
  if (role === 'Administrador') {
    username.value = 'admin@jrblanco.com'
    password.value = 'password123'
  } else {
    username.value = 'taller@jrblanco.com'
    password.value = 'password123'
  }
}

const handleRecoverySubmit = () => {
  if (!recoveryInput.value.trim()) return
  isRecoverySubmitting.value = true
  setTimeout(() => {
    isRecoverySubmitting.value = false
    recoverySent.value = true
  }, 600)
}

const closeRecoveryModal = () => {
  isRecoveryOpen.value = false
  recoverySent.value = false
  recoveryInput.value = ''
}
</script>

<template>
  <div class="w-full max-w-sm mx-auto">
    <!-- Card Principal de Login (Fiel a la maqueta) -->
    <div
      class="bg-[#F2F2F2] rounded-[2.5rem] shadow-2xl p-7 sm:p-9 border border-white/80 transition-all duration-300"
    >
      <!-- Logo JR Blanco -->
      <div class="flex justify-center mb-6">
        <JrLogo :size="105" />
      </div>

      <!-- Selector de Rol para Demo/Pruebas -->
      <div class="mb-5 bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-1">
        <button
          type="button"
          @click="setDemoRole('Administrador')"
          :class="[
            'flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
            selectedRole === 'Administrador'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900',
          ]"
        >
          <ShieldCheck class="w-3.5 h-3.5 text-[#05C7F2]" />
          <span>Admin</span>
        </button>
        <button
          type="button"
          @click="setDemoRole('Usuario de Taller')"
          :class="[
            'flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all',
            selectedRole === 'Usuario de Taller'
              ? 'bg-[#0D0D0D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900',
          ]"
        >
          <Wrench class="w-3.5 h-3.5 text-amber-400" />
          <span>Taller</span>
        </button>
      </div>

      <!-- Mensaje de Error -->
      <div
        v-if="errorMessage"
        class="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
      >
        <AlertCircle class="w-4 h-4 flex-shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Campo Usuario -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5 pl-1">
            Usuario
          </label>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="usuario o correo"
            required
            class="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
          />
        </div>

        <!-- Campo Contraseña -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5 pl-1">
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            required
            class="w-full bg-white border border-slate-200 rounded-full px-5 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-[#05C7F2] focus:ring-2 focus:ring-[#05C7F2]/30"
          />
        </div>

        <!-- Botón Entrar (Negro estilo píldora de la maqueta) -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-[#0D0D0D] hover:bg-black text-white font-semibold py-3.5 px-6 rounded-full text-center text-sm tracking-wide transition-all shadow-md active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <span>{{ isSubmitting ? 'Ingresando...' : 'Entrar' }}</span>
            <ArrowRight v-if="!isSubmitting" class="w-4 h-4 text-[#05C7F2]" />
          </button>
        </div>

        <!-- Enlaces Secundarios: Registrarse y Recuperar Acceso -->
        <div class="pt-3 text-center space-y-2">
          <div>
            <button
              type="button"
              @click="isRecoveryOpen = true"
              class="text-xs text-slate-500 hover:text-slate-900 font-medium transition underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña? Recuperar acceso
            </button>
          </div>
          <div>
            <span class="text-xs text-slate-400">¿No tienes cuenta? </span>
            <button
              type="button"
              @click="isRecoveryOpen = true"
              class="text-xs font-semibold text-[#04C4D9] hover:text-[#05C7F2] transition"
            >
              Registrarse
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal de Recuperación de Acceso -->
    <div
      v-if="isRecoveryOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeRecoveryModal"
    >
      <div
        class="bg-[#F2F2F2] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 relative"
      >
        <!-- Botón Cerrar -->
        <button
          type="button"
          @click="closeRecoveryModal"
          class="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          aria-label="Cerrar modal"
        >
          <X class="w-5 h-5" />
        </button>

        <div v-if="!recoverySent">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-11 h-11 rounded-2xl bg-[#05C7F2]/15 text-[#04C4D9] flex items-center justify-center">
              <KeyRound class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#0D0D0D]">Recuperar Acceso</h3>
              <p class="text-xs text-slate-500">JR Blanco - Gestión y Taller</p>
            </div>
          </div>

          <p class="text-xs text-slate-600 mb-5 leading-relaxed">
            Ingresa tu correo electrónico corporativo o número telefónico registrado. Te enviaremos un código de seguridad para restablecer tu contraseña.
          </p>

          <form @submit.prevent="handleRecoverySubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1 pl-1">
                Correo o Teléfono
              </label>
              <input
                v-model="recoveryInput"
                type="text"
                placeholder="ejemplo@jrblanco.com o 55 1234 5678"
                required
                class="w-full bg-white border border-slate-300 rounded-full px-5 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#05C7F2]"
              />
            </div>

            <div class="pt-2 flex gap-3">
              <button
                type="button"
                @click="closeRecoveryModal"
                class="flex-1 py-3 px-4 rounded-full border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-200/60 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isRecoverySubmitting"
                class="flex-1 py-3 px-4 rounded-full bg-[#0D0D0D] hover:bg-black text-white text-xs font-semibold transition disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                <span>{{ isRecoverySubmitting ? 'Enviando...' : 'Enviar Código' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Estado de éxito en recuperación -->
        <div v-else class="text-center py-4 space-y-4">
          <div class="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 class="w-8 h-8" />
          </div>
          <div>
            <h4 class="text-base font-bold text-slate-900">¡Enlace Enviado!</h4>
            <p class="text-xs text-slate-500 mt-1">
              Hemos enviado las instrucciones a <strong>{{ recoveryInput }}</strong>. Revisa tu bandeja de entrada o mensajes.
            </p>
          </div>
          <button
            type="button"
            @click="closeRecoveryModal"
            class="w-full py-3 rounded-full bg-[#0D0D0D] text-white text-xs font-semibold hover:bg-black transition"
          >
            Entendido, volver al Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
