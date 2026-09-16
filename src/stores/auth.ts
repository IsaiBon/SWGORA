import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const isInitialized = ref(false)
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  function mapSupabaseUser(sbUser: SupabaseUser | null): User | null {
    if (!sbUser) return null
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Usuario',
      email: sbUser.email || '',
      role: sbUser.user_metadata?.role || 'Operador',
      avatar: sbUser.user_metadata?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    }
  }

  async function init() {
    if (isInitialized.value) return
    loading.value = true
    try {
      const currentSession = await authService.getSession()
      session.value = currentSession
      user.value = currentSession?.user ? mapSupabaseUser(currentSession.user) : null

      authService.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ? mapSupabaseUser(newSession.user) : null
      })
    } catch (err) {
      console.error('[AuthStore] Error inicializando sesión:', err)
    } finally {
      loading.value = false
      isInitialized.value = true
    }
  }

  async function login(email: string, password: string): Promise<void> {
    loading.value = true
    try {
      const data = await authService.signIn(email, password)
      session.value = data.session
      user.value = data.user ? mapSupabaseUser(data.user) : null
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, name?: string): Promise<void> {
    loading.value = true
    try {
      const data = await authService.signUp(email, password, name)
      if (data.session) {
        session.value = data.session
        user.value = data.user ? mapSupabaseUser(data.user) : null
      }
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    try {
      await authService.signOut()
    } finally {
      session.value = null
      user.value = null
      loading.value = false
    }
  }

  return {
    user,
    session,
    isAuthenticated,
    isInitialized,
    loading,
    init,
    login,
    register,
    logout,
  }
})
