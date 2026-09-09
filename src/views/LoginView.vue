<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('admin@swgora.com')
const password = ref('password123')
const rememberMe = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor ingresa correo y contraseña.'
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    authStore.login(email.value, password.value)
    isSubmitting.value = false
    router.push('/dashboard')
  }, 400)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h3 class="text-xl font-bold text-slate-900">Iniciar Sesión</h3>
      <p class="text-xs text-slate-500 mt-1">
        Ingresa tus credenciales para acceder a la consola de SWGORA.
      </p>
    </div>

    <!-- Alert demo info -->
    <div class="mb-5 p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-700">
      <CheckCircle class="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" />
      <div>
        <strong>Cuenta de demostración (Sprint 1):</strong><br />
        Las credenciales ya vienen precargadas para probar la autenticación de inmediato.
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div v-if="errorMessage" class="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
        {{ errorMessage }}
      </div>

      <!-- Email -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail class="w-4 h-4" />
          </div>
          <input
            v-model="email"
            type="email"
            required
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="nombre@empresa.com"
          />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock class="w-4 h-4" />
          </div>
          <input
            v-model="password"
            type="password"
            required
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="••••••••"
          />
        </div>
      </div>

      <!-- Remember & Forgot -->
      <div class="flex items-center justify-between text-xs pt-1">
        <label class="flex items-center gap-2 cursor-pointer text-slate-600">
          <input
            v-model="rememberMe"
            type="checkbox"
            class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>Recordar en este equipo</span>
        </label>
        <a href="#" class="text-indigo-600 hover:text-indigo-800 font-medium">¿Olvidaste tu contraseña?</a>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <span>{{ isSubmitting ? 'Verificando...' : 'Entrar al Sistema' }}</span>
        <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
      </button>

      <div class="text-center pt-3">
        <router-link to="/dashboard" class="text-xs text-slate-500 hover:text-slate-800 underline">
          Volver al Dashboard sin iniciar sesión
        </router-link>
      </div>
    </form>
  </div>
</template>
