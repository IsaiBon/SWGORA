import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>({
    id: 'usr-1',
    name: 'Admin SWGORA',
    email: 'admin@swgora.com',
    role: 'Administrador',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
  })

  const isAuthenticated = computed(() => user.value !== null)

  function login(email: string, _password: string) {
    user.value = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0] || 'Usuario',
      email,
      role: 'Operador',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    }
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
})
