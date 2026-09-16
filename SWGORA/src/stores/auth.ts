import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type UserRole = 'Administrador' | 'Usuario de Taller'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>({
    id: 'usr-1',
    name: 'Roberto Blanco',
    email: 'admin@jrblanco.com',
    role: 'Administrador',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
  })

  const isAuthenticated = computed(() => user.value !== null)

  function login(email: string, _password: string, role: UserRole = 'Administrador') {
    user.value = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0] || (role === 'Administrador' ? 'Roberto Blanco' : 'Técnico Taller'),
      email,
      role,
      avatar: role === 'Administrador'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    }
  }

  function setRole(newRole: UserRole) {
    if (user.value) {
      user.value.role = newRole
    }
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    setRole,
    logout,
  }
})
